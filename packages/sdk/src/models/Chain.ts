import { providers } from 'ethers'
import { EthereumChainId } from '../constants'
import { chains } from '../config'

type Provider = providers.Provider

class Chain {
  readonly chainId: number
  readonly name: string = ''
  readonly slug: string = ''
  readonly provider: Provider | null = null
  readonly isL1: boolean = false

  static Ethereum = newChain('ethereum')
  static Optimism = newChain('optimism')
  static Arbitrum = newChain('arbitrum')
  static xDai = newChain('xdai')

  static fromSlug (slug: string) {
    return newChain(slug)
  }

  constructor (chainId: number | string, name: string, provider: Provider) {
    this.chainId = Number(chainId)
    this.name = name
    this.slug = (name || '').trim().toLowerCase()
    if (this.slug === 'kovan') {
      this.slug = 'ethereum'
    }
    this.provider = provider
    this.isL1 = Object.values(EthereumChainId).includes(this.chainId)
  }

  equals (otherChain: Chain) {
    return this.slug == otherChain.slug
  }
}

function newChain (chain: string) {
  if (chain === 'kovan') {
    chain = 'ethereum'
  }
  if (!chains[chain]) {
    throw new Error(`unsupported chain "${chain}"`)
  }
  const { name, rpcUrl, chainId } = chains[chain]
  const provider = new providers.StaticJsonRpcProvider(rpcUrl)
  return new Chain(Number(chainId), name, provider)
}

export default Chain
