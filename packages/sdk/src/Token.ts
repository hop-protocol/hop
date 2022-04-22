import Base, { ChainProviders } from './Base'
import Chain from './models/Chain'
import TokenModel from './models/Token'
import { BigNumber, Contract, Signer, ethers, providers } from 'ethers'
import { ERC20__factory } from '@hop-protocol/core/contracts/factories/ERC20__factory'
import { TAmount, TChain } from './types'
import { TokenSymbol, WrappedToken } from './constants'
import { WETH9__factory } from '@hop-protocol/core/contracts/factories/WETH9__factory'

/**
 * Class reprensenting ERC20 Token
 * @namespace Token
 */
class Token extends Base {
  public readonly address: string
  public readonly decimals: number
  public readonly name: string
  public readonly image: string
  public readonly chain: Chain
  public readonly contract: Contract
  _symbol: TokenSymbol

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
    chain: TChain,
    address: string,
    decimals: number,
    symbol: TokenSymbol,
    name: string,
    image: string,
    signer?: Signer | providers.Provider,
    chainProviders?: ChainProviders
  ) {
    super(network, signer, chainProviders)

    this.address = ethers.utils.getAddress(address)
    this.decimals = decimals
    this._symbol = symbol
    this.name = name
    this.image = image
    this.chain = this.toChainModel(chain)
  }

  get symbol () {
    if (this._symbol === TokenModel.ETH && !this.isNativeToken) {
      return WrappedToken.WETH
    }
    return this._symbol
  }

  /**
   * @desc Returns a token instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} New Token SDK instance with connected signer.
   */
  public connect (signer: Signer | providers.Provider) {
    return new Token(
      this.network,
      this.chain,
      this.address,
      this.decimals,
      this._symbol,
      this.name,
      this.image,
      signer,
      this.chainProviders
    )
  }

  /**
   * @desc Returns token allowance.
   * @param {String} spender - spender address.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Chain } from '@hop-protocol/sdk'
   *
   *const hop = new Hop('mainnet')
   *const bridge = hop.bridge('USDC')
   *const token = bridge.getCanonicalToken(Chain.Polygon)
   *const spender = await bridge.getSendApprovalAddress(Chain.Polygon)
   *const account = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = await token.allowance(spender, account)
   *console.log(allowance)
   *```
   */
  public async allowance (spender: string, address?: string) {
    const tokenContract = await this.getErc20()
    address = address ?? await this.getSignerAddress()
    if (!address) {
      throw new Error('signer required')
    }
    return tokenContract.allowance(address, spender)
  }

  /**
   * @desc Returns token balance of signer.
   * @param {String} spender - spender address.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Chain } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge('USDC').connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.Gnosis, spender)
   *```
   */
  public async balanceOf (address?: string): Promise<BigNumber> {
    if (this.isNativeToken) {
      return this.getNativeTokenBalance(address)
    }
    address = address ?? await this.getSignerAddress()
    if (!address) {
      throw new Error('address is required')
    }
    const tokenContract = await this.getErc20()
    return tokenContract.balanceOf(address)
  }

  /**
   * @desc ERC20 token transfer
   * @param {String} recipient - recipient address.
   * @param {String} amount - Token amount.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge('USDC').connect(signer)
   *const recipient = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const amount = '1000000000000000000'
   *const tx = await bridge.erc20Transfer(spender, amount)
   *```
   */
  public async transfer (recipient: string, amount: TAmount) {
    if (this.isNativeToken) {
      return this.sendTransaction({
        to: recipient,
        value: amount
      }, this.chain)
    }
    const tokenContract = await this.getErc20()
    return tokenContract.transfer(recipient, amount, await this.overrides())
  }

  /**
   * @desc Approve address to spend tokens if not enough allowance .
   * @param {Object} chain - Chain model.
   * @param {String} spender - spender address.
   * @param {String} amount - amount allowed to spend.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Chain } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge('USDC').connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const amount = '1000000000000000000'
   *const tx = await bridge.approve(Chain.Gnosis, spender, amount)
   *```
   */
  public async approve (
    spender: string,
    amount: TAmount = ethers.constants.MaxUint256
  ) {
    const populatedTx = await this.populateApproveTx(spender, amount)
    const allowance = await this.allowance(spender)
    if (allowance.lt(BigNumber.from(amount))) {
      return this.sendTransaction(populatedTx, this.chain)
    }
  }

  public async populateApproveTx (
    spender: string,
    amount: TAmount = ethers.constants.MaxUint256
  ):Promise<any> {
    if (this.isNativeToken) {
      return
    }
    const tokenContract = await this.getErc20()
    return tokenContract.populateTransaction.approve(spender, amount, await this.overrides())
  }

  /**
   * @desc Returns a token Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @returns {Object} Ethers contract instance.
   */
  public async getErc20 () {
    if (this.isNativeToken) {
      return this.getWethContract()
    }
    const provider = await this.getSignerOrProvider(this.chain)
    return ERC20__factory.connect(this.address, provider)
  }

  public async overrides () {
    return this.txOverrides(this.chain)
  }

  // ToDo: Remove chainId. This is added to comply with the token model type
  get chainId () {
    throw new Error('chainId should not be accessed')
  }

  public eq (token: Token): boolean {
    return (
      this.symbol.toLowerCase() === token.symbol.toLowerCase() &&
      this.address.toLowerCase() === token.address.toLowerCase() &&
      this.chain.equals(token.chain)
    )
  }

  get isNativeToken () {
    const isEth =
      this._symbol === TokenModel.ETH &&
      (this.chain.equals(Chain.Ethereum) ||
        this.chain.equals(Chain.Arbitrum) ||
        this.chain.equals(Chain.Optimism))
    const isMatic =
      this._symbol === TokenModel.MATIC && this.chain.equals(Chain.Polygon)
    const isxDai =
      [TokenModel.DAI, TokenModel.XDAI].includes(this._symbol) &&
      this.chain.equals(Chain.Gnosis)
    return isEth || isMatic || isxDai
  }

  get nativeTokenSymbol () {
    return this.chain.nativeTokenSymbol
  }

  public async getNativeTokenBalance (address?: string): Promise<BigNumber> {
    address = address ?? await this.getSignerAddress()
    if (!address) {
      throw new Error('address is required')
    }
    return this.chain.provider.getBalance(address)
  }

  async getWethContract () {
    const provider = await this.getSignerOrProvider(this.chain)
    return WETH9__factory.connect(this.address, provider)
  }

  getWrappedToken () {
    if (!this.isNativeToken) {
      return this
    }

    return new Token(
      this.network,
      this.chain,
      this.address,
      this.decimals,
      `W${this._symbol}` as WrappedToken,
      this.name,
      this.image,
      this.signer,
      this.chainProviders
    )
  }

  async populateWrapTokenTx (amount: TAmount) {
    const contract = await this.getWethContract()
    return contract.populateTransaction.deposit({
      value: amount
    })
  }

  async wrapToken (amount: TAmount, estimateGasOnly: boolean = false) {
    const contract = await this.getWethContract()
    if (estimateGasOnly) {
      // a `from` address is required if using only provider (not signer)
      const from = await this.getGasEstimateFromAddress()
      return contract.connect(this.chain.provider).estimateGas.deposit({
        value: amount,
        from
      })
    }

    const populatedTx = await this.populateWrapTokenTx(amount)
    return this.sendTransaction(populatedTx, this.chain)
  }

  async populateUnwrapTokenTx (amount: TAmount) {
    const contract = await this.getWethContract()
    return contract.populateTransaction.withdraw(amount)
  }

  async unwrapToken (amount: TAmount) {
    const populatedTx = await this.populateUnwrapTokenTx(amount)
    return this.sendTransaction(populatedTx, this.chain)
  }

  async getWrapTokenEstimatedGas (
    chain: TChain
  ) {
    chain = this.toChainModel(chain)
    const amount = BigNumber.from(1)
    const contract = await this.getWethContract()
    // a `from` address is required if using only provider (not signer)
    const from = await this.getGasEstimateFromAddress()
    const [gasLimit, tx] = await Promise.all([
      contract.connect(this.chain.provider).estimateGas.deposit({
        value: amount,
        from
      }),
      contract.connect(this.chain.provider).populateTransaction.deposit({
        value: amount,
        from
      })
    ])

    return {
      gasLimit,
      ...tx
    }
  }

  private async getGasEstimateFromAddress () {
    let address = await this.getSignerAddress()
    if (!address) {
      address = await this._getBonderAddress(this._symbol, this.chain, Chain.Ethereum)
    }
    return address
  }

  public async totalSupply (): Promise<BigNumber> {
    if (this.isNativeToken) {
      return BigNumber.from(0)
    }
    const tokenContract = await this.getErc20()
    return tokenContract.totalSupply()
  }

  static fromJSON (json: any): Token {
    return new Token(
      json.network,
      json.chain,
      json.address,
      json.decimals,
      json.symbol,
      json.name,
      json.image
    )
  }

  toJSON () {
    return {
      address: this.address,
      decimals: this.decimals,
      name: this.name,
      image: this.image,
      chain: this.chain,
      symbol: this._symbol
    }
  }
}

export default Token
