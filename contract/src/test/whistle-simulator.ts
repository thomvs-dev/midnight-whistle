import { Whistle, type WhistlePrivateState } from '@midnight-whistle/contract';
import { Simulator, type CircuitContext, type Contract } from '@midnight-ntwrk/compact-runtime';

export class WhistleSimulator {
  readonly contract: Contract<WhistlePrivateState>;
  circuitContext: CircuitContext<WhistlePrivateState>;

  constructor() {
    this.contract = Whistle.Contract.make();
    this.circuitContext = Simulator.createContext(this.contract, { membershipSecret: new Uint8Array(32) });
  }

  registerMembership(commitment: Uint8Array): void {
    const walletAddress = new Uint8Array(32);
    const result = Simulator.run(this.contract.circuits.register_membership, this.circuitContext, [commitment, walletAddress]);
    this.circuitContext = result.context;
  }

  proveMembership(secret: Uint8Array): void {
    const walletAddress = new Uint8Array(32);
    const result = Simulator.run(this.contract.circuits.prove_membership, this.circuitContext, [secret, walletAddress]);
    this.circuitContext = result.context;
  }

  submitReport(reportHash: Uint8Array, secret: Uint8Array): void {
    const walletAddress = new Uint8Array(32);
    const result = Simulator.run(this.contract.circuits.submit_report, this.circuitContext, [reportHash, secret, walletAddress]);
    this.circuitContext = result.context;
  }

  proveSeverity(minSeverity: bigint, actualSeverity: bigint, secret: Uint8Array): void {
    const walletAddress = new Uint8Array(32);
    const result = Simulator.run(this.contract.circuits.prove_severity, this.circuitContext, [minSeverity, actualSeverity, secret, walletAddress]);
    this.circuitContext = result.context;
  }

  proveFinancialImpact(minAmount: bigint, actualAmount: bigint, secret: Uint8Array): void {
    const walletAddress = new Uint8Array(32);
    const result = Simulator.run(this.contract.circuits.prove_financial_impact, this.circuitContext, [minAmount, actualAmount, secret, walletAddress]);
    this.circuitContext = result.context;
  }

  proveWitnessCount(minWitnesses: bigint, actualWitnesses: bigint, secret: Uint8Array): void {
    const walletAddress = new Uint8Array(32);
    const result = Simulator.run(this.contract.circuits.prove_witness_count, this.circuitContext, [minWitnesses, actualWitnesses, secret, walletAddress]);
    this.circuitContext = result.context;
  }
}
