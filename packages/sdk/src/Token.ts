import { ethers, providers, Signer, Contract, BigNumber } from 'ethers'
import { erc20Abi } from '@hop-protocol/abi'
import { TAmount, TChain } from './types'
import Base from './Base'
import Chain from './models/Chain'

/**
 * Class reprensenting ERC20 Token
 * @namespace Token
 */
class Token extends Base {
  public readonly address: string
  public readonly decimals: number
  public readonly symbol: string
  public readonly name: string
  public readonly image: string
  public readonly chain: Chain
  public readonly contract: Contract

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
    symbol: string,
    name: string,
    image: string,
    signer?: Signer | providers.Provider
  ) {
    super(network, signer)

    this.address = ethers.utils.getAddress(address)
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.image = image
    this.chain = this.toChainModel(chain)
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
      this.symbol,
      this.name,
      this.image,
      signer
    )
  }

  /**
   * @desc Returns token allowance.
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
  public async allowance (spender: string) {
    const tokenContract = await this.getErc20()
    const address = await this.getSignerAddress()
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
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const allowance = bridge.allowance(Chain.xDai, spender)
   *```
   */
  public async balanceOf (address?: string): Promise<BigNumber> {
    const tokenContract = await this.getErc20()
    const _address = address ?? (await this.getSignerAddress())
    return tokenContract.balanceOf(_address)
  }

  /**
   * @desc ERC20 token transfer
   * @param {String} recipient - recipient address.
   * @param {String} amount - Token amount.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *const recipient = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
   *const amount = '1000000000000000000'
   *const tx = await bridge.erc20Transfer(spender, amount)
   *```
   */
  public async transfer (recipient: string, amount: TAmount) {
    const tokenContract = await this.getErc20()
    return tokenContract.transfer(recipient, amount, this.overrides())
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
    spender: string,
    amount: TAmount = ethers.constants.MaxUint256
  ) {
    const tokenContract = await this.getErc20()
    const allowance = await this.allowance(spender)
    if (allowance.lt(BigNumber.from(amount))) {
      return tokenContract.approve(spender, amount, this.overrides())
    }
  }

  /**
   * @desc Returns a token Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @returns {Object} Ethers contract instance.
   */
  public async getErc20 () {
    const provider = await this.getSignerOrProvider(this.chain)
    return this.getContract(this.address, erc20Abi, provider)
  }

  public overrides () {
    return this.txOverrides(this.chain)
  }

  // ToDo: Remove chainId. This is added to comply with the token model type
  get chainId () {
    throw new Error('chainId should not be accessed')
    return 0
  }

  public eq (token: Token): boolean {
    return this.address.toLowerCase() === token.address.toLowerCase()
  }
}

export default Token
