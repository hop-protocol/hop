import { type RailsHop, RailsState } from '../types.js'
import type { StateTxContext } from '#state-machine/index.js'

export enum RailsTransferState {
  Sent = RailsState.Sent,
  Bonded = RailsState.Bonded
}

interface IRailsTransferShared extends StateTxContext {
  transferId: string
  pathId: string
}

export interface ISentRailsTransfer extends IRailsTransferShared {
  nextHops: RailsHop[]
}

export interface IBondedRailsTransfer extends IRailsTransferShared {
  // TODO
}

export type IRailsTransfer = ISentRailsTransfer | IBondedRailsTransfer
