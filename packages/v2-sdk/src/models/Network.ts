import { Chain } from './Chain.js'
import type { NetworkConfig } from '../config/chains/types.js'
import { allNetworks } from '../config/chains/index.js'

export type Networkish = Network | NetworkConfig | string

export class Network {
  readonly slug: string
  readonly isMainnet: boolean
  readonly chains: { [key: string]: Chain }

  constructor(config: NetworkConfig) {
    this.slug = config.slug
    this.isMainnet = config.isMainnet
    this.chains = Object.fromEntries(
      Object.entries(config.chains).map(([chainSlug, chainConfig]) => [
        chainSlug,
        new Chain(chainConfig)
      ])
    )
  }

  static getNetwork(network: Networkish): Network {
    if (network instanceof Network) {
      return network
    } else if (typeof network === 'string') {
      const networkConfig = allNetworks[network]
      if (!networkConfig) {
        throw new Error(`Network with slug "${network}" not found`)
      }
      return new Network(networkConfig)
    } else if (network && typeof network === 'object') {
      return new Network(network)
    }
    throw new Error('Invalid network type')
  }

  static isValidNetworkSlug(slug: string): boolean {
    return allNetworks[slug] !== undefined
  }

  getChain(chainSlug: string): Chain {
    const chain = this.chains[chainSlug]
    if (!chain) {
      throw new Error(`Chain with slug "${chainSlug}" not found in network "${this.slug}"`)
    }
    return chain
  }

  getChains(): Chain[] {
    return Object.values(this.chains)
  }

  eq(otherNetwork: Networkish): boolean {
    return this.slug === Network.getNetwork(otherNetwork).slug
  }
}

export const getNetwork = Network.getNetwork
export const isValidNetworkSlug = Network.isValidNetworkSlug
