import { Signer, providers, BigNumber } from 'ethers'
import { Chain, Token } from './models'
import { TChain, TToken } from './types'
import { chains, metadata } from './config'

/**
 * Class with base methods.
 * @namespace Base
 */
class Base {
  /** Network name */
  network: string

  /**
   * @desc Instantiates Base class.
   * Returns a new Base class instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @returns {Object} New Base class instance.
   */
  constructor (network: string) {
    this.network = network
  }

  /**
   * @desc Returns a Chain model instance with connected provider.
   * @param {Object} - Chain name or model.
   * @returns {Object} - Chain model with connected provider.
   */
  protected toChainModel (chain: TChain) {
    if (typeof chain === 'string') {
      chain = Chain.fromSlug(chain)
    }

    chain.provider = this.getChainProvider(chain)
    chain.chainId = this.getChainId(chain)
    return chain
  }

  /**
   * @desc Returns a Token instance.
   * @param {Object} - Token name or model.
   * @returns {Object} - Token model.
   */
  protected toTokenModel (token: TToken) {
    if (typeof token === 'string') {
      const { name, symbol, decimals } = metadata.tokens[token]
      return new Token(0, '', decimals, symbol, name)
    }

    return token
  }

  /**
   * @desc Calculates current gas price plus increased percentage amount.
   * @param {Object} - Ether's Signer
   * @param {number} - Percentage to bump by.
   * @returns {BigNumber} Bumped as price as BigNumber
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
   *console.log(bumpedGasPrice.toNumber())
   *```
   */
  protected async getBumpedGasPrice (
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

  /**
   * @desc Returns Chain ID for specified Chain model.
   * @param {Object} - Chain model.
   * @returns {Number} - Chain ID.
   */
  protected getChainId (chain: Chain) {
    const { chainId } = chains[this.network][chain.slug]
    return Number(chainId)
  }

  /**
   * @desc Returns Ethers provider for specified Chain model.
   * @param {Object} - Chain model.
   * @returns {Object} - Ethers provider.
   */
  protected getChainProvider (chain: Chain) {
    const { rpcUrl } = chains[this.network][chain.slug]
    return new providers.StaticJsonRpcProvider(rpcUrl)
  }
}

export default Base
