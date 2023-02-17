import { ChainName, ChainSlug, Errors, NetworkSlug, Slug } from '../constants'
import { goerli, mainnet } from '@hop-protocol/core/networks'
import { metadata } from '../config'
import { providers } from 'ethers'

export class Chain {
  chainId: number
  name: ChainName | string = ''
  slug: Slug | string = ''
  provider: providers.Provider | null = null
  isL1: boolean = false
  nativeTokenSymbol: string

  static Ethereum = newChain(ChainSlug.Ethereum, mainnet.ethereum.networkId)
  static Optimism = newChain(ChainSlug.Optimism, mainnet.optimism.networkId)
  static Arbitrum = newChain(ChainSlug.Arbitrum, mainnet.arbitrum.networkId)
  static Gnosis = newChain(ChainSlug.Gnosis, mainnet.gnosis.networkId)
  static Polygon = newChain(ChainSlug.Polygon, mainnet.polygon.networkId)
  static Nova = newChain(ChainSlug.Nova, mainnet.nova.networkId)
  static ZkSync = newChain(ChainSlug.ZkSync, mainnet.zksync?.networkId ?? goerli.zksync?.networkId)
  static ConsenSysZk = newChain(ChainSlug.ConsenSysZk, mainnet.consensyszk?.networkId ?? goerli.consensyszk?.networkId)
  static ScrollZk = newChain(ChainSlug.ScrollZk, mainnet.scrollzk?.networkId ?? goerli.scrollzk?.networkId)

  static fromSlug (slug: Slug | string) {
    if (slug === 'xdai') {
      console.warn(Errors.xDaiRebrand)
      slug = 'gnosis'
    }

    return newChain(slug)
  }

  constructor (name: ChainName | string, chainId?: number, provider?: providers.Provider) {
    this.name = name

    // TODO: better way
    this.slug = (name || '').trim().replace(/\s+/gi, '').toLowerCase()
    if (this.slug.startsWith('consensys')) {
      this.slug = 'consensyszk'
    }
    if (this.slug.startsWith('scroll')) {
      this.slug = 'scrollzk'
    }
    if (
      this.slug === NetworkSlug.Kovan ||
      this.slug === NetworkSlug.Goerli ||
      this.slug === NetworkSlug.Mainnet ||
      this.slug === NetworkSlug.Staging ||
      this.slug === ChainSlug.Ethereum
    ) {
      this.isL1 = true
      this.slug = ChainSlug.Ethereum
    }
    if (chainId) {
      this.chainId = chainId
    }
    if (provider) {
      this.provider = provider
    }

    this.nativeTokenSymbol = metadata.networks[this.slug]?.nativeTokenSymbol
    if (!this.nativeTokenSymbol) {
      console.log(this.slug, metadata)
      throw new Error(`nativeTokenSymbol not found for chain ${name}`)
    }
  }

  equals (other: Chain) {
    return this.slug === other.slug
  }

  get rpcUrl () {
    return (this.provider as any)?.connection?.url
  }
}

function newChain (chain: NetworkSlug | ChainSlug | string, chainId?: number) {
  if (
    chain === NetworkSlug.Mainnet ||
    chain === NetworkSlug.Staging ||
    chain === NetworkSlug.Goerli ||
    chain === NetworkSlug.Kovan
  ) {
    chain = ChainSlug.Ethereum
  }
  if (!metadata.networks[chain]) {
    throw new Error(`unsupported chain "${chain}"`)
  }
  return new Chain(metadata.networks[chain].name, chainId)
}

export default Chain
