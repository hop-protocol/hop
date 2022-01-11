import { Chain as ChainEnum, Errors, Network } from '../constants'
import { metadata } from '../config'
import { providers } from 'ethers'

type Provider = providers.Provider

class Chain {
  chainId: number
  name: string = ''
  slug: string = ''
  provider: Provider | null = null
  isL1: boolean = false

  static Ethereum = newChain(ChainEnum.Ethereum)
  static Optimism = newChain(ChainEnum.Optimism)
  static Arbitrum = newChain(ChainEnum.Arbitrum)
  static Gnosis = newChain(ChainEnum.Gnosis)
  static Polygon = newChain(ChainEnum.Polygon)

  static fromSlug (slug: string) {
    if (slug === 'xdai') {
      console.warn(Errors.xDaiRebrand)
      slug = 'gnosis'
    }

    return newChain(slug)
  }

  constructor (name: string, chainId?: number | string, provider?: Provider) {
    this.name = name
    this.slug = (name || '').trim().toLowerCase()
    if (
      this.slug === Network.Kovan ||
      this.slug === Network.Goerli ||
      this.slug === Network.Mainnet ||
      this.slug === Network.Staging ||
      this.slug === ChainEnum.Ethereum
    ) {
      this.isL1 = true
      this.slug = ChainEnum.Ethereum
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

function newChain (chain: string) {
  if (
    chain === Network.Mainnet ||
    chain === Network.Staging ||
    chain === Network.Goerli ||
    chain === Network.Kovan
  ) {
    chain = ChainEnum.Ethereum
  }
  if (!metadata.networks[chain]) {
    throw new Error(`unsupported chain "${chain}"`)
  }
  return new Chain(metadata.networks[chain].name)
}

export default Chain
