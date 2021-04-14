import { Signer, providers, BigNumber } from 'ethers'
import { Chain, Token, Transfer } from './models'
import { TChain, TToken, TAmount } from './types'
import { addresses, chains, metadata } from './config'

class Base {
  toChainModel (chain: TChain) {
    if (typeof chain === 'string') {
      return Chain.fromSlug(chain)
    }

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
}

export default Base
