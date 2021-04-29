import { Signer, Contract } from 'ethers'
import { saddleSwapAbi } from '@hop-protocol/abi'
import { addresses } from './config'
import { Chain } from './models'
import { TChain, TToken, TAmount, TProvider } from './types'
import TokenClass from './Token'
import Base from './Base'

/**
 * Class reprensenting AMM contract
 * @namespace AMM
 */
class AMM extends Base {
  /** Ethers signer */
  public signer: TProvider

  /** Chain model */
  public chain: Chain

  /** Token class instance */
  public token: TokenClass

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
    token: TToken,
    chain?: TChain,
    signer?: TProvider
  ) {
    super(network)
    if (!token) {
      throw new Error('token is required')
    }
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    if (signer) {
      this.signer = signer
    }
    if (chain) {
      this.chain = chain
    }
    this.token = new TokenClass(
      this.network,
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name,
      signer
    )
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
    return new AMM(this.network, this.token, this.chain, signer)
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
    const saddleSwap = await this.getSaddleSwap(this.chain)
    return saddleSwap.addLiquidity(amounts, minToMint, deadline)
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
    const saddleSwap = await this.getSaddleSwap(this.chain)
    const amounts = [amount0Min, amount1Min]
    return saddleSwap.removeLiquidity(liqudityTokenAmount, amounts, deadline)
  }

  /**
   * @desc Returns the address of the L2 canonical token.
   * @returns {String} address
   */
  public async getCanonicalTokenAddress () {
    return addresses[this.network][this.token.symbol][this.chain.slug]
      .l2CanonicalToken
  }

  /**
   * @desc Returns the address of the L2 hop token.
   * @returns {String} address
   */
  public async getHopTokenAddress () {
    return addresses[this.network][this.token.symbol][this.chain.slug]
      .l2HopBridgeToken
  }

  /**
   * @desc Returns the Saddle swap contract instance for the specified chain.
   * @param {Object} chain - Chain name or model
   * @returns {Object} Ethers contract instance.
   */
  public async getSaddleSwap (chain: TChain) {
    chain = this.toChainModel(chain)
    const tokenSymbol = this.token.symbol
    const saddleSwapAddress =
      addresses[this.network][tokenSymbol][chain.slug].l2SaddleSwap
    const provider = await this.getSignerOrProvider(chain)
    return new Contract(saddleSwapAddress, saddleSwapAbi, provider)
  }

  /**
   * @desc Returns the connected signer address.
   * @returns {String} Ethers signer address
   */
  public getSignerAddress () {
    if (!this.signer) {
      throw new Error('signer not connected')
    }
    return (this.signer as Signer)?.getAddress()
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
   * @desc Returns the connected signer if it's connected to the specified
   * chain id, otherwise it returns a regular provider.
   * @param {Object} chain - Chain name or model
   * @param {Object} signer - Ethers signer or provider
   * @returns {Object} Ethers signer or provider
   */
  private async getSignerOrProvider (
    chain: TChain,
    signer: TProvider = this.signer
  ) {
    chain = this.toChainModel(chain)
    if (!signer) {
      return chain.provider
    }
    if (signer instanceof Signer) {
      if (!signer.provider) {
        return signer.connect(chain.provider)
      }
      const connectedChainId = await signer.getChainId()
      if (connectedChainId !== chain.chainId) {
        return chain.provider
      }
    }
    return signer
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
