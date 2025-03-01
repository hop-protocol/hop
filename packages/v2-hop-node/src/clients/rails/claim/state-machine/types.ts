import type { StateTxContext } from '#state-machine/index.js'
import { RailsEventName } from '#clients/rails/RailsSDKWrapper.js'

export enum RailsClaimEventName {
  TransferSent = RailsEventName.TransferSent,
  ClaimPosted = RailsEventName.ClaimPosted,
  ClaimRemoved = RailsEventName.ClaimRemoved,
  // ClaimReadded = RailsEventName.ClaimReadded
  // Confirmed = RailsEventName.ClaimConfirmed
}

export enum RailsClaimState {
  Sent = 'sent',
  Posted = 'posted',
  Removed = 'removed',
  // Readded = 'readded',
  // Confirmed = 'confirmed'
}

interface IRailsClaimShared extends StateTxContext {
  transferId: string
  pathId: string
}

export interface ISentRailsClaim extends IRailsClaimShared {
  // TODO
}

export interface IPostedRailsClaim extends IRailsClaimShared {
  // TODO
}

export interface IRemovedRailsClaim extends IRailsClaimShared {
  // TODO
}

export interface IConfirmedRailsClaim extends IRailsClaimShared {
  // TODO
}


export type IRailsClaim = ISentRailsClaim | IPostedRailsClaim | IRemovedRailsClaim | IConfirmedRailsClaim
