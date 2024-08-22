export enum RailsTransferState {
  Sent = 'sent',
  Posted = 'posted',
  Bonded = 'bonded'
}

interface IRailsTransferShared {
  pathId: string
  transferId: string
}

export interface ISentRailsTransfer extends IRailsTransferShared {
  // TODO: Fill in
  // address indexed to,
  // uint256 amount,
  // uint256 totalSent,
  // bytes32 attestedClaimId,
  // uint256 attestedTotalClaims,
  // Hop[] nextHops
  sentTxHash: string
  sentTimestampMs: number
}

export interface IPostedRailsTransfer extends IRailsTransferShared {
  // TODO: Add
  relayTxHash: string
  relayTimestampMs: number
}

export interface IBondedRailsTransfer extends IRailsTransferShared {
  // TODO: Add
  bondedTxHash: string
  bondedTimestampMs: number
}

export type IRailsTransfer = ISentRailsTransfer | IPostedRailsTransfer | IBondedRailsTransfer
