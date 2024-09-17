import type { StateTxContext } from '#state-machine/index.js'

export enum RailsClaimState {
  Sent = 'sent',
  Posted = 'posted',
  Removed = 'removed',
  Confirmed = 'confirmed'
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
