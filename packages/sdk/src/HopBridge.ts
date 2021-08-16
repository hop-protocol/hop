import { ethers, Signer, Contract, BigNumber, BigNumberish } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import Chain from './models/Chain'
import TokenModel from './models/Token'
import {
  l1Erc20BridgeAbi,
  l2BridgeAbi,
  saddleLpTokenAbi,
  swapAbi as saddleSwapAbi,
  l1HomeAmbNativeToErc20,
  l2AmmWrapperAbi,
  wethAbi
} from '@hop-protocol/core/abi'
import { TChain, TToken, TAmount, TProvider } from './types'
import Base from './Base'
import AMM from './AMM'
import _version from './version'
import { TokenIndex, BondTransferGasCost, LpFee } from './constants'
import { metadata } from './config'
import CoinGecko from './CoinGecko'
import Token from './Token'

type SendL1ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  relayer?: string
  relayerFee?: TAmount
  amount: TAmount
  amountOutMin?: TAmount
  deadline?: number
  recipient?: string
  approval?: boolean
}

type SendL2ToL1Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: TAmount
  amountOutMin: TAmount
  destinationAmountOutMin?: TAmount
  deadline?: number
  destinationDeadline?: number
  bonderFee?: TAmount
  recipient?: string
  approval?: boolean
}

type SendL2ToL2Input = {
  destinationChainId: number | string
  sourceChain: Chain
  amount: number | string
  amountOutMin: TAmount
  destinationAmountOutMin?: TAmount
  bonderFee?: TAmount
  deadline?: number
  destinationDeadline?: number
  recipient?: string
  approval?: boolean
}

type SendOptions = {
  deadline: number
  relayer: string
  relayerFee: TAmount
  recipient: string
  amountOutMin: TAmount
  bonderFee: TAmount
  destinationAmountOutMin: TAmount
  destinationDeadline: number
}

type AddLiquidityOptions = {
  minToMint: TAmount
  deadline: number
}

type RemoveLiquidityOptions = {
  amount0Min: TAmount
  amount1Min: TAmount
  deadline: number
}

/**
 * Class reprensenting Hop bridge.
 * @namespace HopBridge
 */
class HopBridge extends Base {
  private tokenSymbol: string

  /** Source Chain model */
  public sourceChain: Chain

  /** Destination Chain model */
  public destinationChain: Chain

  /** Default deadline for transfers */
  public defaultDeadlineMinutes = 30

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
   *const bridge = new HopBridge('kovan', signer, Token.USDC, Chain.Optimism, Chain.xDai)
   *```
   */
  constructor (network: string, signer: TProvider, token: TToken) {
    super(network, signer)

    if (token instanceof Token || token instanceof TokenModel) {
      this.tokenSymbol = token.symbol
    } else if (typeof token === 'string') {
      this.tokenSymbol = token
    }
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
    return new HopBridge(this.network, signer, this.tokenSymbol)
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
  ): Token | undefined {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    const { name, symbol, decimals, image } = metadata.tokens[network][
      token.canonicalSymbol
    ]

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
      symbol,
      name,
      image,
      this.signer
    )
  }

  public toHopToken (
    token: TToken,
    network: string,
    chain: TChain
  ): Token | undefined {
    chain = this.toChainModel(chain)
    if (chain.isL1) {
      throw new Error('Hop tokens do not exist on layer 1')
    }

    let tokenSymbol
    if (typeof token === 'string') {
      tokenSymbol = token
    } else {
      tokenSymbol = token.symbol
    }
    const { name, symbol, decimals, image } = metadata.tokens[network][
      tokenSymbol
    ]
    const address = this.getL2HopBridgeTokenAddress(tokenSymbol, chain)

    return new Token(
      network,
      chain,
      address,
      decimals,
      `h${symbol}`,
      `Hop ${name}`,
      image,
      this.signer
    )
  }

  /**
   * @desc Approve and send tokens to another chain. This will make an approval
   * transaction if not enough allowance.
   * @param {String} tokenAmount - Token amount to send denominated in smallest unit.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Ethers Transaction object.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge(Token.USDC)
   *\// send 1 USDC token from Optimism -> xDai
   *const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.xDai)
   *console.log(tx.hash)
   *```
   */
  public async approveAndSend (
    tokenAmount: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain,
    options?: Partial<SendOptions>
  ) {
    // ToDo: Add approval
    return this.sendHandler(
      tokenAmount.toString(),
      sourceChain,
      destinationChain,
      true,
      options
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
   *\// send 1 USDC token from Optimism -> xDai
   *const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.xDai)
   *console.log(tx.hash)
   *```
   */
  public async send (
    tokenAmount: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain,
    options?: Partial<SendOptions>
  ) {
    tokenAmount = tokenAmount.toString()
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

    return this.sendHandler(
      tokenAmount.toString(),
      sourceChain,
      destinationChain,
      false,
      options
    )
  }

  // ToDo: Docs
  public getSendApprovalAddress (
    sourceChain: TChain,
    destinationChain: TChain,
    isHTokenTransfer: boolean = false
  ) {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
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

  // ToDo: Docs
  public async sendHToken (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options?: Partial<SendOptions>
  ) {
    tokenAmount = tokenAmount.toString()
    if (!sourceChain) {
      throw new Error('source chain is required')
    }
    if (!destinationChain) {
      throw new Error('destination chain is required')
    }

    return this.sendHTokenHandler(
      tokenAmount.toString(),
      sourceChain,
      destinationChain,
      options
    )
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
    sourceChain?: TChain,
    destinationChain?: TChain
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

    const bonderFeePromise = this.getBonderFee(
      amountIn,
      sourceChain,
      destinationChain
    )

    const [
      amountOutWithoutFee,
      amountOutNoSlippage,
      bonderFee
    ] = await Promise.all([
      amountOutWithoutFeePromise,
      amountOutNoSlippagePromise,
      bonderFeePromise
    ])

    let afterBonderFee
    if (hTokenAmount.gt(bonderFee)) {
      afterBonderFee = hTokenAmount.sub(bonderFee)
    } else {
      afterBonderFee = BigNumber.from(0)
    }
    const amountOut = await this.calcFromHTokenAmount(
      afterBonderFee,
      destinationChain
    )

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
    const l1Fee = await this.getL1TransactionFee(sourceChain, destinationChain)
    let estimatedReceived = amountOut
    if (l1Fee) {
      estimatedReceived = estimatedReceived.sub(l1Fee)
    }

    return {
      amountOut,
      rate,
      priceImpact,
      requiredLiquidity: hTokenAmount,
      bonderFee,
      lpFees,
      l1Fee,
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

    const lpFeeBN = parseUnits(LpFee, destToken.decimals)
    const lpFeeAmount = amountIn.mul(lpFeeBN).div(oneDestBN)

    return {
      rate,
      priceImpact,
      amountOutMin,
      lpFeeAmount
    }
  }

  public async getBonderFee (
    amountIn: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (!destinationChain.isL1) {
      return this.getMinBonderFee(
        amountIn.toString(),
        sourceChain,
        destinationChain
      )
    } else {
      return BigNumber.from(0)
    }
  }

  public async getLpFees (
    amountIn: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    let lpFeeBps = 0
    if (!sourceChain.isL1) {
      lpFeeBps += 4
    }
    if (!destinationChain.isL1) {
      lpFeeBps += 4
    }

    amountIn = BigNumber.from(amountIn)
    let lpFees = amountIn.mul(lpFeeBps).div(10000)

    return lpFees
  }

  public async getL1TransactionFee (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber | undefined> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (destinationChain && destinationChain.isL1) {
      const canonicalToken = this.getCanonicalToken(sourceChain)
      const ethPrice = await CoinGecko.getPriceByTokenSymbol('WETH')
      const tokenPrice = await CoinGecko.getPriceByTokenSymbol(
        canonicalToken.symbol
      )

      const rate = ethPrice / tokenPrice

      const gasPrice = await destinationChain.provider.getGasPrice()
      const txFeeEth = gasPrice.mul(BondTransferGasCost)

      const oneEth = ethers.utils.parseEther('1')
      const rateBN = ethers.utils.parseUnits(
        rate.toFixed(canonicalToken.decimals),
        canonicalToken.decimals
      )
      let fee = txFeeEth.mul(rateBN).div(oneEth)

      const multiplier = ethers.utils.parseEther('1.5')
      fee = fee.mul(multiplier).div(oneEth)

      return fee
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
   *const amountOut = await bridge.getAmountOut('1000000000000000000', Chain.Optimism, Chain.xDai)
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
   *const requiredLiquidity = await bridge.getRequiredLiquidity('1000000000000000000', Chain.Optimism, Chain.xDai)
   *console.log(requiredLiquidity)
   *```
   */
  public async getRequiredLiquidity (
    tokenAmountIn: TAmount,
    sourceChain?: TChain
  ): Promise<BigNumber> {
    tokenAmountIn = BigNumber.from(tokenAmountIn.toString())
    sourceChain = this.toChainModel(sourceChain)

    const hTokenAmount = await this.calcToHTokenAmount(
      tokenAmountIn,
      sourceChain
    )

    return hTokenAmount
  }

  /**
   * @desc Returns the suggested bonder fee.
   * @param {Object} amountIn - Token amount input.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Bonder fee as BigNumber.
   */
  public async getMinBonderFee (
    amountIn: TAmount,
    sourceChain: TChain,
    destinationChain: TChain
  ) {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (sourceChain.isL1) {
      return BigNumber.from('0')
    }

    const hTokenAmount = await this.calcToHTokenAmount(
      amountIn.toString(),
      sourceChain
    )
    const l2Bridge = await this.getL2Bridge(sourceChain, this.signer)
    const minBonderBps = await l2Bridge?.minBonderBps()
    const minBonderFeeAbsolute = await l2Bridge?.minBonderFeeAbsolute()
    const minBonderFeeRelative = hTokenAmount.mul(minBonderBps).div(10000)
    const minBonderFee = minBonderFeeRelative.gt(minBonderFeeAbsolute)
      ? minBonderFeeRelative
      : minBonderFeeAbsolute
    return minBonderFee
  }

  /**
   * @desc Returns available liquidity for Hop bridge at specified chain.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} Available liquidity as BigNumber.
   */
  public async getAvailableLiquidity (
    destinationChain: TChain,
    bonder: string = this.getBonderAddress(this.tokenSymbol)
  ): Promise<BigNumber> {
    const chain = this.toChainModel(destinationChain)
    const [credit, debit] = await Promise.all([
      this.getCredit(chain, bonder),
      this.getDebit(chain, bonder)
    ])

    if (credit.lt(debit)) {
      return BigNumber.from('0')
    } else {
      return credit.sub(debit)
    }
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
    chain: TChain,
    bonder: string = this.getBonderAddress(this.tokenSymbol)
  ): Promise<BigNumber> {
    chain = this.toChainModel(chain)
    const bridge = await this.getBridgeContract(chain)

    return bridge.getCredit(bonder)
  }

  /**
   * @desc Returns total debit that bonder holds on Hop bridge at specified chain.
   * @param {Object} chain - Chain model.
   * @returns {Object} Total debit as BigNumber.
   */
  public async getDebit (
    chain: TChain,
    bonder: string = this.getBonderAddress(this.tokenSymbol)
  ): Promise<BigNumber> {
    chain = this.toChainModel(chain)
    const bridge = await this.getBridgeContract(chain)

    return bridge.getDebitAndAdditionalDebit(bonder)
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
    deadline: number
  ) {
    sourceChain = this.toChainModel(sourceChain)
    let tokenIndexFrom: number
    let tokenIndexTo: number

    let l2CanonicalTokenAddress = this.getL2CanonicalTokenAddress(
      this.tokenSymbol,
      sourceChain
    )
    if (!l2CanonicalTokenAddress) {
      throw new Error(`source chain "${sourceChain.slug}" is unsupported`)
    }
    let l2HopBridgeTokenAddress = this.getL2HopBridgeTokenAddress(
      this.tokenSymbol,
      sourceChain
    )
    if (!l2HopBridgeTokenAddress) {
      throw new Error(`source chain "${sourceChain.slug}" is unsupported`)
    }

    const amm = await this.getAmm(sourceChain)
    const saddleSwap = await amm.getSaddleSwap()
    let canonicalTokenIndex = Number(
      (await saddleSwap.getTokenIndex(l2CanonicalTokenAddress)).toString()
    )
    let hopTokenIndex = Number(
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
    return this.getContract(bridgeAddress, l1Erc20BridgeAbi, provider)
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
    return this.getContract(bridgeAddress, l2BridgeAbi, provider)
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
    return this.getContract(ammWrapperAddress, l2AmmWrapperAbi, provider)
  }

  /**
   * @desc Returns Hop Bridge Saddle reserve amounts.
   * @param {Object} chain - Chain model.
   * @returns {Array} Array containing reserve amounts for canonical token
   * and hTokens.
   */
  public async getSaddleSwapReserves (chain: TChain) {
    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    return Promise.all([
      saddleSwap.getTokenBalance(0),
      saddleSwap.getTokenBalance(1)
    ])
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
      `${this.tokenSymbol} LP`,
      `${this.tokenSymbol} LP`,
      '',
      signer
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

    const amm = new AMM(this.network, this.tokenSymbol, chain, this.signer)
    return amm.addLiquidity(
      amount0Desired,
      amount1Desired,
      options.minToMint,
      options.deadline
    )
  }

  /**
   * @desc Sends transaction to remove liquidity from AMM.
   * @param {Object} liqudityTokenAmount - Amount of LP tokens to burn.
   * @param {Object} chain - Chain model of desired chain to add liquidity to.
   * @param {Object} options - Method options.
   * @returns {Object} Ethers transaction object.
   */
  public async removeLiquidity (
    liqudityTokenAmount: TAmount,
    chain?: TChain,
    options: Partial<RemoveLiquidityOptions> = {}
  ) {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM(this.network, this.tokenSymbol, chain, this.signer)
    return amm.removeLiquidity(
      liqudityTokenAmount,
      options.amount0Min,
      options.amount1Min,
      options.deadline
    )
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
    return (Date.now() / 1000 + this.defaultDeadlineMinutes * 60) | 0
  }

  private async getTokenIndexes (path: string[], chain: TChain) {
    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    let tokenIndexFrom = Number(
      (await saddleSwap.getTokenIndex(path[0])).toString()
    )
    let tokenIndexTo = Number(
      (await saddleSwap.getTokenIndex(path[1])).toString()
    )

    return [tokenIndexFrom, tokenIndexTo]
  }

  private async sendHandler (
    tokenAmount: string,
    sourceChain: TChain,
    destinationChain: TChain,
    approval: boolean = false,
    options: Partial<SendOptions> = {}
  ) {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    let balance: BigNumber
    const canonicalToken = this.getCanonicalToken(sourceChain)
    if (this.isNativeToken(sourceChain)) {
      balance = await canonicalToken.getNativeTokenBalance()
    } else {
      balance = await canonicalToken.balanceOf()
    }
    if (balance.lt(BigNumber.from(tokenAmount))) {
      throw new Error('not enough token balance')
    }

    // L1 -> L1 or L2
    if (sourceChain.isL1) {
      // L1 -> L1
      if (destinationChain.isL1) {
        throw new Error('Cannot send from layer 1 to layer 1')
      }
      // L1 -> L2
      return this.sendL1ToL2({
        destinationChainId: destinationChain.chainId,
        sourceChain,
        relayer: options?.relayer ?? ethers.constants.AddressZero,
        relayerFee: options?.relayerFee ?? 0,
        amount: tokenAmount,
        amountOutMin: options?.amountOutMin ?? 0,
        deadline: options?.deadline,
        recipient: options?.recipient,
        approval
      })
    }
    // else:
    // L2 -> L1 or L2

    // L2 -> L1
    if (destinationChain.isL1) {
      let bonderFee = options?.bonderFee
      if (!bonderFee) {
        bonderFee = await this.getBonderFee(
          tokenAmount,
          sourceChain,
          destinationChain
        )
      }
      return this.sendL2ToL1({
        destinationChainId: destinationChain.chainId,
        sourceChain,
        amount: tokenAmount,
        bonderFee,
        recipient: options?.recipient,
        amountOutMin: options?.amountOutMin,
        deadline: options?.deadline,
        destinationAmountOutMin: options?.destinationAmountOutMin,
        destinationDeadline: options?.destinationDeadline,
        approval
      })
    }

    // L2 -> L2
    let bonderFee = options?.bonderFee
    if (!bonderFee) {
      bonderFee = await this.getBonderFee(
        tokenAmount,
        sourceChain,
        destinationChain
      )
    }
    return this.sendL2ToL2({
      destinationChainId: destinationChain.chainId,
      sourceChain,
      amount: tokenAmount,
      bonderFee,
      recipient: options?.recipient,
      amountOutMin: options?.amountOutMin,
      deadline: options?.deadline,
      destinationAmountOutMin: options?.destinationAmountOutMin,
      destinationDeadline: options?.destinationDeadline,
      approval
    })
  }

  private async sendL1ToL2 (input: SendL1ToL2Input) {
    let {
      destinationChainId,
      sourceChain,
      relayer,
      relayerFee,
      amount,
      amountOutMin,
      deadline,
      recipient,
      approval
    } = input
    if (!sourceChain.isL1) {
      // ToDo: Don't pass in sourceChain since it will always be L1
      throw new Error('sourceChain must be L1 when calling sendL1ToL2')
    }
    deadline = deadline === undefined ? this.defaultDeadlineSeconds : deadline
    recipient = recipient || (await this.getSignerAddress())
    this.checkConnectedChain(this.signer, sourceChain)
    const l1Bridge = await this.getL1Bridge(this.signer)

    const isNativeToken = this.isNativeToken(sourceChain)

    if (!isNativeToken) {
      const l1Token = this.getL1Token()
      if (approval) {
        const tx = await l1Token.approve(l1Bridge.address, amount)
        await tx?.wait()
      } else {
        const allowance = await l1Token.allowance(l1Bridge.address)
        if (allowance.lt(BigNumber.from(amount))) {
          throw new Error('not enough allowance')
        }
      }
    }

    return l1Bridge.sendToL2(
      destinationChainId,
      recipient,
      amount || 0,
      amountOutMin || 0,
      deadline,
      relayer,
      relayerFee || 0,
      {
        ...(await this.txOverrides(Chain.Ethereum)),
        value: isNativeToken ? amount : undefined
      }
    )
  }

  private async sendL2ToL1 (input: SendL2ToL1Input) {
    let {
      destinationChainId,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee,
      recipient,
      amountOutMin,
      deadline,
      destinationDeadline,
      approval
    } = input
    deadline = deadline === undefined ? this.defaultDeadlineSeconds : deadline
    destinationDeadline = destinationDeadline || 0
    amountOutMin = amountOutMin || 0
    destinationAmountOutMin = destinationAmountOutMin || 0
    recipient = recipient || (await this.getSignerAddress())
    this.checkConnectedChain(this.signer, sourceChain)
    const ammWrapper = await this.getAmmWrapper(sourceChain, this.signer)
    const l2Bridge = await this.getL2Bridge(sourceChain, this.signer)
    const attemptSwap = deadline || destinationDeadline
    const spender = attemptSwap ? ammWrapper.address : l2Bridge.address

    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('amount must be greater than bonder fee')
    }

    const isNativeToken = this.isNativeToken(sourceChain)

    if (!isNativeToken) {
      const l2CanonicalToken = this.getCanonicalToken(sourceChain)
      if (approval) {
        const tx = await l2CanonicalToken.approve(spender, amount)
        await tx?.wait()
      } else {
        const allowance = await l2CanonicalToken.allowance(spender)
        if (allowance.lt(BigNumber.from(amount))) {
          throw new Error('not enough allowance')
        }
      }
    }

    if (attemptSwap) {
      return ammWrapper.swapAndSend(
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
      )
    }

    return l2Bridge.send(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline
    )
  }

  private async sendL2ToL2 (input: SendL2ToL2Input) {
    let {
      destinationChainId,
      sourceChain,
      amount,
      destinationAmountOutMin,
      bonderFee,
      deadline,
      destinationDeadline,
      amountOutMin,
      recipient,
      approval
    } = input
    deadline = deadline || this.defaultDeadlineSeconds
    destinationDeadline = destinationDeadline || deadline
    amountOutMin = amountOutMin || 0
    recipient = recipient || (await this.getSignerAddress())
    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('Amount must be greater than bonder fee')
    }

    this.checkConnectedChain(this.signer, sourceChain)
    const ammWrapper = await this.getAmmWrapper(sourceChain, this.signer)

    const isNativeToken = this.isNativeToken(sourceChain)

    if (!isNativeToken) {
      const l2CanonicalToken = this.getCanonicalToken(sourceChain)
      if (approval) {
        const tx = await l2CanonicalToken.approve(ammWrapper.address, amount)
        await tx?.wait()
      } else {
        const allowance = await l2CanonicalToken.allowance(ammWrapper.address)
        if (allowance.lt(BigNumber.from(amount))) {
          throw new Error('not enough allowance')
        }
      }
    }

    return ammWrapper.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin || 0,
      destinationDeadline,
      {
        ...(await this.txOverrides(sourceChain)),
        value: isNativeToken ? amount : undefined
      }
    )
  }

  private async sendHTokenHandler (
    tokenAmount: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain,
    options?: Partial<SendOptions>
  ) {
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
      throw new Error('Invalid sendHTokenHandler option')
    }

    let minBonderFee = BigNumber.from(0)
    if (!sourceChain.isL1) {
      minBonderFee = await this.getBonderFee(
        tokenAmount,
        sourceChain,
        destinationChain
      )
    }

    const recipient = options?.recipient ?? (await this.getSignerAddress())
    const bonderFee = options?.bonderFee
      ? BigNumber.from(options?.bonderFee)
      : minBonderFee
    const amountOutMin = BigNumber.from(0)
    const deadline = BigNumber.from(0)
    const relayer = ethers.constants.AddressZero

    if (sourceChain.isL1) {
      if (bonderFee.gt(0)) {
        throw new Error('Bonder fee should be 0 when sending hToken to L2')
      }

      const l1Bridge = await this.getL1Bridge(this.signer)
      return l1Bridge.sendToL2(
        destinationChain.chainId,
        recipient,
        tokenAmount,
        amountOutMin,
        deadline,
        relayer,
        bonderFee,
        await this.txOverrides(Chain.Ethereum)
      )
    } else {
      if (bonderFee.eq(0)) {
        throw new Error('Send at least the minimum Bonder fee')
      }

      const l2Bridge = await this.getL2Bridge(sourceChain, this.signer)
      return l2Bridge.send(
        destinationChain.chainId,
        recipient,
        tokenAmount,
        bonderFee,
        amountOutMin,
        deadline,
        await this.txOverrides(sourceChain)
      )
    }
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
      throw new Error('invalid connected chain id')
    }
  }

  // xDai AMB bridge
  async getAmbBridge (chain: TChain) {
    chain = this.toChainModel(chain)
    if (chain.equals(Chain.Ethereum)) {
      const address = this.getL1AmbBridgeAddress(this.tokenSymbol, Chain.xDai)
      const provider = await this.getSignerOrProvider(Chain.Ethereum)
      return this.getContract(address, l1HomeAmbNativeToErc20, provider)
    }
    const address = this.getL2AmbBridgeAddress(this.tokenSymbol, Chain.xDai)
    const provider = await this.getSignerOrProvider(Chain.xDai)
    return this.getContract(address, l1HomeAmbNativeToErc20, provider)
  }

  isNativeToken (chain?: TChain) {
    const token = this.getCanonicalToken(chain || this.sourceChain)
    return token.isNativeToken
  }

  async getEthBalance (chain: TChain = this.sourceChain, address?: string) {
    chain = this.toChainModel(chain)
    const _address = address ?? (await this.getSignerAddress())
    return chain.provider.getBalance(_address)
  }
}

export default HopBridge
