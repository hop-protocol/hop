import type { RailsHop } from '../../types.js'
import type { BigNumber } from 'ethers'
import type { StateTxContext } from '#state-machine/index.js'

export enum RailsTransferMethodName {
  Bond = RailsMethodName.Bond,
  PostClaim = RailsMethodName.PostClaim
}

export enum RailsTransferEventName {
  TransferSent = RailsEventName.TransferSent,
  ClaimBonded = RailsEventName.ClaimBonded
}

export enum RailsTransferState {
  Sent = 'sent',
  Bonded = 'bonded'
}

interface IRailsTransferShared extends StateTxContext {
  pathId: string
  claimId: string
  to: string
  amount: BigNumber
}

export interface ISentRailsTransfer extends IRailsTransferShared {
  sourcePool: BigNumber
  sourceTotalFraudulent: BigNumber
  hops: RailsHop[]
}

export interface IBondedRailsClaim extends IRailsTransferShared {
  bonderFee: BigNumber
}

export type IRailsTransfer = ISentRailsTransfer | IBondedRailsClaim