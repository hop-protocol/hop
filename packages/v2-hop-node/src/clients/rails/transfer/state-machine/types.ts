import { type RailsHop, RailsBonderEventName, RailsBonderMethodName } from '../../types.js'
import type { BigNumber } from 'ethers'
import type { StateTxContext } from '#state-machine/index.js'

export enum RailsTransferMethodName {
  Bond = RailsBonderMethodName.Bond,
  PostClaim = RailsBonderMethodName.PostClaim
}

export enum RailsTransferEventName {
  TransferSent = RailsBonderEventName.TransferSent,
  ClaimBonded = RailsBonderEventName.ClaimBonded
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