import type { RailsHop } from '../../types.js'
import type { BigNumber } from 'ethers'
import type { StateTxContext } from '#state-machine/index.js'
import { RailsEventName, RailsMethodName } from '#clients/rails/RailsSDKWrapper.js'

export enum RailsClaimMethodName {
  PushClaim = RailsMethodName.PushClaim,
  RemoveClaim = RailsMethodName.RemoveClaim,
  ReaddClaim = RailsMethodName.ReaddClaim
}

export enum RailsClaimEventName {
  TransferSent = RailsEventName.TransferSent,
  ClaimPushed = RailsEventName.ClaimPushed,
  ClaimRemoved = RailsEventName.ClaimRemoved,
  ClaimReadded = RailsEventName.ClaimReadded
}

export enum RailsClaimState {
  Sent = 'sent',
  Pushed = 'pushed',
  Removed = 'removed',
  Readded = 'readded',
}

interface IRailsClaimShared extends StateTxContext {
  pathId: string
}

export interface ISentRailsClaim extends IRailsClaimShared {
  transferId: string
  to: string
  amount: BigNumber
  sourcePool: BigNumber
  hops: RailsHop[]
}

export interface IPushedRailsClaim extends IRailsClaimShared {
  claimId: string
}

export interface IRemovedRailsClaim extends IRailsClaimShared {
  claimId: string
}

export interface IReaddedRailsClaim extends IRailsClaimShared {
  claimId: string
}

export type IRailsClaim = ISentRailsClaim | IPushedRailsClaim | IRemovedRailsClaim | IReaddedRailsClaim