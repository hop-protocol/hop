import { ChainNames, ChainSlugs, Networks, Slugs, Errors } from '../constants'
import { metadata } from '../config'
import { providers } from 'ethers'

type Provider = providers.Provider

class Chain {
  chainId: number
  name: ChainNames | string = ''
  slug: Slugs | string = ''
  provider: Provider | null = null
  isL1: boolean = false

  static Ethereum = newChain(ChainSlugs.Ethereum)
  static Optimism = newChain(ChainSlugs.Optimism)
  static Arbitrum = newChain(ChainSlugs.Arbitrum)
  static Gnosis = newChain(ChainSlugs.Gnosis)
  static Polygon = newChain(ChainSlugs.Polygon)

  static fromSlug (slug: Slugs | string) {
    if (slug === 'xdai') {
      console.warn(Errors.xDaiRebrand)
      slug = 'gnosis'
    }

    return newChain(slug)
  }

  constructor (name: ChainNames | string, chainId?: number | string, provider?: Provider) {
    this.name = name
    this.slug = (name || '').trim().toLowerCase()
    if (
      this.slug === Networks.Kovan ||
      this.slug === Networks.Goerli ||
      this.slug === Networks.Mainnet ||
      this.slug === Networks.Staging ||
      this.slug === ChainSlugs.Ethereum
    ) {
      this.isL1 = true
      this.slug = ChainSlugs.Ethereum
    }
    if (chainId) {
      this.chainId = Number(chainId)
    }
    if (provider) {
      this.provider = provider
    }
  }

  equals (other: Chain) {
    return this.slug === other.slug
  }

  get rpcUrl () {
    return (this.provider as any)?.connection?.url
  }
}

function newChain (chain: Networks | ChainSlugs | string) {
  if (
    chain === Networks.Mainnet ||
    chain === Networks.Staging ||
    chain === Networks.Goerli ||
    chain === Networks.Kovan
  ) {
    chain = ChainSlugs.Ethereum
  }
  if (!metadata.networks[chain]) {
    throw new Error(`unsupported chain "${chain}"`)
  }
  return new Chain(metadata.networks[chain].name)
}

export default Chain
