import type { StateTxContext } from '#state-machine/index.js'

export enum RailsClaimState {
  Sent = 'sent',
  Posted = 'posted',
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

export interface IConfirmedRailsClaim extends IRailsClaimShared {
  // TODO
}

export type IRailsClaim = ISentRailsClaim | IPostedRailsClaim | IConfirmedRailsClaim
