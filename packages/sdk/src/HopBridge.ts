import AMM from './AMM'
import Base, { ChainProviders } from './Base'
import Chain from './models/Chain'
import Token from './Token'
import TokenModel from './models/Token'
import fetch from 'isomorphic-fetch'

import {
  L1ERC20Bridge__factory,
  L1HomeAMBNativeToErc20__factory,
  L2AmmWrapper__factory,
  L2Bridge,
  L2Bridge__factory
} from '@hop-protocol/core/contracts'

import {
  BigNumber,
  BigNumberish,
  Signer,
  ethers
} from 'ethers'
import {
  BondTransferGasLimit,
  CanonicalToken,
  Errors,
  HToken,
  LpFeeBps,
  PendingAmountBuffer,
  SettlementGasLimitPerTx,
  TokenIndex,
  TokenSymbol
} from './constants'
import { PriceFeed } from './priceFeed'
import { TAmount, TChain, TProvider, TTime, TTimeSlot, TToken } from './types'
import { bondableChains, metadata } from './config'
import { getAddress as checksumAddress, parseUnits } from 'ethers/lib/utils'

type SendL1ToL2Input = {
  destinationChain: Chain
  sourceChain: Chain
  relayer?: string
  relayerFee?: TAmount
  amount: TAmount
  amountOutMin?: TAmount
  deadline?: BigNumberish
  recipient?: string
  checkAllowance?: boolean
}

type SendL2ToL1Input = {
  destinationChain: Chain
  sourceChain: Chain
  amount: TAmount
  amountOutMin: TAmount
  destinationAmountOutMin?: TAmount
  deadline?: BigNumberish
  destinationDeadline?: BigNumberish
  bonderFee?: TAmount
  recipient?: string
  checkAllowance?: boolean
}

type SendL2ToL2Input = {
  destinationChain: Chain
  sourceChain: Chain
  amount: TAmount
  amountOutMin: TAmount
  destinationAmountOutMin?: TAmount
  bonderFee?: TAmount
  deadline?: BigNumberish
  destinationDeadline?: BigNumberish
  recipient?: string
  checkAllowance?: boolean
}

type SendOptions = {
  deadline: BigNumberish
  relayer: string
  relayerFee: TAmount
  recipient: string
  amountOutMin: TAmount
  bonderFee: TAmount
  destinationAmountOutMin: TAmount
  destinationDeadline: BigNumberish
  checkAllowance?: boolean
}

type AddLiquidityOptions = {
  minToMint: TAmount
  deadline: BigNumberish
}

type RemoveLiquidityOptions = {
  amount0Min: TAmount
  amount1Min: TAmount
  deadline: BigNumberish
}

type RemoveLiquidityOneTokenOptions = {
  amountMin: TAmount
  deadline: BigNumberish
}

type RemoveLiquidityImbalanceOptions = {
  maxBurnAmount: TAmount
  deadline: BigNumberish
}

/**
 * Class representing Hop bridge.
 * @namespace HopBridge
 */
class HopBridge extends Base {
  private tokenSymbol: TokenSymbol

  /** Source Chain model */
  public sourceChain: Chain

  /** Destination Chain model */
  public destinationChain: Chain

  /** Default deadline for transfers */
  public defaultDeadlineMinutes = 7 * 24 * 60 // 1 week

  public readonly priceFeed: PriceFeed

  /**
   * @desc Instantiates Hop Bridge.
   * Returns a new Hop Bridge instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @param {Object} token - Token symbol or model
   * @param {Object} sourceChain - Source chain model
   * @param {Object} destinationChain - Destination chain model
   * @returns {Object} HopBridge SDK instance.
   * @example
   *```js
   *import { HopBridge, Chain, Token } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const bridge = new HopBridge('kovan', signer, Token.USDC, Chain.Optimism, Chain.Gnosis)
   *```
   */
  constructor (
    network: string,
    signer: TProvider,
    token: TToken,
    chainProviders?: ChainProviders
  ) {
    super(network, signer, chainProviders)

    if (token instanceof Token || token instanceof TokenModel) {
      this.tokenSymbol = token.symbol
    } else if (typeof token === 'string') {
      this.tokenSymbol = token
    }

    if (!token) {
      throw new Error('token is required')
    }

    this.priceFeed = new PriceFeed()
  }

  /**
   * @desc Returns hop bridge instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} New HopBridge SDK instance with connected signer.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *let hop = new Hop()
   * // ...
   *const bridge = hop.bridge(Token.USDC).connect(signer)
   *```
   */
  public connect (signer: Signer) {
    return new HopBridge(
      this.network,
      signer,
      this.tokenSymbol,
      this.chainProviders
    )
  }

  public getL1Token () {
    return this.toCanonicalToken(this.tokenSymbol, this.network, Chain.Ethereum)
  }

  public getCanonicalToken (chain: TChain) {
    return this.toCanonicalToken(this.tokenSymbol, this.network, chain)
  }

  public getL2HopToken (chain: TChain) {
    return this.toHopToken(this.tokenSymbol, this.network, chain)
  }

  public toCanonicalToken (
    token: TToken,
    network: string,
    chain: TChain
  ) {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    let { name, symbol, decimals, image } = metadata.tokens[network][
      token.canonicalSymbol
    ]

    if (chain.equals(Chain.Gnosis) && token.symbol === CanonicalToken.DAI) {
      symbol = CanonicalToken.XDAI
    }

    let address
    if (chain.isL1) {
      address = this.getL1CanonicalTokenAddress(token.symbol, chain)
    } else {
      address = this.getL2CanonicalTokenAddress(token.symbol, chain)
    }

    return new Token(
      network,
      chain,
      address,
      decimals,
      symbol as never,
      name,
      image,
      this.signer,
      this.chainProviders
    )
  }

  public toHopToken (
    token: TToken,
    network: string,
    chain: TChain
  ) {
    chain = this.toChainModel(chain)
    token = this.toTokenModel(token)
    if (chain.isL1) {
      throw new Error('Hop tokens do not exist on layer 1')
    }

    const { name, symbol, decimals, image } = metadata.tokens[network][
      token.canonicalSymbol
    ]
    const address = this.getL2HopBridgeTokenAddress(token.symbol, chain)

    return new Token(
      network,
      chain,
      address,
      decimals,
      `h${token.canonicalSymbol}` as HToken,
      `Hop ${name}`,
      image,
      this.signer,
      this.chainProviders
    )
  }

  /**
   * @desc Send tokens to another chain.
   * @param {String} tokenAmount - Token amount to send denominated in smallest unit.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Chain, Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *\// send 1 USDC token from Optimism -> Gnosis
   *const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.Gnosis)
   *console.log(tx.hash)
   *```
   */
  public async send (
    tokenAmount: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain,
    options: Partial<SendOptions> = {}
  ) {
    sourceChain = this.toChainModel(sourceChain)
    const populatedTx = await this.populateSendTx(
      tokenAmount,
      sourceChain,
      destinationChain,
      {
        ...options,
        checkAllowance: true
      }
    )

    let balance: BigNumber
    const canonicalToken = this.getCanonicalToken(sourceChain)
    if (this.isNativeToken(sourceChain)) {
      balance = await canonicalToken.getNativeTokenBalance()
    } else {
      balance = await canonicalToken.balanceOf()
    }
    if (balance.lt(tokenAmount)) {
      throw new Error(Errors.NotEnoughAllowance)
    }

    const availableLiquidity = await this.getFrontendAvailableLiquidity(
      sourceChain,
      destinationChain
    )

    const requiredLiquidity = await this.getRequiredLiquidity(tokenAmount, sourceChain)
    const isAvailable = availableLiquidity.gte(requiredLiquidity)
    if (!isAvailable) {
      throw new Error('Insufficient liquidity available by bonder. Try again in a few minutes')
    }

    this.checkConnectedChain(this.signer, sourceChain)
    return this.signer.sendTransaction(populatedTx)
  }

  public async populateSendTx (
    tokenAmount: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain,
    options: Partial<SendOptions> = {}
  ):Promise<any> {
    tokenAmount = BigNumber.from(tokenAmount.toString())
    if (!sourceChain) {
      sourceChain = this.sourceChain
    }
    if (!destinationChain) {
      destinationChain = this.destinationChain
    }
    if (!sourceChain) {
      throw new Error('source chain is required')
    }
    if (!destinationChain) {
      throw new Error('destination chain is required')
    }

    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    tokenAmount = BigNumber.from(tokenAmount.toString())

    // L1 -> L1 or L2
    if (sourceChain.isL1) {
      // L1 -> L1
      if (destinationChain.isL1) {
        throw new Error('Cannot send from layer 1 to layer 1')
      }
      // L1 -> L2
      return this.populateSendL1ToL2Tx({
        destinationChain: destinationChain,
        sourceChain,
        relayer: options?.relayer ?? ethers.constants.AddressZero,
        relayerFee: options?.relayerFee ?? 0,
        amount: tokenAmount,
        amountOutMin: options?.amountOutMin ?? 0,
        deadline: options?.deadline,
        recipient: options?.recipient,
        checkAllowance: options?.checkAllowance
      })
    }
    // else:
    // L2 -> L1 or L2
    let bonderFee = options?.bonderFee
    if (!bonderFee) {
      bonderFee = await this.getTotalFee(
        tokenAmount,
        sourceChain,
        destinationChain
      )
    }

    // L2 -> L1
    if (destinationChain.isL1) {
      return this.populateSendL2ToL1Tx({
        destinationChain: destinationChain,
        sourceChain,
        amount: tokenAmount,
        bonderFee,
        recipient: options?.recipient,
        amountOutMin: options?.amountOutMin,
        deadline: options?.deadline,
        destinationAmountOutMin: options?.destinationAmountOutMin,
        destinationDeadline: options?.destinationDeadline,
        checkAllowance: options?.checkAllowance
      })
    }

    // L2 -> L2
    return this.populateSendL2ToL2Tx({
      destinationChain: destinationChain,
      sourceChain,
      amount: tokenAmount,
      bonderFee,
      recipient: options?.recipient,
      amountOutMin: options?.amountOutMin,
      deadline: options?.deadline,
      destinationAmountOutMin: options?.destinationAmountOutMin,
      destinationDeadline: options?.destinationDeadline,
      checkAllowance: options?.checkAllowance
    })
  }

  public async estimateSendGasLimit (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ) {
    const populatedTx = await this.populateSendTx(tokenAmount, sourceChain, destinationChain, options)
    return this.getEstimatedGasLimit(sourceChain, destinationChain, populatedTx)
  }

  private async getEstimatedGasLimit (
    sourceChain: TChain,
    destinationChain: TChain,
    populatedTx: any
  ) {
    sourceChain = this.toChainModel(sourceChain)
    if (!populatedTx.from) {
      // a `from` address is required if using only provider (not signer)
      populatedTx.from = await this.getGasEstimateFromAddress(sourceChain, destinationChain)
    }
    return sourceChain.provider.estimateGas({
      ...populatedTx,
      gasLimit: 500000
    })
  }

  public async getSendEstimatedGasCost (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ) {
    sourceChain = this.toChainModel(sourceChain)
    const populatedTx = await this.populateSendTx(tokenAmount, sourceChain, destinationChain, options)
    const estimatedGasLimit = await this.getEstimatedGasLimit(sourceChain, destinationChain, populatedTx)
    const gasPrice = await sourceChain.provider.getGasPrice()
    return gasPrice.mul(estimatedGasLimit)
  }

  // ToDo: Docs
  public getSendApprovalAddress (
    sourceChain: TChain,
    isHTokenTransfer: boolean = false
  ) {
    sourceChain = this.toChainModel(sourceChain)
    if (sourceChain.equals(Chain.Ethereum)) {
      return this.getL1BridgeAddress(this.tokenSymbol, sourceChain)
    }

    const ammWrapperAddress = this.getL2AmmWrapperAddress(
      this.tokenSymbol,
      sourceChain
    )
    const l2BridgeAddress = this.getL2BridgeAddress(
      this.tokenSymbol,
      sourceChain
    )
    return isHTokenTransfer ? l2BridgeAddress : ammWrapperAddress
  }

  public async populateSendApprovalTx (
    tokenAmount: TAmount,
    sourceChain: TChain,
    isHTokenTransfer: boolean = false
  ):Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    const spender = await this.getSendApprovalAddress(sourceChain, isHTokenTransfer)
    const isNativeToken = this.isNativeToken(sourceChain)
    if (isNativeToken) {
      return null
    }
    let token
    if (sourceChain.isL1) {
      token = this.getL1Token()
    } else if (isHTokenTransfer) {
      token = this.getL2HopToken(sourceChain)
    } else {
      token = this.getCanonicalToken(sourceChain)
    }
    const populatedTx = await token.populateApproveTx(spender, tokenAmount)
    return populatedTx
  }

  public async sendApproval (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    isHTokenTransfer: boolean = false
  ) {
    sourceChain = this.toChainModel(sourceChain)
    const populatedTx = await this.populateSendApprovalTx(tokenAmount, sourceChain, isHTokenTransfer)
    if (populatedTx) {
      this.checkConnectedChain(this.signer, sourceChain)
      return this.signer.sendTransaction(populatedTx)
    }
  }

  // ToDo: Docs
  public async sendHToken (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ) {
    sourceChain = this.toChainModel(sourceChain)
    const populatedTx = await this.populateSendHTokensTx(tokenAmount, sourceChain, destinationChain, options)
    this.checkConnectedChain(this.signer, sourceChain)
    return this.signer.sendTransaction(populatedTx)
  }

  public async estimateSendHTokensGasLimit (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ) {
    const populatedTx = await this.sendHToken(tokenAmount, sourceChain, destinationChain, options)
    return this.getEstimatedGasLimit(sourceChain, destinationChain, populatedTx)
  }

  public async populateSendHTokensTx (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ):Promise<any> {
    if (!sourceChain) {
      throw new Error('source chain is required')
    }
    if (!destinationChain) {
      throw new Error('destination chain is required')
    }

    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    if (sourceChain.isL1 && destinationChain.isL1) {
      throw new Error('sourceChain and destinationChain cannot both be L1')
    } else if (!sourceChain.isL1 && !destinationChain.isL1) {
      throw new Error('Sending hToken L2 to L2 is not currently supported')
    }

    if (
      options?.deadline ||
      options?.amountOutMin ||
      options?.destinationDeadline ||
      options?.destinationAmountOutMin
    ) {
      throw new Error('Invalid sendHToken option')
    }

    let defaultBonderFee = BigNumber.from(0)
    if (!sourceChain.isL1) {
      defaultBonderFee = await this.getTotalFee(
        tokenAmount,
        sourceChain,
        destinationChain
      )
    }

    let recipient = options?.recipient ?? await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient is required')
    }
    recipient = checksumAddress(recipient)

    const bonderFee = options?.bonderFee
      ? BigNumber.from(options?.bonderFee)
      : defaultBonderFee
    const amountOutMin = BigNumber.from(0)
    const deadline = BigNumber.from(0)
    const relayer = ethers.constants.AddressZero

    if (sourceChain.isL1) {
      if (bonderFee.gt(0)) {
        throw new Error('Bonder fee should be 0 when sending hToken to L2')
      }

      const isNativeToken = this.isNativeToken(sourceChain)
      const txOptions = [
        destinationChain.chainId,
        recipient,
        tokenAmount,
        amountOutMin,
        deadline,
        relayer,
        bonderFee,
        {
          ...(await this.txOverrides(Chain.Ethereum)),
          value: isNativeToken ? tokenAmount : undefined
        }
      ] as const

      const l1Bridge = await this.getL1Bridge(sourceChain.provider)
      return l1Bridge.populateTransaction.sendToL2(...txOptions)
    } else {
      if (bonderFee.eq(0)) {
        throw new Error('Send at least the minimum Bonder fee')
      }

      const txOptions = [
        destinationChain.chainId,
        recipient,
        tokenAmount,
        bonderFee,
        amountOutMin,
        deadline,
        await this.txOverrides(sourceChain)
      ] as const

      const l2Bridge = await this.getL2Bridge(sourceChain, sourceChain.provider)
      return l2Bridge.populateTransaction.send(...txOptions)
    }
  }

  // ToDo: Docs
  public getTokenSymbol () {
    return this.tokenSymbol
  }

  // ToDo: Docs
  public getTokenImage () {
    return this.getL1Token()?.image
  }

  // ToDo: Docs
  public async getSendData (
    amountIn: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain,
    isHTokenSend: boolean = false
  ) {
    amountIn = BigNumber.from(amountIn)
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const hTokenAmount = await this.calcToHTokenAmount(amountIn, sourceChain)

    const amountOutWithoutFeePromise = this.calcFromHTokenAmount(
      hTokenAmount,
      destinationChain
    )

    const amountInNoSlippage = BigNumber.from(1000)
    const amountOutNoSlippagePromise = this.getAmountOut(
      amountInNoSlippage,
      sourceChain,
      destinationChain
    )

    const bonderFeeRelativePromise = this.getBonderFeeRelative(
      amountIn,
      sourceChain,
      destinationChain
    )

    const destinationTxFeePromise = this.getDestinationTransactionFee(
      sourceChain,
      destinationChain
    )

    const [
      amountOutWithoutFee,
      amountOutNoSlippage,
      bonderFeeRelative,
      destinationTxFee
    ] = await Promise.all([
      amountOutWithoutFeePromise,
      amountOutNoSlippagePromise,
      bonderFeeRelativePromise,
      destinationTxFeePromise
    ])

    const amountOut = await this.calcFromHTokenAmount(
      hTokenAmount,
      destinationChain
    )

    let adjustedBonderFee
    let adjustedDestinationTxFee
    let totalFee
    if (sourceChain.isL1) {
      // there are no Hop fees when the source is L1
      adjustedBonderFee = BigNumber.from(0)
      adjustedDestinationTxFee = BigNumber.from(0)
      totalFee = BigNumber.from(0)
    } else {
      if (isHTokenSend) {
        // fees do not need to be adjusted for AMM slippage when sending hTokens
        adjustedBonderFee = bonderFeeRelative
        adjustedDestinationTxFee = destinationTxFee
      } else {
        // adjusted fee is the fee in the canonical token after adjusting for the hToken price
        adjustedBonderFee = await this.calcFromHTokenAmount(
          bonderFeeRelative,
          destinationChain
        )

        adjustedDestinationTxFee = await this.calcFromHTokenAmount(
          destinationTxFee,
          destinationChain
        )
      }

      // enforce bonderFeeAbsolute after adjustment
      const bonderFeeAbsolute = await this.getBonderFeeAbsolute()
      adjustedBonderFee = adjustedBonderFee.gt(bonderFeeAbsolute)
        ? adjustedBonderFee
        : bonderFeeAbsolute
      totalFee = adjustedBonderFee.add(adjustedDestinationTxFee)
    }

    const sourceToken = this.getCanonicalToken(sourceChain)
    const destToken = this.getCanonicalToken(destinationChain)

    const rate = this.getRate(
      amountIn,
      amountOutWithoutFee,
      sourceToken,
      destToken
    )

    const marketRate = this.getRate(
      amountInNoSlippage,
      amountOutNoSlippage,
      sourceToken,
      destToken
    )

    const priceImpact = this.getPriceImpact(rate, marketRate)

    const lpFees = await this.getLpFees(amountIn, sourceChain, destinationChain)
    let estimatedReceived = amountOut
    if (totalFee.gt(0)) {
      estimatedReceived = estimatedReceived.sub(totalFee)
    }

    if (estimatedReceived.lt(0)) {
      estimatedReceived = BigNumber.from(0)
    }

    return {
      amountOut,
      rate,
      priceImpact,
      requiredLiquidity: hTokenAmount,
      lpFees,
      adjustedBonderFee,
      adjustedDestinationTxFee,
      totalFee,
      estimatedReceived
    }
  }

  // ToDo: Docs
  public async getAmmData (
    chain: TChain,
    amountIn: BigNumberish,
    isToHToken: boolean,
    slippageTolerance: number
  ) {
    chain = this.toChainModel(chain)
    amountIn = BigNumber.from(amountIn)
    const canonicalToken = this.getCanonicalToken(chain)
    const hToken = this.getL2HopToken(chain)

    const sourceToken = isToHToken ? canonicalToken : hToken
    const destToken = isToHToken ? hToken : canonicalToken

    const amountInNoSlippage = BigNumber.from(1000)
    let amountOut
    let amountOutNoSlippage
    if (isToHToken) {
      amountOut = await this.calcToHTokenAmount(amountIn, chain)
      amountOutNoSlippage = await this.calcToHTokenAmount(
        amountInNoSlippage,
        chain
      )
    } else {
      amountOut = await this.calcFromHTokenAmount(amountIn, chain)
      amountOutNoSlippage = await this.calcFromHTokenAmount(
        amountInNoSlippage,
        chain
      )
    }

    const rate = this.getRate(amountIn, amountOut, sourceToken, destToken)

    const marketRate = this.getRate(
      amountInNoSlippage,
      amountOutNoSlippage,
      sourceToken,
      destToken
    )

    const priceImpact = this.getPriceImpact(rate, marketRate)

    const oneDestBN = ethers.utils.parseUnits('1', sourceToken.decimals)

    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const amountOutMin = amountOut.mul(minBps).div(10000)

    // Divide by 10000 at the end so that the amount isn't floored at 0
    const lpFee = BigNumber.from(LpFeeBps)
    const lpFeeBN = parseUnits(lpFee.toString(), destToken.decimals)
    const lpFeeAmount = amountIn
      .mul(lpFeeBN)
      .div(oneDestBN)
      .div(10000)

    return {
      rate,
      priceImpact,
      amountOutMin,
      lpFeeAmount
    }
  }

  public async getTotalFee (
    amountIn: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber> {
    const { totalFee } = await this.getSendData(
      amountIn,
      sourceChain,
      destinationChain
    )

    return totalFee
  }

  public async getLpFees (
    amountIn: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    let lpFeeBpsBn = BigNumber.from(0)
    if (!sourceChain.isL1) {
      lpFeeBpsBn = lpFeeBpsBn.add(LpFeeBps)
    }
    if (!destinationChain.isL1) {
      lpFeeBpsBn = lpFeeBpsBn.add(LpFeeBps)
    }

    amountIn = BigNumber.from(amountIn)
    const lpFees = amountIn.mul(lpFeeBpsBn).div(10000)

    return lpFees
  }

  public async getDestinationTransactionFee (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (sourceChain?.equals(Chain.Ethereum)) {
      return BigNumber.from(0)
    }

    const canonicalToken = this.getCanonicalToken(sourceChain)
    const chainNativeToken = this.getChainNativeToken(destinationChain)
    const chainNativeTokenPrice = await this.priceFeed.getPriceByTokenSymbol(
      chainNativeToken.symbol
    )
    const tokenPrice = await this.priceFeed.getPriceByTokenSymbol(
      canonicalToken.symbol
    )

    const rate = chainNativeTokenPrice / tokenPrice

    let gasPrice = await destinationChain.provider.getGasPrice()
    let bondTransferGasLimit = await this.estimateBondWithdrawalGasLimit(
      sourceChain,
      destinationChain
    )

    // Arbitrum returns a gasLimit & gasPriceBid of 2x what is generally paid
    if (destinationChain.equals(Chain.Arbitrum)) {
      gasPrice = gasPrice.div(2)
      bondTransferGasLimit = bondTransferGasLimit.div(2)
    }

    // Include the cost to settle an individual transfer
    const settlementGasLimitPerTx: number = SettlementGasLimitPerTx[destinationChain.slug]
    const bondTransferGasLimitWithSettlement = bondTransferGasLimit.add(settlementGasLimitPerTx)

    let txFeeEth = gasPrice.mul(bondTransferGasLimitWithSettlement)
    const oneEth = ethers.utils.parseEther('1')
    const rateBN = ethers.utils.parseUnits(
      rate.toFixed(canonicalToken.decimals),
      canonicalToken.decimals
    )

    if (destinationChain.equals(Chain.Optimism)) {
      const l1FeeInWei = await this.getOptimismL1Fee(sourceChain, destinationChain)
      txFeeEth = txFeeEth.add(l1FeeInWei)
    }

    let fee = txFeeEth.mul(rateBN).div(oneEth)

    if (
      destinationChain.equals(Chain.Ethereum) ||
      destinationChain.equals(Chain.Optimism) ||
      destinationChain.equals(Chain.Arbitrum)
    ) {
      const multiplier = ethers.utils.parseEther(this.destinationFeeGasPriceMultiplier.toString())
      if (multiplier.gt(0)) {
        fee = fee.mul(multiplier).div(oneEth)
      }
    }

    return fee
  }

  async getOptimismL1Fee (
    sourceChain: TChain,
    destinationChain: TChain
  ) {
    try {
      const [gasLimit, { data, to }] = await Promise.all([
        this.estimateBondWithdrawalGasLimit(sourceChain, destinationChain),
        this.populateBondWithdrawalTx(sourceChain, destinationChain)
      ])
      const l1FeeInWei = await this.estimateOptimismL1FeeFromData(gasLimit, data, to)
      return l1FeeInWei
    } catch (err) {
      console.error(err)
      return BigNumber.from(0)
    }
  }

  async estimateBondWithdrawalGasLimit (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<any> {
    destinationChain = this.toChainModel(destinationChain)
    try {
      const populatedTx = await this.populateBondWithdrawalTx(sourceChain, destinationChain)
      const estimatedGas = await destinationChain.provider.estimateGas(populatedTx)
      return estimatedGas
    } catch (err) {
      console.error(err, {
        destinationChain
      })
      let bondTransferGasLimit: string = BondTransferGasLimit.Ethereum
      if (destinationChain.equals(Chain.Optimism)) {
        bondTransferGasLimit = BondTransferGasLimit.Optimism
      } else if (destinationChain.equals(Chain.Arbitrum)) {
        bondTransferGasLimit = BondTransferGasLimit.Arbitrum
      }
      return BigNumber.from(bondTransferGasLimit)
    }
  }

  async populateBondWithdrawalTx (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<any> {
    destinationChain = this.toChainModel(destinationChain)
    let destinationBridge
    if (destinationChain.isL1) {
      destinationBridge = await this.getL1Bridge()
    } else {
      destinationBridge = await this.getL2Bridge(destinationChain)
    }
    destinationBridge = destinationBridge.connect(destinationChain.provider)
    const bonder = this.getBonderAddress(sourceChain, destinationChain)
    const amount = BigNumber.from(10)
    const amountOutMin = BigNumber.from(0)
    const bonderFee = BigNumber.from(1)
    const deadline = this.defaultDeadlineSeconds
    const transferNonce = `0x${'0'.repeat(64)}`
    const recipient = `0x${'1'.repeat(40)}`
    const attemptSwap = this.shouldAttemptSwap(amountOutMin, deadline)
    if (attemptSwap && !destinationChain.isL1) {
      const payload = [
        recipient,
        amount,
        transferNonce,
        bonderFee,
        amountOutMin,
        deadline,
        {
          from: bonder
        }
      ] as const
      return (destinationBridge as L2Bridge).populateTransaction.bondWithdrawalAndDistribute(
        ...payload
      )
    } else {
      const payload = [
        recipient,
        amount,
        transferNonce,
        bonderFee,
        {
          from: bonder
        }
      ] as const
      return destinationBridge.populateTransaction.bondWithdrawal(
        ...payload
      )
    }
  }

  /**
   * @desc Estimate token amount out.
   * @param {String} tokenAmountIn - Token amount input.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Amount as BigNumber.
   * @example
   *```js
   *import { Hop, Chain Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *const amountOut = await bridge.getAmountOut('1000000000000000000', Chain.Optimism, Chain.Gnosis)
   *console.log(amountOut)
   *```
   */
  public async getAmountOut (
    tokenAmountIn: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain
  ) {
    tokenAmountIn = BigNumber.from(tokenAmountIn.toString())
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const hTokenAmount = await this.calcToHTokenAmount(
      tokenAmountIn,
      sourceChain
    )
    const amountOut = await this.calcFromHTokenAmount(
      hTokenAmount,
      destinationChain
    )

    return amountOut
  }

  /**
   * @desc Estimate the bonder liquidity needed at the destination.
   * @param {String} tokenAmountIn - Token amount input.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Amount as BigNumber.
   * @example
   *```js
   *import { Hop, Chain Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *const requiredLiquidity = await bridge.getRequiredLiquidity('1000000000000000000', Chain.Optimism, Chain.Gnosis)
   *console.log(requiredLiquidity)
   *```
   */
  public async getRequiredLiquidity (
    tokenAmountIn: TAmount,
    sourceChain: TChain
  ): Promise<BigNumber> {
    tokenAmountIn = BigNumber.from(tokenAmountIn.toString())
    sourceChain = this.toChainModel(sourceChain)

    if (sourceChain.equals(Chain.Ethereum)) {
      return BigNumber.from(0)
    }

    const hTokenAmount = await this.calcToHTokenAmount(
      tokenAmountIn,
      sourceChain
    )

    return hTokenAmount
  }

  public async getAvailableLiquidity (
    destinationChain: TChain,
    bonder: string
  ): Promise<BigNumber> {
    const [credit, debit] = await Promise.all([
      this.getCredit(destinationChain, bonder),
      this.getTotalDebit(destinationChain, bonder)
    ])

    const availableLiquidity = credit.sub(debit)
    return availableLiquidity
  }

  /**
   * @desc Returns available liquidity for Hop bridge at specified chain.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Available liquidity as BigNumber.
   */
  public async getFrontendAvailableLiquidity (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    const token = this.toTokenModel(this.tokenSymbol)
    const bonder = this.getBonderAddress(sourceChain, destinationChain)
    let availableLiquidity = await this.getAvailableLiquidity(
      destinationChain,
      bonder
    )
    const unbondedTransferRootAmount = await this.getUnbondedTransferRootAmount(
      sourceChain,
      destinationChain
    )

    if (
      this.isOruToL1(sourceChain, destinationChain) ||
      this.isNonOruToL1(sourceChain, destinationChain)
    ) {
      const bridgeContract = await this.getBridgeContract(sourceChain)
      let pendingAmounts = BigNumber.from(0)
      for (const chain of bondableChains) {
        const exists = this.getL2BridgeAddress(this.tokenSymbol, chain)
        if (!exists) {
          continue
        }
        const bridge = await this.getBridgeContract(chain)
        const pendingAmount = await bridge.pendingAmountForChainId(
          Chain.Ethereum.chainId
        )
        pendingAmounts = pendingAmounts.add(pendingAmount)
      }

      const tokenPrice = await this.priceFeed.getPriceByTokenSymbol(
        token.canonicalSymbol
      )
      const tokenPriceBn = parseUnits(tokenPrice.toString(), token.decimals)
      const bufferAmountBn = parseUnits(PendingAmountBuffer, token.decimals)
      const precision = parseUnits('1', token.decimals)
      const bufferAmountTokensBn = bufferAmountBn
        .div(tokenPriceBn)
        .mul(precision)

      availableLiquidity = availableLiquidity
        .sub(pendingAmounts)
        .sub(unbondedTransferRootAmount)
        .sub(bufferAmountTokensBn)

      if (this.isOruToL1(sourceChain, destinationChain)) {
        availableLiquidity = availableLiquidity.div(2)
      }
    }

    if (availableLiquidity.lt(0)) {
      return BigNumber.from(0)
    }

    return availableLiquidity
  }

  isOruToL1 (sourceChain: Chain, destinationChain: Chain) {
    return (
      destinationChain.equals(Chain.Ethereum) &&
      bondableChains.includes(sourceChain.slug)
    )
  }

  isNonOruToL1 (sourceChain: Chain, destinationChain: Chain) {
    return (
      destinationChain.equals(Chain.Ethereum) &&
      !bondableChains.includes(sourceChain.slug)
    )
  }

  async getBonderAvailableLiquidityData () {
    const url = `https://assets.hop.exchange/${this.network}/v1-available-liquidity.json`
    const res = await fetch(url)
    const json = await res.json()
    if (!json) {
      throw new Error('expected json object')
    }
    const { timestamp, data } = json
    const tenMinutes = 10 * 60 * 1000
    const isOutdated = Date.now() - timestamp > tenMinutes
    if (isOutdated) {
      return
    }

    return data
  }

  async getUnbondedTransferRootAmount (
    sourceChain: Chain,
    destinationChain: Chain
  ) {
    try {
      const data = await this.getBonderAvailableLiquidityData()
      if (data) {
        const _unbondedTransferRootAmount =
          data?.[this.tokenSymbol]?.unbondedTransferRootAmounts?.[
            sourceChain.slug
          ]?.[destinationChain.slug]
        if (_unbondedTransferRootAmount) {
          return BigNumber.from(_unbondedTransferRootAmount)
        }
      }
    } catch (err) {
      console.error(err)
    }

    return BigNumber.from(0)
  }

  /**
   * @desc Returns bridge contract instance for specified chain.
   * @param {Object} chain - chain model.
   * @returns {Object} Ethers contract instance.
   */
  public async getBridgeContract (chain: TChain) {
    chain = this.toChainModel(chain)
    let bridge: ethers.Contract
    if (chain.isL1) {
      bridge = await this.getL1Bridge()
    } else {
      bridge = await this.getL2Bridge(chain)
    }
    return bridge
  }

  /**
   * @desc Returns total credit that bonder holds on Hop bridge at specified chain.
   * @param {Object} chain - Chain model.
   * @returns {Object} Total credit as BigNumber.
   */
  public async getCredit (
    sourceChain: TChain,
    bonder: string
  ): Promise<BigNumber> {
    const bridge = await this.getBridgeContract(sourceChain)
    return bridge.getCredit(bonder)
  }

  /**
   * @desc Returns total debit, including sliding window debit, that bonder holds on Hop bridge at specified chain.
   * @param {Object} chain - Chain model.
   * @returns {Object} Total debit as BigNumber.
   */
  public async getTotalDebit (
    sourceChain: TChain,
    bonder: string
  ): Promise<BigNumber> {
    const bridge = await this.getBridgeContract(sourceChain)
    return bridge.getDebitAndAdditionalDebit(bonder)
  }

  /**
   * @desc Returns total debit that bonder holds on Hop bridge at specified chain.
   * @param {Object} chain - Chain model.
   * @returns {Object} Total debit as BigNumber.
   */
  public async getDebit (
    sourceChain: TChain,
    bonder: string
  ): Promise<BigNumber> {
    const bridge = await this.getBridgeContract(sourceChain)
    return bridge.getRawDebit(bonder)
  }

  /**
   * @desc Sends transaction to execute swap on Saddle contract.
   * @param {Object} sourceChain - Source chain model.
   * @param {Boolean} toHop - Converts to Hop token only if set to true.
   * @param {Object} amount - Amount of token to swap.
   * @param {Object} minAmountOut - Minimum amount of tokens to receive in order
   * for transaction to be successful.
   * @param {Number} deadline - Transaction deadline in seconds.
   * @returns {Object} Ethers transaction object.
   */
  public async execSaddleSwap (
    sourceChain: TChain,
    toHop: boolean,
    amount: TAmount,
    minAmountOut: TAmount,
    deadline: BigNumberish
  ) {
    sourceChain = this.toChainModel(sourceChain)
    let tokenIndexFrom: number
    let tokenIndexTo: number

    const l2CanonicalTokenAddress = this.getL2CanonicalTokenAddress(
      this.tokenSymbol,
      sourceChain
    )
    if (!l2CanonicalTokenAddress) {
      throw new Error(`source chain "${sourceChain.slug}" is unsupported`)
    }
    const l2HopBridgeTokenAddress = this.getL2HopBridgeTokenAddress(
      this.tokenSymbol,
      sourceChain
    )
    if (!l2HopBridgeTokenAddress) {
      throw new Error(`source chain "${sourceChain.slug}" is unsupported`)
    }

    const amm = await this.getAmm(sourceChain)
    const saddleSwap = await amm.getSaddleSwap()
    const canonicalTokenIndex = Number(
      (await saddleSwap.getTokenIndex(l2CanonicalTokenAddress)).toString()
    )
    const hopTokenIndex = Number(
      (await saddleSwap.getTokenIndex(l2HopBridgeTokenAddress)).toString()
    )
    if (toHop) {
      tokenIndexFrom = canonicalTokenIndex
      tokenIndexTo = hopTokenIndex
    } else {
      tokenIndexFrom = hopTokenIndex
      tokenIndexTo = canonicalTokenIndex
    }

    return saddleSwap.swap(
      tokenIndexFrom,
      tokenIndexTo,
      amount,
      minAmountOut,
      deadline
    )
  }

  /**
   * @desc Returns Hop L1 Bridge Ethers contract instance.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getL1Bridge (signer: TProvider = this.signer) {
    const bridgeAddress = this.getL1BridgeAddress(
      this.tokenSymbol,
      Chain.Ethereum
    )
    if (!bridgeAddress) {
      throw new Error(`token "${this.tokenSymbol}" is unsupported`)
    }
    const provider = await this.getSignerOrProvider(Chain.Ethereum, signer)
    return L1ERC20Bridge__factory.connect(bridgeAddress, provider)
  }

  /**
   * @desc Returns Hop L2 Bridge Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getL2Bridge (chain: TChain, signer: TProvider = this.signer) {
    chain = this.toChainModel(chain)
    const bridgeAddress = this.getL2BridgeAddress(this.tokenSymbol, chain)
    if (!bridgeAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(chain, signer)
    return L2Bridge__factory.connect(bridgeAddress, provider)
  }

  // ToDo: Docs
  public getAmm (chain: TChain) {
    chain = this.toChainModel(chain)
    if (chain.isL1) {
      throw new Error('No AMM exists on L1')
    }

    return new AMM(this.network, this.tokenSymbol, chain, this.signer)
  }

  /**
   * @desc Returns Hop Bridge AMM wrapper Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getAmmWrapper (chain: TChain, signer: TProvider = this.signer) {
    chain = this.toChainModel(chain)
    const ammWrapperAddress = this.getL2AmmWrapperAddress(
      this.tokenSymbol,
      chain
    )
    if (!ammWrapperAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(chain, signer)
    return L2AmmWrapper__factory.connect(ammWrapperAddress, provider)
  }

  /**
   * @desc Returns Hop Bridge Saddle reserve amounts.
   * @param {Object} chain - Chain model.
   * @returns {Array} Array containing reserve amounts for canonical token
   * and hTokens.
   */
  public async getSaddleSwapReserves (chain: TChain = this.sourceChain) {
    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    return Promise.all([
      saddleSwap.getTokenBalance(0),
      saddleSwap.getTokenBalance(1)
    ])
  }

  public async getReservesTotal (chain: TChain = this.sourceChain) {
    const [reserve0, reserve1] = await this.getSaddleSwapReserves(chain)
    return reserve0.add(reserve1)
  }

  /**
   * @desc Returns Hop Bridge Saddle Swap LP Token Ethers contract instance.
   * @param {Object} chain - Chain model.
   * @param {Object} signer - Ethers signer
   * @returns {Object} Ethers contract instance.
   */
  public async getSaddleLpToken (
    chain: TChain,
    signer: TProvider = this.signer
  ) {
    // ToDo: Remove ability to pass in signer like other token getters
    chain = this.toChainModel(chain)
    const saddleLpTokenAddress = this.getL2SaddleLpTokenAddress(
      this.tokenSymbol,
      chain
    )
    if (!saddleLpTokenAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }

    // ToDo: Get actual saddle LP token symbol and name
    return new Token(
      this.network,
      chain,
      saddleLpTokenAddress,
      18,
      `${this.tokenSymbol} LP` as TokenSymbol,
      `${this.tokenSymbol} LP`,
      '',
      signer,
      this.chainProviders
    )
  }

  /**
   * @desc Sends transaction to add liquidity to AMM.
   * @param {Object} amount0Desired - Amount of token #0 in smallest unit
   * @param {Object} amount1Desired - Amount of token #1 in smallest unit
   * @param {Object} chain - Chain model of desired chain to add liquidity to.
   * @param {Object} options - Method options.
   * @returns {Object} Ethers transaction object.
   */
  public async addLiquidity (
    amount0Desired: TAmount,
    amount1Desired: TAmount,
    chain?: TChain,
    options: Partial<AddLiquidityOptions> = {}
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    amount0Desired = BigNumber.from(amount0Desired.toString())
    chain = this.toChainModel(chain)

    const amm = new AMM(
      this.network,
      this.tokenSymbol,
      chain,
      this.signer,
      this.chainProviders
    )
    return amm.addLiquidity(
      amount0Desired,
      amount1Desired,
      options.minToMint,
      options.deadline
    )
  }

  /**
   * @desc Sends transaction to remove liquidity from AMM.
   * @param {Object} liquidityTokenAmount - Amount of LP tokens to burn.
   * @param {Object} chain - Chain model of desired chain to add liquidity to.
   * @param {Object} options - Method options.
   * @returns {Object} Ethers transaction object.
   */
  public async removeLiquidity (
    liquidityTokenAmount: TAmount,
    chain?: TChain,
    options: Partial<RemoveLiquidityOptions> = {}
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM(
      this.network,
      this.tokenSymbol,
      chain,
      this.signer,
      this.chainProviders
    )
    return amm.removeLiquidity(
      liquidityTokenAmount,
      options.amount0Min,
      options.amount1Min,
      options.deadline
    )
  }

  public async removeLiquidityOneToken (
    lpTokenAmount: TAmount,
    tokenIndex: number,
    chain?: TChain,
    options: Partial<RemoveLiquidityOneTokenOptions> = {}
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM(
      this.network,
      this.tokenSymbol,
      chain,
      this.signer,
      this.chainProviders
    )
    return amm.removeLiquidityOneToken(
      lpTokenAmount,
      tokenIndex,
      options?.amountMin,
      options?.deadline
    )
  }

  public async removeLiquidityImbalance (
    token0Amount: TAmount,
    token1Amount: TAmount,
    chain?: TChain,
    options: Partial<RemoveLiquidityImbalanceOptions> = {}
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM(
      this.network,
      this.tokenSymbol,
      chain,
      this.signer,
      this.chainProviders
    )
    return amm.removeLiquidityImbalance(
      token0Amount,
      token1Amount,
      options?.maxBurnAmount,
      options?.deadline
    )
  }

  public async calculateWithdrawOneToken (
    tokenAmount: TAmount,
    tokenIndex: number,
    chain?: TChain
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM(
      this.network,
      this.tokenSymbol,
      chain,
      this.signer,
      this.chainProviders
    )
    return amm.calculateRemoveLiquidityOneToken(
      tokenAmount,
      tokenIndex
    )
  }

  /**
   * @readonly
   * @desc The default deadline to use in seconds.
   * @returns {Number} Deadline in seconds
   */
  public get defaultDeadlineSeconds () {
    return (Date.now() / 1000 + this.defaultDeadlineMinutes * 60) | 0
  }

  /**
   * @readonly
   * @desc The time slot for the current time.
   * @param {Object} time - Unix timestamp (in seconds) to get the time slot.
   * @returns {Object} Time slot for the given time as BigNumber.
   */
  public async getTimeSlot (time: TTime): Promise<BigNumber> {
    const bridge = await this.getL1Bridge()
    time = BigNumber.from(time.toString())

    return bridge.getTimeSlot(time)
  }

  /**
   * @readonly
   * @desc The challenge period.
   * @returns {Object} The challenge period for the bridge as BigNumber.
   */
  public async challengePeriod (): Promise<BigNumber> {
    const bridge = await this.getL1Bridge()

    return bridge.challengePeriod()
  }

  /**
   * @readonly
   * @desc The size of the time slots.
   * @returns {Object} The size of the time slots for the bridge as BigNumber.
   */
  public async timeSlotSize (): Promise<BigNumber> {
    const bridge = await this.getL1Bridge()

    return bridge.TIME_SLOT_SIZE()
  }

  /**
   * @readonly
   * @desc The amount bonded for a time slot for a bonder.
   * @param {Object} chain - Chain model.
   * @param {Number} timeSlot - Time slot to get.
   * @param {String} bonder - Address of the bonder to check.
   * @returns {Object} Amount bonded for the bonder for the given time slot as BigNumber.
   */
  public async timeSlotToAmountBonded (
    timeSlot: TTimeSlot,
    bonder: string
  ): Promise<BigNumber> {
    const bridge = await this.getL1Bridge()
    timeSlot = BigNumber.from(timeSlot.toString())

    return bridge.timeSlotToAmountBonded(timeSlot, bonder)
  }

  private async getTokenIndexes (path: string[], chain: TChain) {
    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    const tokenIndexFrom = Number(
      (await saddleSwap.getTokenIndex(path[0])).toString()
    )
    const tokenIndexTo = Number(
      (await saddleSwap.getTokenIndex(path[1])).toString()
    )

    return [tokenIndexFrom, tokenIndexTo]
  }

  private async populateSendL1ToL2Tx (input: SendL1ToL2Input) {
    let {
      destinationChain,
      sourceChain,
      relayer,
      relayerFee,
      amount,
      amountOutMin,
      deadline,
      recipient,
      checkAllowance
    } = input
    if (!sourceChain.isL1) {
      // ToDo: Don't pass in sourceChain since it will always be L1
      throw new Error('sourceChain must be L1')
    }
    const destinationChainId = destinationChain.chainId
    deadline = deadline === undefined ? this.defaultDeadlineSeconds : deadline
    amountOutMin = BigNumber.from((amountOutMin || 0).toString())
    recipient = recipient || await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient is required')
    }
    recipient = checksumAddress(recipient)

    const isNativeToken = this.isNativeToken(sourceChain)
    let l1Bridge = await this.getL1Bridge(sourceChain.provider)

    if (checkAllowance) {
      this.checkConnectedChain(this.signer, sourceChain)
      l1Bridge = await this.getL1Bridge(this.signer)
      if (!isNativeToken) {
        const l1Token = this.getL1Token()
        const allowance = await l1Token.allowance(l1Bridge.address)
        if (allowance.lt(BigNumber.from(amount))) {
          throw new Error(Errors.NotEnoughAllowance)
        }
      }
    }

    if (amountOutMin.lt(0)) {
      amountOutMin = BigNumber.from(0)
    }

    const txOptions = [
      destinationChainId,
      recipient,
      amount || 0,
      amountOutMin,
      deadline,
      relayer,
      relayerFee || 0,
      {
        ...(await this.txOverrides(Chain.Ethereum)),
        value: isNativeToken ? amount : undefined
      }
    ] as const

    return l1Bridge.populateTransaction.sendToL2(
      ...txOptions
    )
  }

  private async populateSendL2ToL1Tx (input: SendL2ToL1Input) {
    let {
      destinationChain,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee,
      recipient,
      amountOutMin,
      deadline,
      destinationDeadline,
      checkAllowance
    } = input
    const destinationChainId = destinationChain.chainId
    deadline = deadline === undefined ? this.defaultDeadlineSeconds : deadline
    amountOutMin = BigNumber.from((amountOutMin || 0).toString())
    destinationDeadline = destinationDeadline || 0
    destinationAmountOutMin = BigNumber.from(
      (destinationAmountOutMin || 0).toString()
    )

    if (destinationChain.isL1) {
      const attemptSwap = this.shouldAttemptSwap(destinationAmountOutMin, destinationDeadline)
      if (attemptSwap) {
        throw new Error('"destinationAmountOutMin" and "destinationDeadline" must be 0 when sending to an L1')
      }
    }

    recipient = recipient || await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient is required')
    }
    recipient = checksumAddress(recipient)

    let ammWrapper = await this.getAmmWrapper(sourceChain, sourceChain.provider)
    let l2Bridge = await this.getL2Bridge(sourceChain, sourceChain.provider)
    const attemptSwapAtSource = this.shouldAttemptSwap(amountOutMin, deadline)
    const spender = attemptSwapAtSource ? ammWrapper.address : l2Bridge.address

    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. amount: ${amount.toString()}, bonderFee: ${bonderFee.toString()}`)
    }

    const isNativeToken = this.isNativeToken(sourceChain)

    if (checkAllowance) {
      this.checkConnectedChain(this.signer, sourceChain)
      ammWrapper = await this.getAmmWrapper(sourceChain, this.signer)
      l2Bridge = await this.getL2Bridge(sourceChain, this.signer)
      if (!isNativeToken) {
        const l2CanonicalToken = this.getCanonicalToken(sourceChain)
        const allowance = await l2CanonicalToken.allowance(spender)
        if (allowance.lt(BigNumber.from(amount))) {
          throw new Error(Errors.NotEnoughAllowance)
        }
      }
    }

    if (amountOutMin.lt(0)) {
      amountOutMin = BigNumber.from(0)
    }

    if (destinationAmountOutMin.lt(0)) {
      destinationAmountOutMin = BigNumber.from(0)
    }

    const txOptions = [
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline
    ] as const

    if (attemptSwapAtSource) {
      const additionalOptions = [
        destinationAmountOutMin,
        destinationDeadline,
        {
          ...(await this.txOverrides(sourceChain)),
          value: isNativeToken ? amount : undefined
        }
      ] as const

      return ammWrapper.populateTransaction.swapAndSend(
        ...txOptions,
        ...additionalOptions
      )
    }

    return l2Bridge.populateTransaction.send(
      ...txOptions,
      {
        ...(await this.txOverrides(sourceChain)),
        value: isNativeToken ? amount : undefined
      }
    )
  }

  private async populateSendL2ToL2Tx (input: SendL2ToL2Input) {
    let {
      destinationChain,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee,
      deadline,
      destinationDeadline,
      amountOutMin,
      recipient,
      checkAllowance
    } = input
    const destinationChainId = destinationChain.chainId
    deadline = deadline || this.defaultDeadlineSeconds
    destinationDeadline = destinationDeadline || this.defaultDeadlineSeconds
    amountOutMin = BigNumber.from((amountOutMin || 0).toString())
    destinationAmountOutMin = BigNumber.from(
      (destinationAmountOutMin || 0).toString()
    )
    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('Amount must be greater than bonder fee')
    }

    recipient = recipient || await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient is required')
    }
    recipient = checksumAddress(recipient)

    let ammWrapper = await this.getAmmWrapper(sourceChain, sourceChain.provider)
    const isNativeToken = this.isNativeToken(sourceChain)

    if (checkAllowance) {
      this.checkConnectedChain(this.signer, sourceChain)
      ammWrapper = await this.getAmmWrapper(sourceChain, this.signer)
      if (!isNativeToken) {
        const l2CanonicalToken = this.getCanonicalToken(sourceChain)
        const allowance = await l2CanonicalToken.allowance(ammWrapper.address)
        if (allowance.lt(BigNumber.from(amount))) {
          throw new Error(Errors.NotEnoughAllowance)
        }
      }
    }

    if (amountOutMin.lt(0)) {
      amountOutMin = BigNumber.from(0)
    }

    if (destinationAmountOutMin.lt(0)) {
      destinationAmountOutMin = BigNumber.from(0)
    }

    const txOptions = [
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      {
        ...(await this.txOverrides(sourceChain)),
        value: isNativeToken ? amount : undefined
      }
    ] as const

    return ammWrapper.populateTransaction.swapAndSend(...txOptions)
  }

  private async calcToHTokenAmount (
    amount: TAmount,
    chain: Chain
  ): Promise<BigNumber> {
    amount = BigNumber.from(amount.toString())
    if (chain.isL1) {
      return amount
    }

    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    if (amount.eq(0)) {
      return BigNumber.from(0)
    }

    const amountOut = await saddleSwap.calculateSwap(
      TokenIndex.CanonicalToken,
      TokenIndex.HopBridgeToken,
      amount
    )

    return amountOut
  }

  private async calcFromHTokenAmount (
    amount: TAmount,
    chain: Chain
  ): Promise<BigNumber> {
    amount = BigNumber.from(amount.toString())
    if (chain.isL1) {
      return BigNumber.from(amount)
    }

    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    if (amount.eq(0)) {
      return BigNumber.from(0)
    }
    const amountOut = await saddleSwap.calculateSwap(
      TokenIndex.HopBridgeToken,
      TokenIndex.CanonicalToken,
      amount
    )

    return amountOut
  }

  private async getBonderFeeRelative (
    amountIn: TAmount,
    sourceChain: TChain,
    destinationChain: TChain
  ) {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (sourceChain.isL1) {
      return BigNumber.from(0)
    }

    const hTokenAmount = await this.calcToHTokenAmount(
      amountIn.toString(),
      sourceChain
    )

    const feeBps = this.getFeeBps(this.tokenSymbol, destinationChain)
    const bonderFeeRelative = hTokenAmount.mul(feeBps).div(10000)
    return bonderFeeRelative
  }

  private async getBonderFeeAbsolute (): Promise<BigNumber> {
    const token = this.toTokenModel(this.tokenSymbol)
    const tokenPrice = await this.priceFeed.getPriceByTokenSymbol(token.symbol)
    const minBonderFeeUsd = 0.25
    const bonderFeeAbsolute = parseUnits(
      (minBonderFeeUsd / tokenPrice).toFixed(token.decimals),
      token.decimals
    )
    return bonderFeeAbsolute
  }

  private getRate (
    amountIn: BigNumber,
    amountOut: BigNumber,
    sourceToken: Token,
    destToken: Token
  ) {
    let rateBN
    if (amountIn.eq(0)) {
      rateBN = BigNumber.from(0)
    } else {
      const oneSourceBN = ethers.utils.parseUnits('1', sourceToken.decimals)

      rateBN = amountOut.mul(oneSourceBN).div(amountIn)
    }

    const rate = Number(ethers.utils.formatUnits(rateBN, destToken.decimals))

    return rate
  }

  private getPriceImpact (rate: number, marketRate: number) {
    return ((marketRate - rate) / marketRate) * 100
  }

  private async checkConnectedChain (signer: TProvider, chain: Chain) {
    const connectedChainId = await (signer as Signer)?.getChainId()
    if (connectedChainId !== chain.chainId) {
      throw new Error('invalid connected chain ID. Make sure signer provider is connected to source chain network')
    }
  }

  // Gnosis AMB bridge
  async getAmbBridge (chain: TChain) {
    chain = this.toChainModel(chain)
    if (chain.equals(Chain.Ethereum)) {
      const address = this.getL1AmbBridgeAddress(this.tokenSymbol, Chain.Gnosis)
      const provider = await this.getSignerOrProvider(Chain.Ethereum)
      return L1HomeAMBNativeToErc20__factory.connect(address, provider)
    }
    const address = this.getL2AmbBridgeAddress(this.tokenSymbol, Chain.Gnosis)
    const provider = await this.getSignerOrProvider(Chain.Gnosis)
    return L1HomeAMBNativeToErc20__factory.connect(address, provider)
  }

  getChainNativeToken (chain: TChain) {
    chain = this.toChainModel(chain)
    if (chain?.equals(Chain.Polygon)) {
      return this.toTokenModel(CanonicalToken.MATIC)
    } else if (chain?.equals(Chain.Gnosis)) {
      return this.toTokenModel(CanonicalToken.DAI)
    }

    return this.toTokenModel(CanonicalToken.ETH)
  }

  isNativeToken (chain?: TChain) {
    const token = this.getCanonicalToken(chain || this.sourceChain)
    return token.isNativeToken
  }

  async getEthBalance (chain: TChain = this.sourceChain, address?: string) {
    chain = this.toChainModel(chain)
    address = address ?? await this.getSignerAddress()
    if (!address) {
      throw new Error('address is required')
    }
    return chain.provider.getBalance(address)
  }

  isSupportedAsset (chain: TChain) {
    chain = this.toChainModel(chain)
    const supported = this.getSupportedAssets()
    return !!supported[chain.slug]?.[this.tokenSymbol]
  }

  getBonderAddress (sourceChain: TChain, destinationChain: TChain): string {
    return this._getBonderAddress(this.tokenSymbol, sourceChain, destinationChain)
  }

  shouldAttemptSwap (amountOutMin: BigNumber, deadline: BigNumberish): boolean {
    deadline = BigNumber.from(deadline?.toString() || 0)
    return amountOutMin?.gt(0) || deadline?.gt(0)
  }

  private async getGasEstimateFromAddress (sourceChain: TChain, destinationChain: TChain) {
    let address = await this.getSignerAddress()
    if (!address) {
      address = await this.getBonderAddress(sourceChain, destinationChain)
    }
    return address
  }
}

export default HopBridge
