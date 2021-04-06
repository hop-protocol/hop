import { providers } from 'ethers'
import { EthereumChainId } from 'src/constants'
import { addresses, chains } from 'src/config'

type Provider = providers.Provider

const newChain = (chain: string) => {
  const { name, rpcUrl, chainId } = chains[chain]
  const provider = new providers.StaticJsonRpcProvider(rpcUrl)
  return new Chain(Number(chainId), name, provider)
}

class Chain {
  readonly chainId: number
  readonly name: string = ''
  readonly slug: string = ''
  readonly provider: Provider | null = null
  readonly isL1: boolean = false

  static Kovan = newChain('kovan')
  static Optimism = newChain('optimism')
  static Arbitrum = newChain('arbitrum')
  static xDai = newChain('xdai')

  constructor (chainId: number | string, name: string, provider: Provider) {
    this.chainId = Number(chainId)
    this.name = name
    this.slug = (name || '').trim().toLowerCase()
    this.provider = provider
    this.isL1 = Object.values(EthereumChainId).includes(this.chainId)
  }
}

export default Chain
