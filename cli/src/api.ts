import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { Whistle, type WhistlePrivateState, witnesses } from '@midnight-whistle/contract';
import * as ledger from '@midnight-ntwrk/ledger-v7';
import { unshieldedToken } from '@midnight-ntwrk/ledger-v7';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { type FinalizedTxData, type MidnightProvider, type WalletProvider } from '@midnight-ntwrk/midnight-js-types';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { HDWallet, Roles, generateRandomSeed } from '@midnight-ntwrk/wallet-sdk-hd';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import {
  createKeystore,
  InMemoryTransactionHistoryStorage,
  PublicKey,
  UnshieldedWallet,
  type UnshieldedKeystore,
} from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { assertIsContractAddress, toHex } from '@midnight-ntwrk/midnight-js-utils';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { Buffer } from 'buffer';
import * as Rx from 'rxjs';
import {
  MidnightBech32m,
  ShieldedAddress,
  ShieldedCoinPublicKey,
  ShieldedEncryptionPublicKey,
} from '@midnight-ntwrk/wallet-sdk-address-format';
import path from 'path';
import { pino } from 'pino';

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export { logger };

// Workaround for signRecipe bug in wallet-sdk-facade 1.0.0
const signTransactionIntents = (
  tx: { intents?: Map<number, any> },
  signFn: (payload: Uint8Array) => ledger.Signature,
  proofMarker: 'proof' | 'pre-proof',
): void => {
  logger.debug({ proofMarker }, 'Signing transaction intents');
  if (!tx.intents || tx.intents.size === 0) {
    logger.warn('No intents to sign');
    return;
  }

  for (const segment of tx.intents.keys()) {
    logger.debug({ segment }, 'Processing intent segment');
    const intent = tx.intents.get(segment);
    if (!intent) continue;

    const cloned = ledger.Intent.deserialize<ledger.SignatureEnabled, ledger.Proofish, ledger.PreBinding>(
      'signature',
      proofMarker,
      'pre-binding',
      intent.serialize(),
    );

    const sigData = cloned.signatureData(segment);
    const signature = signFn(sigData);

    if (cloned.fallibleUnshieldedOffer) {
      const sigs = cloned.fallibleUnshieldedOffer.inputs.map(
        (_: ledger.UtxoSpend, i: number) => cloned.fallibleUnshieldedOffer!.signatures.at(i) ?? signature,
      );
      cloned.fallibleUnshieldedOffer = cloned.fallibleUnshieldedOffer.addSignatures(sigs);
    }

    if (cloned.guaranteedUnshieldedOffer) {
      const sigs = cloned.guaranteedUnshieldedOffer.inputs.map(
        (_: ledger.UtxoSpend, i: number) => cloned.guaranteedUnshieldedOffer!.signatures.at(i) ?? signature,
      );
      cloned.guaranteedUnshieldedOffer = cloned.guaranteedUnshieldedOffer.addSignatures(sigs);
    }

    tx.intents.set(segment, cloned);
  }
  logger.info('Transaction intents signed successfully');
};

/**
 * Create the unified WalletProvider & MidnightProvider for midnight-js.
 * Bridges wallet-sdk-facade to the midnight-js contract API.
 */
export const createWalletAndMidnightProvider = async (
  ctx: WalletContext,
): Promise<WalletProvider & MidnightProvider> => {
  logger.info('Creating Midnight and Wallet providers');
  const state = await Rx.firstValueFrom(ctx.wallet.state().pipe(Rx.filter((s) => s.isSynced)));

  return {
    getCoinPublicKey() {
      return state.shielded.coinPublicKey.toHexString();
    },
    getEncryptionPublicKey() {
      return state.shielded.encryptionPublicKey.toHexString();
    },
    async balanceTx(tx, ttl?) {
      logger.debug('Balancing transaction');
      const recipe = await ctx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: ctx.shieldedSecretKeys, dustSecretKey: ctx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );

      const signFn = (payload: Uint8Array) => ctx.unshieldedKeystore.signData(payload);

      logger.debug('Applying signRecipe workaround for base transaction');
      signTransactionIntents(recipe.baseTransaction, signFn, 'proof');

      if (recipe.balancingTransaction) {
        logger.debug('Applying signRecipe workaround for balancing transaction');
        signTransactionIntents(recipe.balancingTransaction, signFn, 'pre-proof');
      }

      return ctx.wallet.finalizeRecipe(recipe);
    },
    submitTx(tx) {
      logger.info({ txHash: toHex(tx.hash) }, 'Submitting transaction to network');
      return ctx.wallet.submitTransaction(tx) as any;
    },
  };
};

// Contract configuration
const zkConfigPath = path.resolve(__dirname, '../../contract/src/managed/whistle');
logger.debug({ zkConfigPath }, 'Loading ZK assets');

const whistleCompiledContract = CompiledContract.make('whistle', Whistle.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

export interface WalletContext {
  wallet: WalletFacade;
  shieldedSecretKeys: ledger.ZswapSecretKeys;
  dustSecretKey: ledger.DustSecretKey;
  unshieldedKeystore: UnshieldedKeystore;
}

export interface WhistleProviders {
  privateStateProvider: any;
  publicDataProvider: any;
  zkConfigProvider: any;
  proofProvider: any;
  walletProvider: any;
  midnightProvider: any;
}

export const deploy = async (
  providers: WhistleProviders,
  commitment: Uint8Array,
): Promise<any> => {
  logger.info('Deploying MidnightWhistle contract');
  const whistleContract = await deployContract(providers, {
    compiledContract: whistleCompiledContract,
    privateStateId: 'whistlePrivateState',
    initialPrivateState: { membershipSecret: commitment },
  });
  logger.info({ address: whistleContract.deployTxData.public.contractAddress }, 'Whistle contract deployed successfully');
  return whistleContract;
};

export const registerMembership = async (whistleContract: any, commitment: Uint8Array, walletAddress: Uint8Array): Promise<FinalizedTxData> => {
  logger.info('Calling register_membership() circuit');
  const finalizedTxData = await whistleContract.callTx.register_membership(commitment, walletAddress);
  logger.info({ txHash: finalizedTxData.public.txHash }, 'register_membership() tx finalized');
  return finalizedTxData.public;
};

export const proveMembership = async (whistleContract: any, secret: Uint8Array, walletAddress: Uint8Array): Promise<FinalizedTxData> => {
  logger.info('Calling prove_membership() circuit');
  const finalizedTxData = await whistleContract.callTx.prove_membership(secret, walletAddress);
  logger.info({ txHash: finalizedTxData.public.txHash }, 'prove_membership() tx finalized');
  return finalizedTxData.public;
};

export const submitReport = async (
  whistleContract: any,
  reportHash: Uint8Array,
  secret: Uint8Array,
  walletAddress: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info('Calling submit_report() circuit');
  const finalizedTxData = await whistleContract.callTx.submit_report(reportHash, secret, walletAddress);
  logger.info({ txHash: finalizedTxData.public.txHash }, 'submit_report() tx finalized');
  return finalizedTxData.public;
};

export const proveSeverity = async (
  whistleContract: any,
  actualSeverity: number,
  minSeverity: number,
  secret: Uint8Array,
  walletAddress: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info({ actualSeverity, minSeverity }, 'Calling prove_severity() circuit');
  const finalizedTxData = await whistleContract.callTx.prove_severity(minSeverity, actualSeverity, secret, walletAddress);
  logger.info({ txHash: finalizedTxData.public.txHash }, 'prove_severity() tx finalized');
  return finalizedTxData.public;
};

export const proveFinancialImpact = async (
  whistleContract: any,
  actualAmount: number,
  minAmount: number,
  secret: Uint8Array,
  walletAddress: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info({ actualAmount, minAmount }, 'Calling prove_financial_impact() circuit');
  const finalizedTxData = await whistleContract.callTx.prove_financial_impact(minAmount, actualAmount, secret, walletAddress);
  logger.info({ txHash: finalizedTxData.public.txHash }, 'prove_financial_impact() tx finalized');
  return finalizedTxData.public;
};

export const proveWitnessCount = async (
  whistleContract: any,
  actualWitnesses: number,
  minWitnesses: number,
  secret: Uint8Array,
  walletAddress: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info({ actualWitnesses, minWitnesses }, 'Calling prove_witness_count() circuit');
  const finalizedTxData = await whistleContract.callTx.prove_witness_count(minWitnesses, actualWitnesses, secret, walletAddress);
  logger.info({ txHash: finalizedTxData.public.txHash }, 'prove_witness_count() tx finalized');
  return finalizedTxData.public;
};
