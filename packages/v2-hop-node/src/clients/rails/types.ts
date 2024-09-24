import type { BigNumber } from 'ethers'
import type {
  BondInput as BondInputSDK,
  PostClaimInput as PostClaimInputSDK
} from './RailsSDKWrapper.js'

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
  srcChainId: string
  srcToken: string
  destChainId: string
  destToken: string
}

export type BondInput = BondInputSDK
export type PostClaimInput = PostClaimInputSDK
export type RailsRelayItem = BondInput | PostClaimInput
