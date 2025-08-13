import { type RailsHop, RailsBonderEventName, RailsBonderMethodName } from '../../types.js'
import type { BigNumber } from 'ethers'
import type { StateTxContext } from '#state-machine/index.js'

export enum RailsClaimMethodName {
  PostClaim = RailsBonderMethodName.PostClaim,
  // RemoveClaim = RailsBonderMethodName.RemoveClaim,
  // ReaddClaim = RailsBonderMethodName.ReaddClaim
}

export enum RailsClaimEventName {
  TransferSent = RailsBonderEventName.TransferSent,
  ClaimPosted = RailsBonderEventName.ClaimPosted,
  // ClaimRemoved = RailsBonderEventName.ClaimRemoved,
  // ClaimReadded = RailsBonderEventName.ClaimReadded
}

export enum RailsClaimState {
  Sent = 'sent',
  Posted = 'posted',
  // Removed = 'removed',
  // Readded = 'readded',
}

interface IRailsClaimShared extends StateTxContext {
  pathId: string
  claimId: string
}

export interface ISentRailsClaim extends IRailsClaimShared {
  to: string
  amount: BigNumber
  sourcePool: BigNumber
  sourceTotalFraudulent: BigNumber
  hops: RailsHop[]
  maxBonderFee: BigNumber
  attestedClaimId: string
  nextHopsHash: string
}

export interface IPostedRailsClaim extends IRailsClaimShared {
  amountOut: BigNumber
}

// export interface IRemovedRailsClaim extends IRailsClaimShared {
// }

// export interface IReaddedRailsClaim extends IRailsClaimShared {
// }

export type IRailsClaim = ISentRailsClaim | IPostedRailsClaim // | IRemovedRailsClaim | IReaddedRailsClaim