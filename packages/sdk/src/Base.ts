import { Signer, providers, BigNumber } from 'ethers'
import { Chain, Token } from './models'
import { TChain, TToken } from './types'
import { chains, metadata } from './config'

class Base {
  network: string

  constructor (network: string) {
    this.network = network
  }

  toChainModel (chain: TChain) {
    if (typeof chain === 'string') {
      chain = Chain.fromSlug(chain)
    }

    chain.provider = this.getChainProvider(chain)
    chain.chainId = this.getChainId(chain)
    return chain
  }

  toTokenModel (token: TToken) {
    if (typeof token === 'string') {
      const { name, symbol, decimals } = metadata.tokens[token]
      return new Token(0, '', decimals, symbol, name)
    }

    return token
  }

  async getBumpedGasPrice (
    signer: Signer | providers.Provider,
    percent: number
  ) {
    const gasPrice = await signer.getGasPrice()
    console.log(
      gasPrice
        .mul(BigNumber.from(percent * 100))
        .div(BigNumber.from(100))
        .toString()
    )
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  getChainId (chain: Chain) {
    const { chainId } = chains[this.network][chain.slug]
    return chainId
  }

  getChainProvider (chain: Chain) {
    const { rpcUrl } = chains[this.network][chain.slug]
    return new providers.StaticJsonRpcProvider(rpcUrl)
  }
}

export default Base
