import { type BigNumberish } from 'ethers'
import type { Signer, providers } from 'ethers'

export type { ClaimStruct, HopStruct } from '#contracts/index.js'

export type RailsPath = {
  chainId: string
  token: string
  counterpartChainId: string
  counterpartToken: string
  initialReserve: BigNumberish
}


/////// Mocks until we have a real implementation //////

export type Address = string
export class Token {
  readonly address: string

  constructor(address: string) {
    this.address = address
  }
}

export class Chain {
  readonly chainId: string
  readonly signerOrProvider: Signer | providers.Provider

  constructor(chainId: string, signerOrProvider: Signer | providers.Provider) {
    this.chainId = chainId
    this.signerOrProvider = signerOrProvider
  }
}
