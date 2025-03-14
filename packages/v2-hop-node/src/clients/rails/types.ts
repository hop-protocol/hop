import type { BigNumber } from 'ethers'
import type {
  BondInput,
  PushClaimInput,
  RemoveClaimInput,
  ReaddClaimInput
} from './RailsSDKWrapper.js'

export enum RailsClientName {
  Transfer = 'transfer',
  Claim = 'claim'
}

export enum RailsRelayType {
  Bond = 'bond',
  PushClaim = 'pushClaim'
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

export type {
  BondInput,
  PushClaimInput,
  RemoveClaimInput,
  ReaddClaimInput
}

export type RailsRelayItem =
  | BondInput
  | PushClaimInput
  | RemoveClaimInput
  | ReaddClaimInput
