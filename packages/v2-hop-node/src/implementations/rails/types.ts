import type { BigNumber } from 'ethers'
import type { IRailsTransfer } from './transfer/types.js'

/**
 * Rails state data
 */

export enum RailsState {
  Sent = 'sent',
  Bonded = 'bonded',
  // Posted = 'posted',
  // Claimed = 'claimed'
}

export type RailsStateData = IRailsTransfer

/**
 * General
 */

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
