import type { RailsHop } from '../../types.js'
import type { BigNumber } from 'ethers'
import type { StateTxContext } from '#state-machine/index.js'
import { RailsEventName, RailsMethodName } from '#clients/rails/RailsSDKWrapper.js'

export enum RailsClaimMethodName {
  PushClaim = RailsMethodName.PushClaim,
  // RemoveClaim = RailsMethodName.RemoveClaim,
  // ReaddClaim = RailsMethodName.ReaddClaim
}

export enum RailsClaimEventName {
  TransferSent = RailsEventName.TransferSent,
  ClaimPosted = RailsEventName.ClaimPosted,
  // ClaimRemoved = RailsEventName.ClaimRemoved,
  // ClaimReadded = RailsEventName.ClaimReadded
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
  hops: RailsHop[]
  maxBonderFee: BigNumber
  attestedClaimId: string
  nextHopsHash: string
}

export interface IPushedRailsClaim extends IRailsClaimShared {
}

// export interface IRemovedRailsClaim extends IRailsClaimShared {
// }

// export interface IReaddedRailsClaim extends IRailsClaimShared {
// }

export type IRailsClaim = ISentRailsClaim | IPushedRailsClaim
// export type IRailsClaim = ISentRailsClaim | IPostedRailsClaim | IRemovedRailsClaim | IReaddedRailsClaim