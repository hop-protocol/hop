import { type BigNumberish } from 'ethers'
import type { Signer, providers } from 'ethers'

export type { ClaimStruct, HopStruct } from './contracts/types/index.js'

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

  eq(u: Chain): boolean {
    return this.chainId === u.chainId && this.signerOrProvider === u.signerOrProvider
  }
}

export class Path {
  chain: Chain
  token: string
  counterpartChain: Chain
  counterpartToken: string
  initialReserve: BigNumberish

  constructor(params: any) {
    this.chain = params.chainId
    this.token = params.token
    this.counterpartChain = params.counterpartChainId
    this.counterpartToken = params.counterpartToken
    this.initialReserve = params.initialReserve
  }

  get pathId(): string {
    // todo fmt path
    return ''
  }


  eq(u: Path): boolean {
    return (
      this.chain.eq(u.chain) &&
      this.token === u.token &&
      this.counterpartChain.eq(u.counterpartChain) &&
      this.counterpartToken === u.counterpartToken &&
      this.initialReserve === u.initialReserve
    )
  }

  getOppositeChain(chain: Chain): Chain {
    if (chain.chainId === this.chain.chainId) {
      return this.counterpartChain
    }
    if (chain.chainId === this.counterpartChain.chainId) {
      return this.chain
    }
    throw new Error(`Chain ${chain.chainId} is not part of the path`)
  }

  hasChains(from: Chain, to: Chain): boolean {
    return (
      (from.chainId === this.chain.chainId && to.chainId === this.counterpartChain.chainId) ||
      (from.chainId === this.counterpartChain.chainId && to.chainId === this.chain.chainId)
    )
  }
}
