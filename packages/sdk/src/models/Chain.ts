import { providers } from 'ethers'
import { EthereumChainId } from 'src/constants'

type Provider = providers.Provider

class Chain {
  readonly chainId: number
  readonly name: string
  readonly provider: Provider
  readonly isL1: boolean

  constructor (chainId: number | string, name: string, provider: Provider) {
    this.chainId = Number(chainId)
    this.name = name
    this.provider = provider
    this.isL1 = Object.values(EthereumChainId).includes(this.chainId)
  }
}

export default Chain
