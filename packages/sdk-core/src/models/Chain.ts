import { ChainName, ChainSlug, Errors, NetworkSlug, Slug } from '../constants/index.js'
import { getChainSlugFromName } from '../utils/index.js'
import { goerli, mainnet } from '#networks/index.js'
import { sdkMetadata } from '../config/index.js'
import { providers } from 'ethers'

export class Chain {
  chainId: number
  name: ChainName | string = ''
  slug: Slug | string = ''
  provider: providers.Provider | null = null
  isL1: boolean = false
  nativeTokenSymbol: string

  static Ethereum: Chain
  static Optimism: Chain
  static Arbitrum: Chain
  static Gnosis: Chain
  static Polygon: Chain
  static Nova: Chain
  static ZkSync: Chain
  static Linea: Chain
  static ScrollZk: Chain
  static Base: Chain
  static PolygonZk: Chain

  static initializeChains() {
    Chain.Ethereum = newChain(ChainSlug.Ethereum, mainnet.ethereum!.networkId)
    Chain.Optimism = newChain(ChainSlug.Optimism, mainnet.optimism!.networkId)
    Chain.Arbitrum = newChain(ChainSlug.Arbitrum, mainnet.arbitrum!.networkId)
    Chain.Gnosis = newChain(ChainSlug.Gnosis, mainnet.gnosis!.networkId)
    Chain.Polygon = newChain(ChainSlug.Polygon, mainnet.polygon!.networkId)
    Chain.Nova = newChain(ChainSlug.Nova, mainnet.nova!.networkId)
    Chain.ZkSync = newChain(ChainSlug.ZkSync, mainnet.zksync?.networkId ?? goerli.zksync?.networkId)
    Chain.Linea = newChain(ChainSlug.Linea, mainnet.linea?.networkId ?? goerli.linea?.networkId)
    Chain.ScrollZk = newChain(ChainSlug.ScrollZk, mainnet.scrollzk?.networkId ?? goerli.scrollzk?.networkId)
    Chain.Base = newChain(ChainSlug.Base, mainnet.base?.networkId ?? goerli.base?.networkId)
    Chain.PolygonZk = newChain(ChainSlug.PolygonZk, mainnet.polygonzk?.networkId ?? goerli.polygonzk?.networkId)
  }

  static fromSlug (slug: Slug | string) {
    if (slug === 'xdai') {
      console.warn(Errors.xDaiRebrand)
      slug = 'gnosis'
    }

    return newChain(slug)
  }

  constructor (name: ChainName | string, chainId?: number, provider?: providers.Provider) {
    this.name = name
    this.slug = getChainSlugFromName(name)
    if (this.slug === ChainSlug.Ethereum) {
      this.isL1 = true
    }
    if (chainId) {
      this.chainId = chainId
    }
    if (provider) {
      this.provider = provider
    }

    this.nativeTokenSymbol = sdkMetadata.networks[this.slug]?.nativeTokenSymbol
    if (!this.nativeTokenSymbol) {
      throw new Error(`nativeTokenSymbol not found for chain "${name}", slug "${this.slug}"`)
    }
  }

  equals (other: Chain) {
    return this.slug === other.slug
  }

  get rpcUrl () {
    return (this.provider as any)?.connection?.url
  }
}

Chain.initializeChains()

function newChain (chain: NetworkSlug | ChainSlug | string, chainId?: number) {
  if (
    chain === NetworkSlug.Mainnet ||
    chain === NetworkSlug.Goerli
  ) {
    chain = ChainSlug.Ethereum
  }
  if (!sdkMetadata.networks[chain]) {
    throw new Error(`unsupported chain "${chain}"`)
  }
  return new Chain(sdkMetadata.networks[chain].name, chainId)
}
