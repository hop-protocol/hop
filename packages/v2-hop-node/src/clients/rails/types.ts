import type { BigNumber } from 'ethers'
import type {
  BondInput,
  PostClaimInput,
  RemoveClaimInput,
  ReaddClaimInput
} from './RailsSDKWrapper.js'

export enum RailsClientName {
  Transfer = 'transfer',
  Claim = 'claim'
}

// TODO: Get from SDk
export type RailsHop = {
  pathId: string
  maxBonderFee: BigNumber
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

export type RailsPathAddresses = {
  pathAddress: string
  counterpartPathAddress: string
}

export type RailsPathWithAddresses = RailsPath & {
  pathAddresses: RailsPathAddresses
}

export type {
  BondInput,
  PostClaimInput,
  RemoveClaimInput,
  ReaddClaimInput
}

export type RailsRelayItem =
  | BondInput
  | PostClaimInput
  | RemoveClaimInput
  | ReaddClaimInput
