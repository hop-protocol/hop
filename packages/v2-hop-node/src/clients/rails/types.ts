import { RailsEventNameSDK } from './RailsSDKWrapper.js'
import type { BigNumber } from 'ethers'

export enum RailsClientName {
  Transfer = 'transfer',
  Claim = 'claim'
}

export enum RailsEventName {
  TransferSent = RailsEventNameSDK.TransferSent,
  TransferBonded = RailsEventNameSDK.TransferBonded,
  ClaimPosted = RailsEventNameSDK.ClaimPosted,
  ClaimConfirmed = RailsEventNameSDK.ClaimConfirmed
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
