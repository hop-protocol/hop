import type { RailsHop } from '../../types.js'
import type { StateTxContext } from '#state-machine/index.js'
import { RailsEventName } from '#clients/rails/RailsSDKWrapper.js'

export enum RailsTransferEventName {
  TransferSent = RailsEventName.TransferSent,
  TransferBonded = RailsEventName.TransferBonded
}

export enum RailsTransferState {
  Sent = 'sent',
  Bonded = 'bonded'
}

interface IRailsTransferShared extends StateTxContext {
  pathId: string
}

export interface ISentRailsTransfer extends IRailsTransferShared {
  transferId: string
  nextHops: RailsHop[]
}

export interface IBondedRailsTransfer extends IRailsTransferShared {
  claimId: string
  // TODO
}

export type IRailsTransfer = ISentRailsTransfer | IBondedRailsTransfer
