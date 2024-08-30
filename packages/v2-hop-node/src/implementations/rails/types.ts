import type { BigNumber } from 'ethers'
import type { IRailsTransfer } from './transfer/types.js'

export enum RailsTransferState {

/**
 * Rails state data
 */

export enum State {
  Sent = 'sent',
  Bonded = 'bonded',
  Posted = 'posted',
  Claimed = 'claimed'
}

export type StateData = IRailsTransfer
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
