import type { BigNumber } from 'ethers'
import type {
  TransferSentSDK,
  BondInputSDK,
  PostClaimInputSDK
} from './RailsSDKWrapper.js'
import type { RelayChainId } from '#relayer/types.js'

export enum RailsClientName {
  Transfer = 'transfer',
  Claim = 'claim'
}

export enum RailsRelayType {
  Bond = 'bond',
  PostClaim = 'postClaim'
}

export type RailsHop = {
  pathId: string
  maxTotalSent: BigNumber
  attestedClaimId: string
}

export type RailsPath = {
  chainId: string
  token: string
  counterpartChainId: string
  counterpartToken: string
  initialReserve: string
}

export type TransferSentInput = TransferSentSDK
export type BondInput = BondInputSDK
export type PostClaimInput = PostClaimInputSDK
export type RailsRelayItem = (TransferSentInput | BondInput | PostClaimInput) & RelayChainId
