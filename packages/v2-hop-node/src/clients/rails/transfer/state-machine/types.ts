import type { RailsHop } from '../../types.js'
import type { BigNumber } from 'ethers'
import type { StateTxContext } from '#state-machine/index.js'
import { RailsEventName, RailsMethodName } from '#clients/rails/RailsSDKWrapper.js'

export enum RailsTransferMethodName {
  Bond = RailsMethodName.Bond,
  PushClaim = RailsMethodName.PushClaim
}

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
  to: string
  amount: BigNumber
  sourcePool: BigNumber
  hops: RailsHop[]
}

export interface IBondedRailsTransfer extends IRailsTransferShared {
  claimId: string
}

export type IRailsTransfer = ISentRailsTransfer | IBondedRailsTransfer