import { swapAbi as saddleSwapAbi } from '@hop-protocol/abi'
import { BigNumberish } from 'ethers'
import { Chain } from './models'
import { TokenIndex } from './constants'
import { TChain, TAmount, TProvider } from './types'
import Base from './Base'

/**
 * Class reprensenting AMM contract
 * @namespace AMM
 */
class AMM extends Base {
  /** Chain model */
  public chain: Chain

  /** Token class instance */
  public tokenSymbol: string

  /**
   * @desc Instantiates AMM instance.
   * Returns a new Hop AMM SDK instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @param {Object} token - Token model
   * @param {Object} chain - Chain model
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @Returns {Object} Hop AMM instance
   * @example
   *```js
   *import { AMM, Token, Chain } from '@hop-protocol/sdk'
   *
   *const amm = new AMM('mainnet', Token.USDC, Chain.xDai)
   *```
   */
  constructor (
    network: string,
    tokenSymbol: string,
    chain?: TChain,
    signer?: TProvider
  ) {
    super(network, signer)
    if (!tokenSymbol) {
      throw new Error('token is required')
    }
    chain = this.toChainModel(chain)
    if (chain) {
      this.chain = chain
    }
    this.tokenSymbol = tokenSymbol
  }

  /**
   * @desc Returns hop AMM instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} Hop AMM instance with connected signer.
   * @example
   *```js
   *import { AMM } from '@hop-protocol/sdk'
   *
   *const signer = new Wallet(privateKey)
   *let amm = new AMM(...)
   * // ...
   *amm = amm.connect(signer)
   *```
   */
  public connect (signer: TProvider) {
    return new AMM(this.network, this.tokenSymbol, this.chain, signer)
  }

  /**
   * @desc Sends transaction to add liquidity to AMM.
   * @param {Object} amount0Desired - Amount of token #0 in smallest unit
   * @param {Object} amount1Desired - Amount of token #1 in smallest unit
   * @param {number} minToMint - Minimum amount of LP token to mint in order for
   * transaction to be successful.
   * @param {Number} deadline - Order deadline in seconds
   * @returns {Object} Ethers transaction object.
   * @example
   *```js
   *import { AMM } from '@hop-protocol/sdk'
   *
   *const amm = new AMM(...)
   *const tx = await amm.addLiquidity('1000000000000000000', '1000000000000000000', '0')
   *console.log(tx.hash)
   *```
   */
  public async addLiquidity (
    amount0Desired: TAmount,
    amount1Desired: TAmount,
    minToMint: TAmount = 0,
    deadline: number = this.defaultDeadlineSeconds
  ) {
    deadline = this.normalizeDeadline(deadline)
    const amounts = [amount0Desired, amount1Desired]
    const saddleSwap = await this.getSaddleSwap()
    return saddleSwap.addLiquidity(
      amounts,
      minToMint,
      deadline,
      this.txOverrides(this.chain)
    )
  }

  /**
   * @desc Sends transaction to remove liquidity from AMM.
   * @param {Object} liqudityTokenAmount - Amount of LP tokens to burn.
   * @param {Number} amount0Min - Minimum amount of token #0 to receive in order
   * for transaction to be successful.
   * @param {Number} amount1Min - Minimum amount of token #1 to receive in order
   * for transaction to be successful.
   * transaction to be successful.
   * @param {Number} deadline - Order deadline in seconds
   * @returns {Object} Ethers transaction object.
   * @example
   *```js
   *import { AMM } from '@hop-protocol/sdk'
   *
   *const amm = new AMM(...)
   *const tx = await amm.removeLiquidity('1000000000000000000', '0', '0')
   *console.log(tx.hash)
   *```
   */
  public async removeLiquidity (
    liqudityTokenAmount: TAmount,
    amount0Min: TAmount = 0,
    amount1Min: TAmount = 0,
    deadline: number = this.defaultDeadlineSeconds
  ) {
    deadline = this.normalizeDeadline(deadline)
    const saddleSwap = await this.getSaddleSwap()
    const amounts = [amount0Min, amount1Min]
    return saddleSwap.removeLiquidity(
      liqudityTokenAmount,
      amounts,
      deadline,
      this.txOverrides(this.chain)
    )
  }

  // ToDo: Docs
  public async calculateToHToken (amount: BigNumberish) {
    return this.calculateSwap(
      TokenIndex.CanonicalToken,
      TokenIndex.HopBridgeToken,
      amount
    )
  }

  // ToDo: Docs
  public async calculateFromHToken (amount: BigNumberish) {
    return this.calculateSwap(
      TokenIndex.HopBridgeToken,
      TokenIndex.CanonicalToken,
      amount
    )
  }

  /**
   * @desc Returns the address of the L2 canonical token.
   * @returns {String} address
   */
  public async getCanonicalTokenAddress () {
    return this.getL2CanonicalTokenAddress(this.tokenSymbol, this.chain)
  }

  /**
   * @desc Returns the address of the L2 hop token.
   * @returns {String} address
   */
  public async getHopTokenAddress () {
    return this.getL2HopBridgeTokenAddress(this.tokenSymbol, this.chain)
  }

  /**
   * @desc Returns the Saddle swap contract instance for the specified chain.
   * @param {Object} chain - Chain name or model
   * @returns {Object} Ethers contract instance.
   */
  public async getSaddleSwap () {
    const saddleSwapAddress = this.getL2SaddleSwapAddress(
      this.tokenSymbol,
      this.chain
    )
    if (!saddleSwapAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(this.chain)
    return this.getContract(saddleSwapAddress, saddleSwapAbi, provider)
  }

  private async calculateSwap (
    fromIndex: TokenIndex,
    toIndex: TokenIndex,
    amount: BigNumberish
  ) {
    const saddleSwap = await this.getSaddleSwap()
    return saddleSwap.calculateSwap(fromIndex, toIndex, amount)
  }

  /**
   * @readonly
   * @desc The default deadline to use in seconds.
   * @returns {Number} Deadline in seconds
   */
  public get defaultDeadlineSeconds () {
    const defaultDeadlineMinutes = 30
    return (Date.now() / 1000 + defaultDeadlineMinutes * 60) | 0
  }

  /**
   * @desc Truncate any decimal places in deadline unix timestamp.
   * @param {Number} deadline - deadline timestamp
   * @returns {Number} Deadline in seconds
   */
  private normalizeDeadline (deadline: number) {
    return parseInt(deadline.toString(), 10)
  }
}

export default AMM
