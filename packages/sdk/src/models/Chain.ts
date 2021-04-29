import { providers } from 'ethers'
import { EthereumChainId } from '../constants'
import { metadata } from '../config'

type Provider = providers.Provider

class Chain {
  chainId: number
  name: string = ''
  slug: string = ''
  provider: Provider | null = null
  isL1: boolean = false

  static Ethereum = newChain('ethereum')
  static Optimism = newChain('optimism')
  static Arbitrum = newChain('arbitrum')
  static xDai = newChain('xdai')
  static Polygon = newChain('polygon')

  static fromSlug (slug: string) {
    return newChain(slug)
  }

  constructor (name: string, chainId?: number | string, provider?: Provider) {
    this.name = name
    this.slug = (name || '').trim().toLowerCase()
    if (
      this.slug === 'kovan' ||
      this.slug === 'goerli' ||
      this.slug === 'mainnet' ||
      this.slug === 'ethereum'
    ) {
      this.isL1 = true
      this.slug = 'ethereum'
    }
    if (chainId) {
      this.chainId = Number(chainId)
    }
    if (provider) {
      this.provider = provider
    }
  }

  equals (other: Chain) {
    return this.slug == other.slug
  }

  get rpcUrl () {
    return (this.provider as any)?.connection?.url
  }
}

function newChain (chain: string) {
  if (chain === 'kovan' || chain === 'goerli' || chain === 'mainnet') {
    chain = 'ethereum'
  }
  const meta = metadata.networks[chain]
  return new Chain(meta.name)
}

export default Chain
