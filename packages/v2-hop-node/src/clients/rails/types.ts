import type { BigNumber } from 'ethers'
import type {
  BondInputSDK,
  PostClaimInputSDK
} from './RailsSDKWrapper.js'
import type { RelayChainId } from '#relayer/types.js'

export enum RailsClientName {
  Transfer = 'transfer',
  Claim = 'claim'
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

export type BondInput = BondInputSDK
export type PostClaimInput = PostClaimInputSDK
export type RailsRelayItem = (BondInput | PostClaimInput) & RelayChainId
