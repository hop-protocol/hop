import type { BigNumber } from 'ethers'

export enum RailsTransferState {
  Sent = 'sent',
  Posted = 'posted',
  Bonded = 'bonded'
}

export type RailsHop = {
  pathId: string
  maxTotalSent: BigNumber
  attestedClaimId: string
}

export type RailsPath = {
  srcChainId: string
  srcToken: string
  destChainId: string
  destToken: string
}

interface IRailsTransferShared {
  transferId: string
  pathId: string
}

export interface ISentRailsTransfer extends IRailsTransferShared {
  to: string
  amount: BigNumber
  totalSent: BigNumber
  attestedClaimId: string
  attestedTotalClaims: BigNumber
  nextHops: RailsHop[]
  sentTxHash: string
  sentTimestampMs: number
}

export interface IPostedRailsTransfer extends IRailsTransferShared {
  // TODO: SDK: Fill in
  postedTxHash: string
  postedTimestampMs: number
}

export interface IBondedRailsTransfer extends IRailsTransferShared {
  to: string
  amountOut: BigNumber
  bondedTxHash: string
  bondedTimestampMs: number
}

export type IRailsTransfer = ISentRailsTransfer | IPostedRailsTransfer | IBondedRailsTransfer
