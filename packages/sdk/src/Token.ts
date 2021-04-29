import { providers, Signer, Contract, BigNumber } from 'ethers'
import { Chain, Token as TokenModel } from './models'
import { MaxUint256 } from './constants'
import { addresses } from './config'
import { erc20Abi } from '@hop-protocol/abi'
import { TChain, TAmount } from './types'

/**
 * Class reprensenting ERC20 Token
 * @namespace Token
 */
class Token extends TokenModel {
  public signer: Signer | providers.Provider
  network: string

  constructor (
    network: string,
    chainId: number | string,
    address: string,
    decimals: number,
    symbol: string,
    name: string,
    signer?: Signer | providers.Provider
  ) {
    super(chainId, address, decimals, symbol, name)
    this.network = network
    if (signer) {
      this.signer = signer
    }
  }

  connect (signer: Signer | providers.Provider) {
    return new Token(
      this.network,
      this.chainId,
      this.address,
      this.decimals,
      this.symbol,
      this.name,
      signer
    )
  }

  /**
   * @desc Returns token allowance.
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.xDai, spender)
   *```
   */
  async allowance (chain: TChain, spender: string) {
    chain = this.toChainModel(chain)
    const tokenContract = await this.getErc20(chain)
    const address = await this.getSignerAddress()
    if (!address) {
      throw new Error('signer required')
    }
    return tokenContract.allowance(address, spender)
  }

  /**
   * @desc Returns token balance of signer.
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.xDai, spender)
   *```
   */
  async balanceOf (chain: TChain) {
    chain = this.toChainModel(chain)
    const tokenContract = await this.getErc20(chain)
    const address = await this.getSignerAddress()
    return tokenContract.balanceOf(address)
  }

  /**
   * @desc ERC20 token transfer
   * @param {Object} chain - Chain model.
   * @param {String} recipient - recipient address.
   * @param {String} amount - Token amount.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const recipient = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const amount = '1000000000000000000'
   *const tx = await bridge.erc20Transfer(Chain.Ethereum, spender, amount)
   *```
   */
  async transfer (chain: TChain, recipient: string, amount: TAmount) {
    chain = this.toChainModel(chain)
    const tokenContract = await this.getErc20(chain)
    return tokenContract.transfer(recipient, amount, this.txOverrides(chain))
  }

  /**
   * @desc Approve address to spend tokens if not enough allowance .
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @param {String} amount - amount allowed to spend.
   * @returns Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const amount = '1000000000000000000'
   *const tx = await bridge.approve(Chain.xDai, spender, amount)
   *```
   */
  async approve (chain: TChain, spender: string, amount: TAmount = MaxUint256) {
    chain = this.toChainModel(chain)
    const tokenContract = await this.getErc20(chain)
    const allowance = await this.allowance(chain, spender)
    if (allowance.lt(BigNumber.from(amount))) {
      return tokenContract.approve(spender, amount, this.txOverrides(chain))
    }
  }

  async getErc20 (chain: TChain) {
    chain = this.toChainModel(chain)
    const tokenSymbol = this.symbol
    let tokenAddress: string
    if (chain.isL1) {
      tokenAddress =
        addresses[this.network][tokenSymbol][chain.slug].l1CanonicalToken
    } else {
      tokenAddress =
        addresses[this.network][tokenSymbol][chain.slug].l2CanonicalToken
    }

    const provider = await this.getSignerOrProvider(chain)
    return new Contract(tokenAddress, erc20Abi, provider)
  }

  async getSignerAddress () {
    if (!this.signer) {
      throw new Error('signer not connected')
    }
    return (this.signer as Signer)?.getAddress()
  }

  async getSignerOrProvider (
    chain: TChain,
    signer: Signer = this.signer as Signer
  ) {
    chain = this.toChainModel(chain)
    if (!signer) {
      return chain.provider
    }
    const connectedChainId = await signer.getChainId()
    if (connectedChainId !== chain.chainId) {
      return chain.provider
    }
    return this.signer
  }

  private toChainModel (chain: TChain) {
    if (typeof chain === 'string') {
      return Chain.fromSlug(chain)
    }

    return chain
  }

  txOverrides (chain: Chain) {
    const txOptions: any = {}
    if (chain.equals(Chain.Optimism)) {
      txOptions.gasPrice = 0
      txOptions.gasLimit = 8000000
    }
    return txOptions
  }
}

export default Token
