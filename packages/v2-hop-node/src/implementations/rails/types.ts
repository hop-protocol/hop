import type { BigNumber } from 'ethers'

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

export enum RailsEventName {
  TransferSent = 'TransferSent',
  TransferBonded = 'TransferBonded'
}
