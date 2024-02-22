import { Base, BaseConstructorOptions, ChainProviders } from './Base'
import { BigNumber, Contract, Signer, ethers, providers } from 'ethers'
import { Chain, TokenModel } from '@hop-protocol/sdk-core'
import { ERC20__factory } from '@hop-protocol/core/contracts'
import { TAmount, TChain } from './types'
import { TokenSymbol, WrappedToken } from './constants'
import { WETH9__factory } from '@hop-protocol/core/contracts'
import { chains as chainMetadata } from '@hop-protocol/core/metadata'
import { getAddress } from 'ethers/lib/utils'

export type TokenConstructorOptions = {
  chain: TChain,
  address: string,
  decimals: number,
  symbol: TokenSymbol,
  name: string,
  image: string,
} & BaseConstructorOptions

/**
 * Class reprensenting ERC20 Token
 * @namespace Token
 */
export class Token extends Base {
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
   * @param networkOrOptionsObject - L1 network name (e.g. 'mainnet', 'goerli')
   * @param chain - Chain
   * @param address - Token address.
   * @param decimals - Token decimals.
   * @param symbol - Token symbol.
   * @param name - Token name.
   * @param signer - Ethers signer.
   * @returns Token class instance.
   */
  constructor (
    networkOrOptionsObject: string | TokenConstructorOptions,
    chain?: TChain,
    address?: string,
    decimals?: number,
    symbol?: TokenSymbol,
    name?: string,
    image?: string,
    signer?: Signer | providers.Provider,
    chainProviders?: ChainProviders
  ) {
    super(networkOrOptionsObject, signer, chainProviders)

    if (networkOrOptionsObject instanceof Object) {
      const options = networkOrOptionsObject
      if (chain ?? address ?? decimals ?? symbol ?? name ?? image ?? signer ?? chainProviders) {
        throw new Error('expected only single options parameter')
      }
      decimals = options.decimals
      address = options.address
      symbol = options.symbol
      name = options.name
      image = options.image
      chain = options.chain
    }

    if (!chain) {
      throw new Error('chain is required')
    }

    if (!address) {
      throw new Error('address is required')
    }

    this.address = getAddress(address)
    this.decimals = decimals!
    this._symbol = symbol!
    this.name = name!
    this.image = image!
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
   * @param signer - Ethers `Signer` for signing transactions.
   * @returns New Token SDK instance with connected signer.
   */
  public connect (signer: Signer | providers.Provider): Token {
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
   * @param spender - spender address.
   * @returns Ethers Transaction object.
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
  public async allowance (spender: string, address?: string): Promise<BigNumber> {
    const tokenContract = await this.getErc20()
    address = address ?? await this.getSignerAddress()
    if (!address) {
      throw new Error('signer required')
    }
    return tokenContract.allowance(address, spender)
  }

  public async needsApproval (spender: string, amount: TAmount, address?: string): Promise<boolean> {
    if (this.isNativeToken) {
      return false
    }
    const allowance = await this.allowance(spender, address)
    return allowance.lt(amount)
  }

  /**
   * @desc Returns token balance of signer.
   * @param address - account address.
   * @returns Ethers Transaction object.
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
   * @param recipient - recipient address.
   * @param amount - Token amount.
   * @returns Ethers Transaction object.
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
  public async transfer (recipient: string, amount: TAmount): Promise<any> {
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
   * @param spender - spender address.
   * @param amount - amount allowed to spend.
   * @returns Ethers Transaction object.
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
  ): Promise<any> {
    const [populatedTx, allowance] = await Promise.all([
      this.populateApproveTx(spender, amount),
      this.allowance(spender)
    ])
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
   * @returns Ethers contract instance.
   */
  public async getErc20 (): Promise<any> {
    if (this.isNativeToken) {
      return this.getWethContract()
    }
    const provider = await this.getSignerOrProvider(this.chain)
    return ERC20__factory.connect(this.address, provider)
  }

  public async overrides (): Promise<any> {
    return this.txOverrides(this.chain)
  }

  // This is added to comply with the token model type
  get chainId (): number {
    throw new Error('chainId should not be accessed')
  }

  public eq (token: Token): boolean {
    return (
      this.symbol.toLowerCase() === token.symbol.toLowerCase() &&
      this.address.toLowerCase() === token.address.toLowerCase() &&
      this.chain.equals(token.chain)
    )
  }

  get isNativeToken (): boolean {
    const nativeTokenSymbol = (chainMetadata as any)[this.chain.slug]?.nativeTokenSymbol
    let isNative = nativeTokenSymbol === this._symbol

    // check for both XDAI and DAI on Gnosis Chain
    if (!isNative && this.chain.equals(Chain.Gnosis) && TokenModel.DAI === this._symbol) {
      isNative = true
    }

    return isNative
  }

  get nativeTokenSymbol (): string {
    return this.chain.nativeTokenSymbol
  }

  public async getNativeTokenBalance (address?: string): Promise<BigNumber> {
    address = address ?? await this.getSignerAddress()
    if (!address) {
      throw new Error('address is required')
    }
    return this.chain.provider!.getBalance(address)
  }

  async getWethContract (): Promise<any> {
    const provider = await this.getSignerOrProvider(this.chain)
    return WETH9__factory.connect(this.address, provider)
  }

  getWrappedToken (): Token {
    if (!this.isNativeToken) {
      return this
    }

    return new Token({
      network: this.network,
      chain: this.chain,
      address: this.address,
      decimals: this.decimals,
      symbol: `W${this._symbol}` as WrappedToken,
      name: this.name,
      image: this.image,
      signer: this.signer,
      chainProviders: this.chainProviders
    })
  }

  async populateWrapTokenTx (amount: TAmount): Promise<any> {
    const contract = await this.getWethContract()
    return contract.populateTransaction.deposit({
      value: amount
    })
  }

  async wrapToken (amount: TAmount, estimateGasOnly: boolean = false): Promise<any> {
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

  async populateUnwrapTokenTx (amount: TAmount): Promise<any> {
    const contract = await this.getWethContract()
    return contract.populateTransaction.withdraw(amount)
  }

  async unwrapToken (amount: TAmount): Promise<any> {
    const populatedTx = await this.populateUnwrapTokenTx(amount)
    return this.sendTransaction(populatedTx, this.chain)
  }

  async getWrapTokenEstimatedGas (
    chain: TChain
  ): Promise<any> {
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

  private async getGasEstimateFromAddress (): Promise<string> {
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
    return new Token({
      network: json.network,
      chain: json.chain,
      address: json.address,
      decimals: json.decimals,
      symbol: json.symbol,
      name: json.name,
      image: json.image
    })
  }

  toJSON () :any {
    return {
      address: this.address,
      decimals: this.decimals,
      name: this.name,
      image: this.image,
      chain: this.chain,
      symbol: this._symbol
    }
  }

  get imageUrl (): string {
    return this.image
  }

  getImageUrl (): string {
    return this.imageUrl
  }
}
