import { Whistle, type WhistlePrivateState } from '@midnight-whistle/contract';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ImpureCircuitId } from '@midnight-ntwrk/compact-js';

export type WhistleCircuits = ImpureCircuitId<Whistle.Contract<WhistlePrivateState>>;

export const WhistlePrivateStateId = 'whistlePrivateState';

export type WhistleProviders = MidnightProviders<WhistleCircuits, typeof WhistlePrivateStateId, WhistlePrivateState>;

export type WhistleContract = Whistle.Contract<WhistlePrivateState>;

export type DeployedWhistleContract = DeployedContract<WhistleContract> | FoundContract<WhistleContract>;
