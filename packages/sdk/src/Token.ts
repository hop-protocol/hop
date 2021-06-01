import { ethers, providers, Signer, Contract, BigNumber } from 'ethers'
import { Token as TokenModel } from './models'
import { erc20Abi } from '@hop-protocol/abi'
import { TChain, TAmount } from './types'
import Base from './Base'

/**
 * Class reprensenting ERC20 Token
 * @namespace Token
 */
class Token extends Base {
  /** Token model */
  public model: TokenModel

  /** Token type */
  public tokenType: string

  // TODO: clean up and remove unused parameters.
  /**
   * @desc Instantiates Token class.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @param {Number} chainId - Chain ID.
   * @param {String} address - Token address.
   * @param {Number} decimals - Token decimals.
   * @param {String} symbol - Token symbol.
   * @param {String} name - Token name.
   * @param {Object} signer - Ethers signer.
   * @returns {Object} Token class instance.
   */
  constructor (
    network: string,
    chainId: number | string,
    address: string,
    decimals: number,
    symbol: string,
    name: string,
    signer?: Signer | providers.Provider,
    tokenType?: string
  ) {
    super(network, signer)
    this.model = new TokenModel(chainId, address, decimals, symbol, name)
    this.network = network
    if (signer) {
      this.signer = signer
    }
    // TODO: polymorphism instead of this
    if (tokenType) {
      this.tokenType = tokenType
    }
  }

  /**
   * @desc Returns a token instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} New Token SDK instance with connected signer.
   */
  public connect (signer: Signer | providers.Provider) {
    return new Token(
      this.network,
      this.chainId,
      this.address,
      this.decimals,
      this.symbol,
      this.name,
      signer,
      this.tokenType
    )
  }

  /**
   * @desc Returns token allowance.
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.xDai, spender)
   *```
   */
  public async allowance (chain: TChain, spender: string) {
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
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.xDai, spender)
   *```
   */
  public async balanceOf (chain: TChain) {
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
   * @returns {Object} Ethers Transaction object.
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
  public async transfer (chain: TChain, recipient: string, amount: TAmount) {
    chain = this.toChainModel(chain)
    const tokenContract = await this.getErc20(chain)
    return tokenContract.transfer(recipient, amount, this.txOverrides(chain))
  }

  /**
   * @desc Approve address to spend tokens if not enough allowance .
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @param {String} amount - amount allowed to spend.
   * @returns {Object} Ethers Transaction object.
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
  public async approve (
    chain: TChain,
    spender: string,
    amount: TAmount = ethers.constants.MaxUint256
  ) {
    chain = this.toChainModel(chain)
    const tokenContract = await this.getErc20(chain)
    const allowance = await this.allowance(chain, spender)
    if (allowance.lt(BigNumber.from(amount))) {
      return tokenContract.approve(spender, amount, this.txOverrides(chain))
    }
  }

  /**
   * @desc Returns a token Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @returns {Object} Ethers contract instance.
   */
  public async getErc20 (chain: TChain) {
    chain = this.toChainModel(chain)
    let tokenAddress: string
    if (chain.isL1) {
      tokenAddress = this.getL1CanonicalTokenAddress(this.symbol, chain)
    } else {
      if (this.tokenType === 'hop') {
        tokenAddress = this.getL2HopBridgeTokenAddress(this.symbol, chain)
      } else if (this.tokenType === 'lp') {
        tokenAddress = this.getL2SaddleLpTokenAddress(this.symbol, chain)
      } else {
        tokenAddress = this.getL2CanonicalTokenAddress(this.symbol, chain)
      }
    }

    const provider = await this.getSignerOrProvider(chain)
    return this.getContract(tokenAddress, erc20Abi, provider)
  }

  get chainId () {
    return this.model.chainId
  }

  get address () {
    return this.model.address
  }

  get decimals () {
    return this.model.decimals
  }

  get symbol () {
    return this.model.symbol
  }

  get name () {
    return this.model.name
  }
}

export default Token
