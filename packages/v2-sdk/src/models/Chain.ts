import { ChainConfig } from '#config/chains/types.js'
import { allNetworks, allChains } from '#config/chains/index.js'

export type Chainish = Chain | ChainConfig | string

export class Chain {
  readonly name: string
  readonly slug: string
  readonly image: string
  readonly nativeTokenSymbol: string
  readonly primaryColor: string
  readonly isLayer1: boolean
  readonly isRollup: boolean
  readonly isManualRelayOnL2: boolean
  readonly averageBlockTimeMs: number

  readonly chainId: string
  readonly rpcUrl: string
  readonly fallbackRpcUrls: string[]
  readonly explorerUrl: string
  readonly subgraphUrl: string
  readonly etherscanApiUrl: string
  readonly multicall: string
  readonly parentChainId: string
  readonly txOverrides: {
    readonly minGasPrice?: number
    readonly minGasLimit?: number
  }

  constructor(config: ChainConfig) {
    this.name = config.name
    this.slug = config.slug
    this.image = config.image
    this.nativeTokenSymbol = config.nativeTokenSymbol
    this.primaryColor = config.primaryColor
    this.isLayer1 = config.isLayer1
    this.isRollup = config.isRollup
    this.isManualRelayOnL2 = config.isManualRelayOnL2
    this.averageBlockTimeMs = config.averageBlockTimeMs

    this.chainId = config.chainId
    this.rpcUrl = config.rpcUrl
    this.fallbackRpcUrls = config.fallbackRpcUrls ?? []
    this.explorerUrl = config.explorerUrls[0]
    this.subgraphUrl = config.subgraphUrl
    this.etherscanApiUrl = config.etherscanApiUrl
    this.multicall = config.multicall
    this.parentChainId = config.parentChainId
    this.txOverrides = config.txOverrides
  }

  static getChain(chain: Chainish): Chain {
    if (chain instanceof Chain) {
      return chain
    }
    if (typeof chain === 'string') {
      const chainId = Chain.#preprocessChainId(chain)
      const chainConfig = allChains[chainId]
      if (!chainConfig) {
        throw new Error(`Chain with slug "${chain}" not found`)
      }
      return new Chain(chainConfig)
    }
    return new Chain(chain)
  }

  static #preprocessChainId(chainId: string): string {
    if (chainId.startsWith('0x')) {
      const decimal = parseInt(chainId.substring(2), 16)
      if (isNaN(decimal)) {
        throw new Error(`Invalid hexadecimal chainId: ${chainId}`)
      }
      return decimal.toString()
    }
  
    const decimal = parseInt(chainId, 10)
    if (isNaN(decimal)) {
      throw new Error(`Invalid decimal chainId: ${chainId}`)
    }

    return chainId
  }

  static isValidChainSlug(slug: string): boolean {
    // return true if some network has some chain with the given slug
    return Object.values(allNetworks).some(network =>
      Object.values(network.chains).some(chain =>
        chain.slug === slug
      )
    )
  }

  toString(): string {
    return this.name
  }

  eq(otherChain: Chainish): boolean {
    return this.chainId === Chain.getChain(otherChain).chainId
  }
}

export const getChain = Chain.getChain
export const isValidChainSlug = Chain.isValidChainSlug
