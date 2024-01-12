import AMM from './AMM'
import Base, { BaseConstructorOptions, ChainProviders } from './Base'
import Chain from './models/Chain'
import Token from './Token'
import TokenModel from './models/Token'
import { L1_ERC20_Bridge__factory } from '@hop-protocol/core/contracts/factories/generated/L1_ERC20_Bridge__factory'
import { L1_HomeAMBNativeToErc20__factory } from '@hop-protocol/core/contracts/factories/static/L1_HomeAMBNativeToErc20__factory'
import { L2_AmmWrapper__factory } from '@hop-protocol/core/contracts/factories/generated/L2_AmmWrapper__factory'
import { L2_Bridge } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { L2_Bridge__factory } from '@hop-protocol/core/contracts/factories/generated/L2_Bridge__factory'
import { Multicall } from './Multicall'

import { ApiKeys, PriceFeedFromS3 } from './priceFeed'
import {
  BigNumber,
  BigNumberish,
  Signer,
  constants,
  ethers
} from 'ethers'
import {
  BondTransferGasLimit,
  CanonicalToken,
  ChainSlug,
  Errors,
  HToken,
  LowLiquidityTokenBufferAmountsUsd,
  LowLiquidityTokens,
  NetworkSlug,
  PendingAmountBufferUsd,
  SettlementGasLimitPerTx,
  TokenIndex,
  TokenSymbol
} from './constants'
import { TAmount, TChain, TProvider, TTime, TTimeSlot, TToken } from './types'
import { WithdrawalProof } from './utils/WithdrawalProof'
import { bondableChains, metadata } from './config'
import { getAddress as checksumAddress, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'

const s3FileCache : Record<string, any> = {}
let s3FileCacheTimestamp: number = 0
const cacheExpireMs = 1 * 60 * 1000

export type HopBridgeConstructorOptions = {
  token: TToken,
} & BaseConstructorOptions

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
  amountOutMin?: TAmount
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
  amountOutMin?: TAmount
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

  priceFeed: PriceFeedFromS3
  priceFeedApiKeys: ApiKeys | null = null
  doesUseAmm: boolean

  /**
   * @desc Instantiates Hop Bridge.
   * Returns a new Hop Bridge instance.
   * @param networkOrOptionsObject - L1 network name (e.g. 'mainnet', 'goerli')
   * @param signer - Ethers `Signer` for signing transactions.
   * @param token - Token symbol or model
   * @returns HopBridge SDK instance.
   * @example
   *```js
   *import { HopBridge, Chain, Token } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const bridge = new HopBridge('mainnet', signer, Token.USDC, Chain.Optimism, Chain.Gnosis)
   *```
   */
  constructor (
    networkOrOptionsObject: string | HopBridgeConstructorOptions,
    signer?: TProvider,
    token?: TToken,
    chainProviders?: ChainProviders
  ) {
    super(networkOrOptionsObject, signer, chainProviders)

    if (networkOrOptionsObject instanceof Object) {
      const options = networkOrOptionsObject
      if (signer ?? token ?? chainProviders) {
        throw new Error('expected only single options parameter')
      }
      token = options.token
    }

    if (token instanceof Token || token instanceof TokenModel) {
      this.tokenSymbol = token.symbol
    } else if (typeof token === 'string') {
      this.tokenSymbol = token
    }

    if (!token) {
      throw new Error('token is required')
    }

    this.priceFeed = new PriceFeedFromS3(this.priceFeedApiKeys!)
    this.doesUseAmm = this.tokenSymbol !== CanonicalToken.HOP
    if (this.network === NetworkSlug.Goerli) {
      const nonAmmAssets = this.getNonAmmAssets()
      this.doesUseAmm = !nonAmmAssets.has(this.tokenSymbol)
    }
  }

  /**
   * @desc Returns hop bridge instance with signer connected. Used for adding or changing signer.
   * @param signer - Ethers `Signer` for signing transactions.
   * @returns New HopBridge SDK instance with connected signer.
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
  public connect (signer: Signer): HopBridge {
    const hopBridge = new HopBridge({
      network: this.network,
      signer,
      token: this.tokenSymbol,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })

    // port over exiting properties
    if (this.priceFeedApiKeys) {
      hopBridge.setPriceFeedApiKeys(this.priceFeedApiKeys)
    }
    hopBridge.baseConfigUrl = this.baseConfigUrl
    hopBridge.configFileFetchEnabled = this.configFileFetchEnabled

    return hopBridge
  }

  public getL1Token (): any {
    return this.toCanonicalToken(this.tokenSymbol, this.network, Chain.Ethereum)
  }

  public getCanonicalToken (chain: TChain): any {
    return this.toCanonicalToken(this.tokenSymbol, this.network, chain)
  }

  public getL2HopToken (chain: TChain): any {
    return this.toHopToken(this.tokenSymbol, this.network, chain)
  }

  public toCanonicalToken (
    token: TToken,
    network: string,
    chain: TChain
  ): Token {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    const { name, decimals, image } = metadata.tokens[token.canonicalSymbol]
    let symbol = metadata.tokens[token.canonicalSymbol].symbol

    if (chain.equals(Chain.Gnosis) && token.symbol === CanonicalToken.DAI) {
      symbol = CanonicalToken.XDAI
    }

    let address
    if (chain.isL1) {
      address = this.getL1CanonicalTokenAddress(token.symbol, chain)
    } else {
      address = this.getL2CanonicalTokenAddress(token.symbol, chain)
    }

    return new Token({
      network,
      chain,
      address,
      decimals,
      symbol: symbol as never,
      name,
      image,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
  }

  public toHopToken (
    token: TToken,
    network: string,
    chain: TChain
  ): Token {
    chain = this.toChainModel(chain)
    token = this.toTokenModel(token)
    if (chain.isL1) {
      throw new Error('Hop tokens do not exist on layer 1')
    }

    const { name, decimals, image } = metadata.tokens[token.canonicalSymbol]
    const address = this.getL2HopBridgeTokenAddress(token.symbol, chain)

    let formattedSymbol = token.canonicalSymbol as HToken
    let formattedName = name
    if (this.doesUseAmm) {
      formattedSymbol = `h${formattedSymbol}` as HToken
      formattedName = `Hop ${formattedName}`
    }

    return new Token({
      network,
      chain,
      address,
      decimals,
      symbol: formattedSymbol,
      name: formattedName,
      image,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
  }

  /**
   * @desc Send tokens to another chain.
   * @param tokenAmount - Token amount to send denominated in smallest unit.
   * @param sourceChain - Source chain model.
   * @param destinationChain - Destination chain model.
   * @returns Ethers Transaction object.
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
  ): Promise<any> {
    if (!sourceChain) {
      throw new Error('sourceChain is required')
    }
    if (!destinationChain) {
      throw new Error('sourceChain is required')
    }
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

    const [availableLiquidity, requiredLiquidity] = await Promise.all([
      this.getFrontendAvailableLiquidity(
        sourceChain,
        destinationChain
      ),
      this.getRequiredLiquidity(tokenAmount, sourceChain)
    ])

    const isAvailable = availableLiquidity.gte(requiredLiquidity)
    if (!isAvailable) {
      throw new Error('Insufficient liquidity available by bonder. Try again in a few minutes')
    }

    await this.checkConnectedChain(this.signer, sourceChain)

    const recipient = options?.recipient ?? await this.getSignerAddress()
    const willFail = await this.willTransferFail(sourceChain, destinationChain, recipient!)
    if (willFail) {
      throw new Error('Transfer will fail at the destination. Make sure recipient can receive asset.')
    }

    return this.sendTransaction(populatedTx, sourceChain)
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
      const [bonderAddress, relayerFee] = await Promise.all([
        this.getBonderAddress(sourceChain, destinationChain),
        options?.relayerFee ? Promise.resolve(options.relayerFee) : this.getTotalFee(tokenAmount, sourceChain, destinationChain)
      ])
      return this.populateSendL1ToL2Tx({
        destinationChain: destinationChain,
        sourceChain,
        relayer: options?.relayer ?? bonderAddress,
        relayerFee,
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
  ): Promise<BigNumber> {
    const populatedTx = await this.populateSendTx(tokenAmount, sourceChain, destinationChain, options)
    return this.getEstimatedGasLimit(sourceChain, destinationChain, populatedTx)
  }

  private async getEstimatedGasLimit (
    sourceChain: TChain,
    destinationChain: TChain,
    populatedTx: any
  ) : Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    if (!populatedTx.from) {
      // a `from` address is required if using only provider (not signer)
      populatedTx.from = await this.getGasEstimateFromAddress(sourceChain, destinationChain)
    }
    const provider = await this.getSignerOrProvider(sourceChain)
    try {
      return await this.estimateGas(provider, populatedTx)
    } catch (err: any) {
      console.warn('hop sdk getEstimatedGasLimit error estimating gas limit. trying fixed gasLimit for estimateGas')
      return this.estimateGas(provider, {
        ...populatedTx,
        gasLimit: sourceChain.equals(Chain.Arbitrum) ? 1_000_000 : 500_000
      })
    }
  }

  public async getSendEstimatedGasCost (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ) : Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    const populatedTx = await this.populateSendTx(tokenAmount, sourceChain, destinationChain, options)
    const [estimatedGasLimit, gasPrice] = await Promise.all([
      this.getEstimatedGasLimit(sourceChain, destinationChain, populatedTx),
      this.getGasPrice(sourceChain.provider!)
    ])
    return gasPrice.mul(estimatedGasLimit)
  }

  public getSendApprovalAddress (
    sourceChain: TChain,
    isHTokenTransfer: boolean = false,
    destinationChain?: TChain // this param was later added hence it's after the boolean param for backward compatibility
  ) : string {
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

    let approvalAddress: string
    if (isHTokenTransfer || !this.doesUseAmm) {
      approvalAddress = l2BridgeAddress
    } else {
      approvalAddress = ammWrapperAddress
    }
    return approvalAddress
  }

  public async populateSendApprovalTx (
    tokenAmount: TAmount,
    sourceChain: TChain,
    isHTokenTransfer: boolean = false,
    destinationChain?: TChain // this param was later added hence it's after the boolean param for backward compatibility
  ):Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    const spender = this.getSendApprovalAddress(sourceChain, isHTokenTransfer, destinationChain)
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
  ) : Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    const populatedTx = await this.populateSendApprovalTx(tokenAmount, sourceChain, isHTokenTransfer, destinationChain)
    if (populatedTx) {
      await this.checkConnectedChain(this.signer, sourceChain)
      return this.sendTransaction(populatedTx, sourceChain)
    }
  }

  public async sendHToken (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ) : Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    const populatedTx = await this.populateSendHTokensTx(tokenAmount, sourceChain, destinationChain, options)
    await this.checkConnectedChain(this.signer, sourceChain)
    return this.sendTransaction(populatedTx, sourceChain)
  }

  public async estimateSendHTokensGasLimit (
    tokenAmount: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    options: Partial<SendOptions> = {}
  ) : Promise<BigNumber> {
    const populatedTx = await this.populateSendHTokensTx(tokenAmount, sourceChain, destinationChain, options)
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
      options?.deadline ??
      options?.amountOutMin ??
      options?.destinationDeadline ??
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
    const relayer = await this.getBonderAddress(sourceChain, destinationChain)
    if (!relayer) {
      throw new Error('Relayer address is required')
    }

    if (sourceChain.isL1) {
      if (bonderFee.gt(0) && !this.relayerFeeEnabled[destinationChain.slug]) {
        throw new Error('Bonder fee should be 0 when sending from L1 to L2 and relayer fee is disabled')
      }

      const l1Bridge = await this.getL1Bridge(sourceChain.provider!)
      const isPaused = await l1Bridge.isChainIdPaused(destinationChain.chainId)
      if (isPaused) {
        throw new Error(`deposits to destination chain "${destinationChain.name}" are currently paused. Please check official announcement channels for status updates.`)
      }

      const isNativeToken = this.isNativeToken(sourceChain)
      const value = isNativeToken ? tokenAmount : undefined

      if (!this.isValidRelayerAndRelayerFee(relayer, bonderFee)) {
        throw new Error('Bonder fee should be 0 when sending from L1 to L2 and relayer is not set')
      }
      const txOptions = [
        destinationChain.chainId,
        recipient,
        tokenAmount,
        amountOutMin,
        deadline,
        relayer,
        bonderFee,
        {
          ...(await this.txOverrides(Chain.Ethereum, destinationChain)),
          value
        }
      ] as const

      const tx = await l1Bridge.populateTransaction.sendToL2(...txOptions)
      return tx
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

      const l2Bridge = await this.getL2Bridge(sourceChain, sourceChain.provider!)
      return l2Bridge.populateTransaction.send(...txOptions)
    }
  }

  public getTokenSymbol (): string {
    return this.tokenSymbol
  }

  public getTokenImage (): string {
    return this.getL1Token()?.image
  }

  getTokenDecimals ():number {
    const token = this.toTokenModel(this.tokenSymbol)
    return token.decimals
  }

  async getTokenBalance (chain: TChain, address?: string):Promise<BigNumber> {
    const token = this.getCanonicalToken(chain)
    return token.balanceOf(address)
  }

  public async getSendData (
    amountIn: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain,
    isHTokenSend: boolean = false
  ) : Promise<any> {
    amountIn = BigNumber.from(amountIn)
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const amountInNoSlippage = BigNumber.from(1000)
    const lpFees = this.getLpFees(amountIn, sourceChain, destinationChain)

    const [
      hTokenAmount,
      amountOutNoSlippage,
      bonderFeeRelative,
      destinationTxFeeData,
      feeBps,
      availableLiquidity
    ] = await Promise.all([
      this.calcToHTokenAmount(amountIn, sourceChain, isHTokenSend),
      this.getAmountOut(amountInNoSlippage, sourceChain, destinationChain),
      this.getBonderFeeRelative(amountIn, sourceChain, destinationChain, isHTokenSend),
      this.getDestinationTransactionFeeData(sourceChain, destinationChain),
      this.getFeeBps(this.tokenSymbol, destinationChain),
      !sourceChain?.isL1 ? this.getFrontendAvailableLiquidity(sourceChain, destinationChain) : Promise.resolve(null)
    ])

    const {
      destinationTxFee,
      rate: tokenPriceRate,
      chainNativeTokenPrice,
      tokenPrice,
      destinationChainGasPrice
    } = destinationTxFeeData

    let amountOutWithoutFee : BigNumber
    let adjustedBonderFee = BigNumber.from(0)
    let adjustedDestinationTxFee = BigNumber.from(0)
    let totalFee = BigNumber.from(0)
    if (sourceChain.isL1) {
      if (this.relayerFeeEnabled[destinationChain.slug]) {
        adjustedBonderFee = BigNumber.from(0)
        adjustedDestinationTxFee = destinationTxFee
        totalFee = adjustedBonderFee.add(adjustedDestinationTxFee)
      }
      amountOutWithoutFee = await this.calcFromHTokenAmount(hTokenAmount, destinationChain)
    } else {
      let bonderFeeAbsolute : BigNumber
      if (isHTokenSend) {
        // fees do not need to be adjusted for AMM slippage when sending hTokens
        adjustedBonderFee = bonderFeeRelative
        adjustedDestinationTxFee = destinationTxFee
        ;([amountOutWithoutFee, bonderFeeAbsolute] = await Promise.all([
          this.calcFromHTokenAmount(hTokenAmount, destinationChain),
          this.getBonderFeeAbsolute(sourceChain)
        ]))
      } else {
        // adjusted fee is the fee in the canonical token after adjusting for the hToken price
        ([[amountOutWithoutFee, adjustedBonderFee, adjustedDestinationTxFee], bonderFeeAbsolute] = await Promise.all([
          this.calcFromHTokenAmountMulticall(destinationChain, [hTokenAmount, bonderFeeRelative, destinationTxFee]),
          this.getBonderFeeAbsolute(sourceChain)
        ]))
      }

      // enforce bonderFeeAbsolute after adjustment
      adjustedBonderFee = adjustedBonderFee.gt(bonderFeeAbsolute) ? adjustedBonderFee : bonderFeeAbsolute
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

    const relayFeeEth = BigNumber.from(0)
    let estimatedReceived = amountOutWithoutFee
    if (totalFee.gt(0)) {
      estimatedReceived = estimatedReceived.sub(totalFee)
    }

    if (estimatedReceived.lt(0)) {
      estimatedReceived = BigNumber.from(0)
    }

    let isLiquidityAvailable = true
    if (availableLiquidity) {
      isLiquidityAvailable = availableLiquidity.gte(hTokenAmount)
    }

    const lpFeeBps = this.getLpFeeBps(destinationChain)

    return {
      amountIn,
      sourceChain,
      destinationChain,
      isHTokenSend,
      amountOut: amountOutWithoutFee,
      rate,
      priceImpact,
      requiredLiquidity: hTokenAmount,
      lpFees,
      bonderFeeRelative,
      adjustedBonderFee,
      destinationTxFee,
      adjustedDestinationTxFee,
      totalFee,
      estimatedReceived,
      feeBps,
      lpFeeBps,
      tokenPriceRate,
      chainNativeTokenPrice,
      tokenPrice,
      destinationChainGasPrice,
      relayFeeEth,
      isLiquidityAvailable
    }
  }

  getSendDataAmountOutMins (getSendDataResponse: any, slippageTolerance: number): any {
    const { sourceChain, destinationChain, requiredLiquidity, amountIn, amountOut, totalFee } = getSendDataResponse

    const amountOutMin = this.calcAmountOutMin(amountOut, slippageTolerance)

    // l1->l2
    if (sourceChain.isL1) {
      return {
        amount: amountIn,
        amountOutMin: amountOutMin.sub(totalFee),
        destinationAmountOutMin: null,
        deadline: this.defaultDeadlineSeconds,
        destinationDeadline: null
      }
    }

    // l2->l1
    if (destinationChain.isL1) {
      return {
        amount: amountIn,
        amountOutMin: amountOutMin.sub(totalFee),
        destinationAmountOutMin: BigNumber.from(0),
        deadline: this.defaultDeadlineSeconds,
        destinationDeadline: 0
      }
    }

    // l2->l2
    return {
      amount: amountIn,
      amountOutMin: this.calcAmountOutMin(requiredLiquidity, slippageTolerance).sub(totalFee),
      destinationAmountOutMin: amountOutMin.sub(totalFee),
      deadline: this.defaultDeadlineSeconds,
      destinationDeadline: this.defaultDeadlineSeconds
    }
  }

  public async getAmmData (
    chain: TChain,
    amountIn: BigNumberish,
    isToHToken: boolean,
    slippageTolerance: number
  ) :Promise<any> {
    chain = this.toChainModel(chain)
    amountIn = BigNumber.from(amountIn)
    const canonicalToken = this.getCanonicalToken(chain)
    const hToken = this.getL2HopToken(chain)

    const sourceToken = isToHToken ? canonicalToken : hToken
    const destToken = isToHToken ? hToken : canonicalToken

    const amountInNoSlippage = BigNumber.from(1000)
    let amountOut : BigNumber
    let amountOutNoSlippage : BigNumber
    if (isToHToken) {
      ([amountOut, amountOutNoSlippage] = await this.calcToHTokenAmountMulticall(chain, [amountIn, amountInNoSlippage]))
    } else {
      ([amountOut, amountOutNoSlippage] = await this.calcFromHTokenAmountMulticall(chain, [amountIn, amountInNoSlippage]))
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
    const amountOutMin = this.calcAmountOutMin(amountOut, slippageTolerance)

    // Divide by 10000 at the end so that the amount isn't floored at 0
    const lpFee = this.getLpFeeBps(chain)
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

  public getLpFees (
    amountIn: BigNumberish,
    sourceChain: TChain,
    destinationChain: TChain
  ): BigNumber {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    let lpFeeBpsBn = BigNumber.from(0)
    if (!sourceChain.isL1) {
      const lpFee = this.getLpFeeBps(sourceChain)
      lpFeeBpsBn = lpFeeBpsBn.add(lpFee)
    }
    if (!destinationChain.isL1) {
      const lpFee = this.getLpFeeBps(destinationChain)
      lpFeeBpsBn = lpFeeBpsBn.add(lpFee)
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

    const { destinationTxFee } = await this.getDestinationTransactionFeeData(sourceChain, destinationChain)
    return destinationTxFee
  }

  public async getDestinationTransactionFeeData (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (sourceChain.isL1 && !this.relayerFeeEnabled[destinationChain.slug]) {
      return {
        destinationTxFee: BigNumber.from(0),
        rate: null,
        chainNativeTokenPrice: null,
        tokenPrice: null,
        destinationChainGasPrice: null
      }
    }

    const timeStart = Date.now()
    const isRelayerFee = sourceChain.isL1 && this.relayerFeeEnabled[destinationChain.slug]
    const canonicalToken = this.getCanonicalToken(sourceChain)
    const chainNativeToken = this.getChainNativeToken(destinationChain)
    const [chainNativeTokenPrice, tokenPrice, destinationChainGasPrice, bondTransferGasLimit, l1FeeInWei, relayerFee] = await Promise.all([
      this.getPriceByTokenSymbol(
        chainNativeToken.symbol
      ),
      this.getPriceByTokenSymbol(
        canonicalToken.symbol
      ),
      this.getGasPrice(destinationChain.provider!),
      this.estimateBondWithdrawalGasLimit(
        sourceChain,
        destinationChain
      ),
      (destinationChain.equals(Chain.Optimism) || destinationChain.equals(Chain.Base)) ? this.getOptimismL1Fee(sourceChain, destinationChain) : Promise.resolve(BigNumber.from(0)),
      isRelayerFee ? this.getRelayerFee(destinationChain, this.tokenSymbol) : Promise.resolve(undefined)
    ])

    if (chainNativeTokenPrice == null) {
      throw new Error(`chainNativeTokenPrice not found for chain "${destinationChain.slug}"`)
    }

    if (tokenPrice == null) {
      throw new Error(`tokenPrice not found for chain "${destinationChain.slug}"`)
    }

    const rate = chainNativeTokenPrice / tokenPrice

    // Include the cost to settle an individual transfer
    const settlementGasLimitPerTx: number = SettlementGasLimitPerTx[destinationChain.slug]
    if (!settlementGasLimitPerTx) {
      throw new Error(`settlementGasLimitPerTx not found for chain "${destinationChain.slug}"`)
    }
    const bondTransferGasLimitWithSettlement = bondTransferGasLimit.add(settlementGasLimitPerTx)

    const oneEth = parseEther('1')
    let destinationTxFee = relayerFee
    if (!destinationTxFee) {
      const rateBN = parseUnits(
        rate.toFixed(canonicalToken.decimals),
        canonicalToken.decimals
      )
      const txFeeInWei = destinationChainGasPrice.mul(bondTransferGasLimitWithSettlement).add(l1FeeInWei)
      destinationTxFee = txFeeInWei.mul(rateBN).div(oneEth)
    }

    if (
      destinationChain.equals(Chain.Ethereum) ||
      destinationChain.equals(Chain.Optimism) ||
      destinationChain.equals(Chain.Arbitrum) ||
      destinationChain.equals(Chain.Nova) ||
      destinationChain.equals(Chain.Linea) ||
      destinationChain.equals(Chain.Base)
    ) {
      const multiplier = parseEther(this.getDestinationFeeGasPriceMultiplier().toString())
      if (multiplier.gt(0)) {
        destinationTxFee = destinationTxFee.mul(multiplier).div(oneEth)
      }
    }

    this.debugTimeLog('getDestinationTransactionFeeData', timeStart)

    return {
      destinationTxFee,
      rate,
      chainNativeTokenPrice,
      tokenPrice,
      destinationChainGasPrice
    }
  }

  async getOptimismL1Fee (
    sourceChain: TChain,
    destinationChain: TChain
  ) : Promise<BigNumber> {
    try {
      const timeStart = Date.now()
      const [gasLimit, { data, to }] = await Promise.all([
        this.estimateBondWithdrawalGasLimit(sourceChain, destinationChain),
        this.populateBondWithdrawalTx(sourceChain, destinationChain)
      ])
      const l1FeeInWei = await this.estimateOptimismL1FeeFromData(gasLimit, data, to)
      this.debugTimeLog('getOptimismL1Fee', timeStart)
      return l1FeeInWei
    } catch (err) {
      console.error(err)
      return BigNumber.from(0)
    }
  }

  async willTransferFail (
    sourceChain: TChain,
    destinationChain: TChain,
    recipient: string
  ): Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    try {
      const isDestinationNativeToken = this.isNativeToken(destinationChain)
      if (!isDestinationNativeToken) {
        return false
      }
      if (sourceChain.isL1) {
        if (destinationChain.equals(Chain.ZkSync)) {
          // TODO
        } else if (destinationChain.equals(Chain.Linea)) {
          // TODO
        } else if (destinationChain.equals(Chain.ScrollZk)) {
          // TODO
        } else if (destinationChain.equals(Chain.Base)) {
          // TODO
        } else if (destinationChain.equals(Chain.PolygonZk)) {
          // TODO
        } else {
          const bonderAddress = await this.getBonderAddress(sourceChain, destinationChain)
          await this.estimateGas(destinationChain.provider!, {
            value: BigNumber.from('1'),
            from: bonderAddress,
            to: recipient
          })
        }
        return false
      } else {
        const [bonderAddress, populatedTx] = await Promise.all([
          this.getBonderAddress(sourceChain, destinationChain),
          this.populateBondWithdrawalTx(sourceChain, destinationChain, recipient)
        ])
        populatedTx.from = bonderAddress
        await this.estimateGas(destinationChain.provider!, populatedTx)
        return false
      }
    } catch (err) {
      console.error('willTransferFail error:', err)
      return true
    }
  }

  async estimateBondWithdrawalGasLimit (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<any> {
    destinationChain = this.toChainModel(destinationChain)
    try {
      const timeStart = Date.now()
      const populatedTx = await this.populateBondWithdrawalTx(sourceChain, destinationChain)
      const estimatedGas = await this.estimateGas(destinationChain.provider!, populatedTx)
      this.debugTimeLog('estimateBondWithdrawalGasLimit', timeStart)
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
      } else if (destinationChain.equals(Chain.Nova)) {
        bondTransferGasLimit = BondTransferGasLimit.Nova
      } else if (destinationChain.equals(Chain.Base)) {
        bondTransferGasLimit = BondTransferGasLimit.Base
      } else if (destinationChain.equals(Chain.Linea)) {
        bondTransferGasLimit = BondTransferGasLimit.Linea
      }
      return BigNumber.from(bondTransferGasLimit)
    }
  }

  async populateBondWithdrawalTx (
    sourceChain: TChain,
    destinationChain: TChain,
    recipient?: string
  ): Promise<any> {
    destinationChain = this.toChainModel(destinationChain)
    let destinationBridge
    if (destinationChain.isL1) {
      destinationBridge = await this.getL1Bridge()
    } else {
      destinationBridge = await this.getL2Bridge(destinationChain)
    }
    destinationBridge = destinationBridge.connect(destinationChain.provider)
    const bonder = await this.getBonderAddress(sourceChain, destinationChain)
    const amount = BigNumber.from(10)
    const amountOutMin = BigNumber.from(0)
    const bonderFee = BigNumber.from(1)
    const deadline = this.defaultDeadlineSeconds
    const transferNonce = `0x${'0'.repeat(64)}`
    if (!recipient) {
      recipient = `0x${'1'.repeat(40)}`
    }
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
      const timeStart = Date.now()
      const populatedTx = await (destinationBridge as L2_Bridge).populateTransaction.bondWithdrawalAndDistribute(
        ...payload
      )
      this.debugTimeLog('populateBondWithdrawalTx', timeStart)

      return populatedTx
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
      const timeStart = Date.now()
      const populatedTx = destinationBridge.populateTransaction.bondWithdrawal(
        ...payload
      )
      this.debugTimeLog('populateBondWithdrawalTx', timeStart)
      return populatedTx
    }
  }

  /**
   * @desc Estimate token amount out.
   * @param tokenAmountIn - Token amount input.
   * @param sourceChain - Source chain model.
   * @param destinationChain - Destination chain model.
   * @returns Amount as BigNumber.
   * @example
   *```js
   *import { Hop, Chain } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge('USDC')
   *const amountOut = await bridge.getAmountOut('1000000000000000000', Chain.Optimism, Chain.Gnosis)
   *console.log(amountOut)
   *```
   */
  public async getAmountOut (
    tokenAmountIn: TAmount,
    sourceChain?: TChain,
    destinationChain?: TChain
  ) : Promise<BigNumber> {
    if (!sourceChain) {
      throw new Error('sourceChain is required')
    }
    if (!destinationChain) {
      throw new Error('destinationChain is required')
    }
    tokenAmountIn = BigNumber.from(tokenAmountIn.toString())
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const timeStart = Date.now()
    const hTokenAmount = await this.calcToHTokenAmount(
      tokenAmountIn,
      sourceChain
    )
    const amountOut = await this.calcFromHTokenAmount(
      hTokenAmount,
      destinationChain
    )

    this.debugTimeLog('getAmountOut', timeStart)

    return amountOut
  }

  /**
   * @desc Estimate the bonder liquidity needed at the destination.
   * @param tokenAmountIn - Token amount input.
   * @param sourceChain - Source chain model.
   * @returns Amount as BigNumber.
   * @example
   *```js
   *import { Hop, Chain } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.connect(signer).bridge('USDC')
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
   * @param sourceChain - Source chain model.
   * @param destinationChain - Destination chain model.
   * @returns Available liquidity as BigNumber.
   */
  public async getFrontendAvailableLiquidity (
    sourceChain: TChain,
    destinationChain: TChain
  ): Promise<BigNumber> {
    if (!(this.isSupportedAsset(sourceChain) && this.isSupportedAsset(destinationChain))) {
      return BigNumber.from(0)
    }

    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    const token = this.toTokenModel(this.tokenSymbol)
    const promiseResult = await Promise.all([
      this.getBaseAvailableCreditIncludingVault(
        sourceChain,
        destinationChain
      ),
      this.getUnbondedTransferRootAmount(
        sourceChain,
        destinationChain
      ),
      this.getPriceByTokenSymbol(token.canonicalSymbol)
    ])

    let availableLiquidity = promiseResult[0]
    const unbondedTransferRootAmount = promiseResult[1]
    const tokenPrice = promiseResult[2]

    // fetch on-chain if the data is not available from worker json file
    if (availableLiquidity == null) {
      const bonder = await this.getBonderAddress(sourceChain, destinationChain)
      availableLiquidity = await this.getAvailableLiquidity(destinationChain, bonder)
    }

    if (destinationChain.isL1) {
      let pendingAmounts = BigNumber.from(0)
      await Promise.all(bondableChains.map(async (bondableChain: string) => {
        let validChain = false
        try {
          validChain = !!this.getL2BridgeAddress(this.tokenSymbol, bondableChain)
        } catch (err) {}
        if (validChain) {
          const bondableBridge = await this.getBridgeContract(bondableChain)
          const pendingAmount = await bondableBridge.pendingAmountForChainId(Chain.Ethereum.chainId)
          pendingAmounts = pendingAmounts.add(pendingAmount)
        }
      }))

      const isLowLiquidityToken = LowLiquidityTokens.includes(token.canonicalSymbol)
      const buffer: string = isLowLiquidityToken ? LowLiquidityTokenBufferAmountsUsd[this.tokenSymbol] : PendingAmountBufferUsd?.toString()
      const tokenPriceBn = parseUnits(tokenPrice.toString(), token.decimals)
      const bufferAmountBn = parseUnits(buffer, token.decimals)
      const precision = parseUnits('1', token.decimals)
      const bufferAmountTokensBn = bufferAmountBn.div(tokenPriceBn).mul(precision)

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

  private isOruToL1 (sourceChain: Chain, destinationChain: Chain): boolean {
    return destinationChain.isL1 && bondableChains.includes(sourceChain.slug)
  }

  async getBonderAvailableLiquidityData (): Promise<any> {
    const cached = s3FileCache[this.network]
    const isExpired = s3FileCacheTimestamp + cacheExpireMs < Date.now()
    if (cached && !isExpired) {
      return cached
    }
    const data = await this.fetchBonderAvailableLiquidityDataWithIpfsFallback()
    if (data) {
      s3FileCache[this.network] = data
      s3FileCacheTimestamp = Date.now()
    }
    return data
  }

  async getUnbondedTransferRootAmount (
    sourceChain: TChain,
    destinationChain: TChain
  ) : Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    try {
      const data = await this.getBonderAvailableLiquidityData()
      if (data) {
        const tokenData = data?.[this.tokenSymbol]
        const _unbondedTransferRootAmount = tokenData?.unbondedTransferRootAmounts?.[sourceChain.slug]?.[destinationChain.slug]
        if (_unbondedTransferRootAmount) {
          return BigNumber.from(_unbondedTransferRootAmount)
        }
      }
    } catch (err) {
      console.error(err)
    }

    return BigNumber.from(0)
  }

  private async getBaseAvailableCreditIncludingVault (
    sourceChain: TChain,
    destinationChain: TChain
  ) : Promise<BigNumber | undefined> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    try {
      const data = await this.getBonderAvailableLiquidityData()
      if (data) {
        const tokenData = data?.[this.tokenSymbol]
        const _baseAvailableCreditIncludingVault = tokenData?.baseAvailableCreditIncludingVault?.[sourceChain.slug]?.[destinationChain.slug]
        if (_baseAvailableCreditIncludingVault) {
          return BigNumber.from(_baseAvailableCreditIncludingVault)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  public async getVaultBalance (
    destinationChain: TChain,
    bonder: string
  ): Promise<BigNumber> {
    destinationChain = this.toChainModel(destinationChain)
    try {
      const data = await this.getBonderAvailableLiquidityData()
      if (data) {
        const tokenData = data?.[this.tokenSymbol]
        const _vaultBalance = tokenData?.bonderVaultBalance?.[bonder]?.[destinationChain.slug]
        if (_vaultBalance) {
          return BigNumber.from(_vaultBalance)
        }
      }
    } catch (err) {
      console.error(err)
    }
    return BigNumber.from(0)
  }

  /**
   * @desc Returns bridge contract instance for specified chain.
   * @param chain - chain model.
   * @returns Ethers contract instance.
   */
  public async getBridgeContract (chain: TChain): Promise<ethers.Contract> {
    chain = this.toChainModel(chain)
    return chain.isL1 ? this.getL1Bridge() : this.getL2Bridge(chain)
  }

  /**
   * @desc Returns total credit that bonder holds on Hop bridge at specified chain.
   * @param sourceChain - Chain model.
   * @returns Total credit as BigNumber.
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
   * @param sourceChain - Chain model.
   * @returns Total debit as BigNumber.
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
   * @param sourceChain - Chain model.
   * @returns Total debit as BigNumber.
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
   * @param sourceChain - Source chain model.
   * @param toHop - Converts to Hop token only if set to true.
   * @param amount - Amount of token to swap.
   * @param minAmountOut - Minimum amount of tokens to receive in order
   * for transaction to be successful.
   * @param deadline - Transaction deadline in seconds.
   * @returns Ethers transaction object.
   */
  public async execSaddleSwap (
    sourceChain: TChain,
    toHop: boolean,
    amount: TAmount,
    minAmountOut: TAmount,
    deadline: BigNumberish
  ) : Promise<any> {
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

    const amm = this.getAmm(sourceChain)
    const saddleSwap = await amm.getSaddleSwap()
    const [canonicalTokenIndex, hopTokenIndex] = await Promise.all([
      saddleSwap.getTokenIndex(l2CanonicalTokenAddress).then((index: BigNumber) => Number(index.toString())),
      saddleSwap.getTokenIndex(l2HopBridgeTokenAddress).then((index: BigNumber) => Number(index.toString()))
    ])

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
   * @param signer - Ethers signer
   * @returns Ethers contract instance.
   */
  public async getL1Bridge (signer: TProvider = this.signer): Promise<any> {
    const bridgeAddress = this.getL1BridgeAddress(
      this.tokenSymbol,
      Chain.Ethereum
    )
    if (!bridgeAddress) {
      throw new Error(`token "${this.tokenSymbol}" is unsupported`)
    }
    const provider = await this.getSignerOrProvider(Chain.Ethereum, signer)
    return L1_ERC20_Bridge__factory.connect(bridgeAddress, provider)
  }

  /**
   * @desc Returns Hop L2 Bridge Ethers contract instance.
   * @param chain - Chain model.
   * @param signer - Ethers signer
   * @returns Ethers contract instance.
   */
  public async getL2Bridge (chain: TChain, signer: TProvider = this.signer): Promise<any> {
    chain = this.toChainModel(chain)
    const bridgeAddress = this.getL2BridgeAddress(this.tokenSymbol, chain)
    if (!bridgeAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${chain.slug}" is unsupported`
      )
    }
    const provider = await this.getSignerOrProvider(chain, signer)
    return L2_Bridge__factory.connect(bridgeAddress, provider)
  }

  public getAmm (chain: TChain) {
    chain = this.toChainModel(chain)
    if (chain.isL1) {
      throw new Error('No AMM exists on L1')
    }

    return new AMM({
      network: this.network,
      tokenSymbol: this.tokenSymbol,
      chain,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
  }

  /**
   * @desc Returns Hop Bridge AMM wrapper Ethers contract instance.
   * @param chain - Chain model.
   * @param signer - Ethers signer
   * @returns Ethers contract instance.
   */
  public async getAmmWrapper (chain: TChain, signer: TProvider = this.signer): Promise<any> {
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
    return L2_AmmWrapper__factory.connect(ammWrapperAddress, provider)
  }

  /**
   * @desc Returns Hop Bridge Saddle reserve amounts.
   * @param chain - Chain model.
   * @returns Array containing reserve amounts for canonical token
   * and hTokens.
   */
  public async getSaddleSwapReserves (chain: TChain = this.sourceChain): Promise<BigNumber[]> {
    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    return Promise.all([
      saddleSwap.getTokenBalance(0),
      saddleSwap.getTokenBalance(1)
    ])
  }

  public async getReservesTotal (chain: TChain = this.sourceChain): Promise<BigNumber> {
    const [reserve0, reserve1] = await this.getSaddleSwapReserves(chain)
    return reserve0.add(reserve1)
  }

  public async getTvl (chain: TChain = this.sourceChain) {
    return this.getReservesTotal(chain)
  }

  public async getTvlUsd (chain: TChain = this.sourceChain): Promise<number> {
    const token = this.toTokenModel(this.tokenSymbol)
    const [tvl, tokenPrice] = await Promise.all([
      this.getTvl(chain),
      this.getPriceByTokenSymbol(token.canonicalSymbol)
    ])
    if (tvl.lte(0)) {
      return 0
    }
    const tvlFormatted = this.formatUnits(tvl)
    let tvlUsd = tvlFormatted * tokenPrice
    if (tvlUsd < 0) {
      tvlUsd = 0
    }

    return tvlUsd
  }

  /**
   * @desc Returns Hop Bridge Saddle Swap LP Token Ethers contract instance.
   * @param chain - Chain model.
   * @param signer - Ethers signer
   * @returns Ethers contract instance.
   */
  public getSaddleLpToken (
    chain: TChain,
    signer: TProvider = this.signer
  ) : Token {
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
    return new Token({
      network: this.network,
      chain,
      address: saddleLpTokenAddress,
      decimals: 18,
      symbol: `${this.tokenSymbol} LP`,
      name: `${this.tokenSymbol} LP`,
      image: '',
      signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
  }

  /**
   * @desc Sends transaction to add liquidity to AMM.
   * @param amount0Desired - Amount of token #0 in smallest unit
   * @param amount1Desired - Amount of token #1 in smallest unit
   * @param chain - Chain model of desired chain to add liquidity to.
   * @param options - Method options.
   * @returns Ethers transaction object.
   */
  public async addLiquidity (
    amount0Desired: TAmount,
    amount1Desired: TAmount,
    chain?: TChain,
    options: Partial<AddLiquidityOptions> = {}
  ) :Promise<any> {
    if (!chain) {
      chain = this.sourceChain
    }
    amount0Desired = BigNumber.from(amount0Desired.toString())
    chain = this.toChainModel(chain)

    const amm = new AMM({
      network: this.network,
      tokenSymbol: this.tokenSymbol,
      chain,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
    return amm.addLiquidity(
      amount0Desired,
      amount1Desired,
      options.minToMint,
      options.deadline
    )
  }

  /**
   * @desc Sends transaction to remove liquidity from AMM.
   * @param liquidityTokenAmount - Amount of LP tokens to burn.
   * @param chain - Chain model of desired chain to add liquidity to.
   * @param options - Method options.
   * @returns Ethers transaction object.
   */
  public async removeLiquidity (
    liquidityTokenAmount: TAmount,
    chain?: TChain,
    options: Partial<RemoveLiquidityOptions> = {}
  ) : Promise<any> {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM({
      network: this.network,
      tokenSymbol: this.tokenSymbol,
      chain,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
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
  ) : Promise<any> {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM({
      network: this.network,
      tokenSymbol: this.tokenSymbol,
      chain,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
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
  ) : Promise<any> {
    if (!chain) {
      chain = this.sourceChain
    }
    chain = this.toChainModel(chain)
    const amm = new AMM({
      network: this.network,
      tokenSymbol: this.tokenSymbol,
      chain,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
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
    const amm = new AMM({
      network: this.network,
      tokenSymbol: this.tokenSymbol,
      chain,
      signer: this.signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
    return amm.calculateRemoveLiquidityOneToken(
      tokenAmount,
      tokenIndex
    )
  }

  /**
   * @readonly
   * @desc The default deadline to use in seconds.
   * @returns Deadline in seconds
   */
  public get defaultDeadlineSeconds (): number {
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
   * @param timeSlot - Time slot to get.
   * @param bonder - Address of the bonder to check.
   * @returns Amount bonded for the bonder for the given time slot as BigNumber.
   */
  public async timeSlotToAmountBonded (
    timeSlot: TTimeSlot,
    bonder: string
  ): Promise<BigNumber> {
    const bridge = await this.getL1Bridge()
    timeSlot = BigNumber.from(timeSlot.toString())

    return bridge.timeSlotToAmountBonded(timeSlot, bonder)
  }

  private async getTokenIndexes (path: string[], chain: TChain) : Promise<number[]> {
    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    const [tokenIndexFrom, tokenIndexTo] = await Promise.all([
      saddleSwap.getTokenIndex(path[0]).then((index: BigNumber) => Number(index.toString())),
      saddleSwap.getTokenIndex(path[1]).then((index: BigNumber) => Number(index.toString()))
    ])

    return [tokenIndexFrom, tokenIndexTo]
  }

  private async populateSendL1ToL2Tx (input: SendL1ToL2Input) : Promise<any> {
    let {
      relayerFee,
      amountOutMin,
      deadline,
      recipient,
    } = input
    const {
      destinationChain,
      sourceChain,
      relayer,
      amount,
      checkAllowance
    } = input
    if (!sourceChain.isL1) {
      // ToDo: Don't pass in sourceChain since it will always be L1
      throw new Error('sourceChain must be L1')
    }
    if (await this.getIsBridgeDeprecated(this.tokenSymbol)) {
      throw new Error('This bridge is deprecated')
    }
    if (!relayer) {
      throw new Error('relayer is required')
    }

    const destinationChainId = destinationChain.chainId
    deadline = deadline ?? this.defaultDeadlineSeconds
    amountOutMin = BigNumber.from((amountOutMin ?? 0).toString())
    recipient = recipient ?? await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient is required')
    }
    recipient = checksumAddress(recipient)

    const isNativeToken = this.isNativeToken(sourceChain)
    let l1Bridge = await this.getL1Bridge(sourceChain.provider!)

    if (checkAllowance) {
      await this.checkConnectedChain(this.signer, sourceChain)
      l1Bridge = await this.getL1Bridge(this.signer)
      const spender = l1Bridge.address
      if (!isNativeToken) {
        const l1Token = this.getL1Token()
        const allowance = await l1Token.allowance(spender)
        if (allowance.lt(BigNumber.from(amount))) {
          throw new Error(Errors.NotEnoughAllowance)
        }
      }
    }

    if (amountOutMin.lt(0)) {
      amountOutMin = BigNumber.from(0)
    }

    const value = isNativeToken ? amount : undefined
    relayerFee = BigNumber.from(relayerFee ?? 0)

    if (!this.isValidRelayerAndRelayerFee(relayer, relayerFee)) {
      throw new Error('Bonder fee should be 0 when sending from L1 to L2 and relayer is not set')
    }

    const isPaused = await l1Bridge.isChainIdPaused(destinationChain.chainId)
    if (isPaused) {
      throw new Error(`deposits to destination chain "${destinationChain.name}" are currently paused. Please check official announcement channels for status updates.`)
    }

    const txOptions = [
      destinationChainId,
      recipient,
      amount || 0,
      amountOutMin,
      deadline,
      relayer,
      relayerFee,
      {
        ...(await this.txOverrides(Chain.Ethereum, destinationChain)),
        value
      }
    ] as const

    const tx = await l1Bridge.populateTransaction.sendToL2(
      ...txOptions
    )

    return tx
  }

  private async populateSendL2ToL1Tx (input: SendL2ToL1Input): Promise<any> {
    let {
      recipient,
      amountOutMin,
      deadline,
    } = input
    const {
      destinationChain,
      sourceChain,
      amount,
      bonderFee,
      checkAllowance
    } = input
    const destinationChainId = destinationChain.chainId
    deadline = deadline ?? this.defaultDeadlineSeconds
    amountOutMin = BigNumber.from((amountOutMin ?? 0).toString())

    // Destination values will always be 0 going to L1
    const destinationDeadline = BigNumber.from(0)
    const destinationAmountOutMin = BigNumber.from(0)

    if (!destinationChain.isL1) {
      throw new Error('All transfers populated here must be sent to L1')
    }

    recipient = recipient ?? await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient is required')
    }
    recipient = checksumAddress(recipient)

    const ammWrapper = await this.getAmmWrapper(sourceChain, sourceChain.provider!)
    const l2Bridge = await this.getL2Bridge(sourceChain, sourceChain.provider!)
    const attemptSwapAtSource = this.shouldAttemptSwap(amountOutMin, deadline)
    const spender = attemptSwapAtSource ? ammWrapper.address : l2Bridge.address

    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. amount: ${amount.toString()}, bonderFee: ${bonderFee?.toString()}`)
    }

    const isNativeToken = this.isNativeToken(sourceChain)

    if (checkAllowance) {
      await this.checkConnectedChain(this.signer, sourceChain)
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

    const txOptions = [
      destinationChainId,
      recipient,
      amount,
      bonderFee
    ] as const

    if (attemptSwapAtSource) {
      const additionalOptions = [
        amountOutMin,
        deadline,
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

    const additionalOptions = [
      destinationAmountOutMin,
      destinationDeadline,
      {
        ...(await this.txOverrides(sourceChain)),
        value: isNativeToken ? amount : undefined
      }
    ] as const

    return l2Bridge.populateTransaction.send(
      ...txOptions,
      ...additionalOptions
    )
  }

  private async populateSendL2ToL2Tx (input: SendL2ToL2Input): Promise<any> {
    let {
      destinationAmountOutMin,
      deadline,
      destinationDeadline,
      amountOutMin,
      recipient,
    } = input
    const {
      destinationChain,
      sourceChain,
      amount,
      bonderFee,
      checkAllowance
    } = input
    const destinationChainId = destinationChain.chainId
    deadline = deadline ?? this.defaultDeadlineSeconds
    destinationDeadline = destinationDeadline ?? this.defaultDeadlineSeconds
    amountOutMin = BigNumber.from((amountOutMin ?? 0).toString())
    destinationAmountOutMin = BigNumber.from(
      (destinationAmountOutMin ?? 0).toString()
    )
    if (BigNumber.from(bonderFee).gt(amount)) {
      throw new Error('Amount must be greater than bonder fee')
    }

    recipient = recipient ?? await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient is required')
    }
    recipient = checksumAddress(recipient)

    const ammWrapper = await this.getAmmWrapper(sourceChain, sourceChain.provider!)
    const l2Bridge = await this.getL2Bridge(sourceChain, sourceChain.provider!)
    const attemptSwapAtSource = this.shouldAttemptSwap(amountOutMin, deadline)
    const spender = attemptSwapAtSource ? ammWrapper.address : l2Bridge.address
    const isNativeToken = this.isNativeToken(sourceChain)

    if (checkAllowance) {
      await this.checkConnectedChain(this.signer, sourceChain)
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
      bonderFee
    ] as const

    if (attemptSwapAtSource) {
      const additionalOptions = [
        amountOutMin,
        deadline,
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

    const additionalOptions = [
      destinationAmountOutMin,
      destinationDeadline,
      {
        ...(await this.txOverrides(sourceChain)),
        value: isNativeToken ? amount : undefined
      }
    ] as const

    return l2Bridge.populateTransaction.send(
      ...txOptions,
      ...additionalOptions
    )
  }

  private async calcToHTokenAmount (
    amount: TAmount,
    chain: Chain,
    isHTokenSend: boolean = false
  ): Promise<BigNumber> {
    if (!this.doesUseAmm || isHTokenSend) {
      return BigNumber.from(amount)
    }
    amount = BigNumber.from(amount.toString())
    if (chain.isL1) {
      return amount
    }

    if (amount.eq(0)) {
      return BigNumber.from(0)
    }

    const amm = this.getAmm(chain)
    const timeStart = Date.now()
    const amountOut = await amm.calculateSwap(
      TokenIndex.CanonicalToken,
      TokenIndex.HopBridgeToken,
      amount
    )

    this.debugTimeLog('calcToHTokenAmount', timeStart)

    return amountOut
  }

  private async calcFromHTokenAmount (
    amount: TAmount,
    chain: Chain
  ): Promise<BigNumber> {
    if (!this.doesUseAmm) {
      return BigNumber.from(amount)
    }
    amount = BigNumber.from(amount.toString())
    if (chain.isL1) {
      return BigNumber.from(amount)
    }

    if (amount.eq(0)) {
      return BigNumber.from(0)
    }

    const amm = this.getAmm(chain)
    const timeStart = Date.now()
    const amountOut = await amm.calculateSwap(
      TokenIndex.HopBridgeToken,
      TokenIndex.CanonicalToken,
      amount
    )

    this.debugTimeLog('calcFromHTokenAmount', timeStart)

    return amountOut
  }

  private async calcSwapAmountMulticall (
    chain: TChain,
    tokenIndexes: number[],
    amountIns: BigNumberish[]
  ): Promise<BigNumber[]> {
    chain = this.toChainModel(chain)
    if (!this.doesUseAmm) {
      return amountIns.map((amount: BigNumberish) => BigNumber.from(amount))
    }
    if (chain.isL1) {
      return amountIns.map((amount: BigNumberish) => BigNumber.from(amount))
    }

    const multicall = new Multicall({ network: this.network })
    const amm = this.getAmm(chain)
    const saddleSwap = await amm.getSaddleSwap()
    const options = amountIns.map((amountIn: any, index: number) => {
      return {
        skip: BigNumber.from(amountIn).eq(0),
        address: saddleSwap.address,
        abi: saddleSwap.interface.fragments,
        method: 'calculateSwap',
        args: [tokenIndexes[0], tokenIndexes[1], amountIn],
        index
      }
    })
    const result = await multicall.multicall(chain.slug, options.filter((option: any) => !option.skip))
    const items = result.map((values: any) => BigNumber.from(values[0]))
    const skipped = options.filter((option: any) => option.skip)
    skipped.sort((a, b) => a.index - b.index)
    for (const skip of skipped) {
      items.splice(skip.index, 0, BigNumber.from(0))
    }
    return items
  }

  async calcToHTokenAmountMulticall (
    chain: TChain,
    amountIns: BigNumberish[]
  ): Promise<BigNumber[]> {
    return this.calcSwapAmountMulticall(chain, [TokenIndex.CanonicalToken, TokenIndex.HopBridgeToken], amountIns)
  }

  async calcFromHTokenAmountMulticall (
    chain: TChain,
    amountIns: BigNumberish[]
  ): Promise<BigNumber[]> {
    return this.calcSwapAmountMulticall(chain, [TokenIndex.HopBridgeToken, TokenIndex.CanonicalToken], amountIns)
  }

  private async getBonderFeeRelative (
    amountIn: TAmount,
    sourceChain: TChain,
    destinationChain: TChain,
    isHTokenSend: boolean = false
  ) : Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (sourceChain.isL1) {
      // Relayer fees are handled in the destination fee
      return BigNumber.from(0)
    }

    const timeStart = Date.now()
    const [hTokenAmount, feeBps] = await Promise.all([
      this.calcToHTokenAmount(
        amountIn,
        sourceChain,
        isHTokenSend
      ),
      this.getFeeBps(this.tokenSymbol, destinationChain)
    ])

    this.debugTimeLog('getBonderFeeRelative', timeStart)

    const bonderFeeRelative = hTokenAmount.mul(feeBps).div(10000)
    return bonderFeeRelative
  }

  public async getBonderFeeAbsolute (sourceChain: TChain): Promise<BigNumber> {
    sourceChain = this.toChainModel(sourceChain)
    const token = this.toTokenModel(this.tokenSymbol)

    if (sourceChain.isL1) {
      // Bonder fees are not relevant on L2
      return BigNumber.from(0)
    }

    const timeStart = Date.now()
    let onChainBonderFeeAbsolutePromise : any
    if (token.canonicalSymbol === TokenModel.ETH) {
      if (Chain.Gnosis.equals(sourceChain) || Chain.Polygon.equals(sourceChain)) {
        const l2Bridge = await this.getL2Bridge(sourceChain)
        onChainBonderFeeAbsolutePromise = l2Bridge.minBonderFeeAbsolute()
      }
    }

    if (this.network !== NetworkSlug.Mainnet) {
      const l2Bridge = await this.getL2Bridge(sourceChain)
      onChainBonderFeeAbsolutePromise = l2Bridge.minBonderFeeAbsolute()
    }

    const [tokenPrice, onChainBonderFeeAbsolute] = await Promise.all([
      this.getPriceByTokenSymbol(token.canonicalSymbol),
      onChainBonderFeeAbsolutePromise ?? Promise.resolve(BigNumber.from(0))
    ])
    this.debugTimeLog('getBonderFeeAbsolute', timeStart)

    const minBonderFeeUsd = 0.25
    const minBonderFeeAbsolute = parseUnits(
      (minBonderFeeUsd / tokenPrice).toFixed(token.decimals),
      token.decimals
    )

    const absoluteFee = onChainBonderFeeAbsolute.gt(minBonderFeeAbsolute) ? onChainBonderFeeAbsolute : minBonderFeeAbsolute

    return absoluteFee
  }

  private getRate (
    amountIn: BigNumber,
    amountOut: BigNumber,
    sourceToken: Token,
    destToken: Token
  ) : number {
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

  private getPriceImpact (rate: number, marketRate: number) : number {
    return ((marketRate - rate) / marketRate) * 100
  }

  private async checkConnectedChain (signer: TProvider, chain: Chain): Promise<void> {
    const connectedChainId = await (signer as Signer)?.getChainId()
    if (connectedChainId !== chain.chainId) {
      throw new Error(`invalid connected chain ID "${connectedChainId}". Make sure web3 signer provider is connected to source chain from network "${chain.slug}" chain ID "${chain.chainId}"`)
    }
  }

  // Gnosis AMB bridge
  async getAmbBridge (chain: TChain): Promise<any> {
    chain = this.toChainModel(chain)
    if (chain.equals(Chain.Ethereum)) {
      const address = this.getL1AmbBridgeAddress(this.tokenSymbol, Chain.Gnosis)
      const provider = await this.getSignerOrProvider(Chain.Ethereum)
      return L1_HomeAMBNativeToErc20__factory.connect(address, provider)
    }
    const address = this.getL2AmbBridgeAddress(this.tokenSymbol, Chain.Gnosis)
    const provider = await this.getSignerOrProvider(Chain.Gnosis)
    return L1_HomeAMBNativeToErc20__factory.connect(address, provider)
  }

  getChainNativeToken (chain: TChain): any {
    chain = this.toChainModel(chain)
    if (chain?.equals(Chain.Polygon)) {
      return this.toTokenModel(CanonicalToken.MATIC)
    } else if (chain?.equals(Chain.Gnosis)) {
      return this.toTokenModel(CanonicalToken.DAI)
    }

    return this.toTokenModel(CanonicalToken.ETH)
  }

  isNativeToken (chain?: TChain) : boolean {
    const token = this.getCanonicalToken(chain ?? this.sourceChain)
    return token.isNativeToken
  }

  async getEthBalance (chain: TChain = this.sourceChain, address?: string): Promise<BigNumber> {
    chain = this.toChainModel(chain)
    address = address ?? await this.getSignerAddress()
    if (!address) {
      throw new Error('address is required')
    }
    return chain.provider!.getBalance(address)
  }

  isSupportedAsset (chain: TChain) :boolean {
    try {
      chain = this.toChainModel(chain)
      const supported = this.getSupportedAssets()
      const token = this.toTokenModel(this.tokenSymbol)
      return !!supported[chain?.slug]?.[token.canonicalSymbol] ?? false
    } catch (err: any) {
      console.error(err)
    }
    return false
  }

  async getBonderAddress (sourceChain: TChain, destinationChain: TChain): Promise<string> {
    return this._getBonderAddress(this.tokenSymbol, sourceChain, destinationChain)
  }

  async getMessengerWrapperAddress (destinationChain: TChain): Promise<string> {
    return this._getMessengerWrapperAddress(this.tokenSymbol, destinationChain)
  }

  shouldAttemptSwap (amountOutMin: BigNumber, deadline: BigNumberish): boolean {
    if (!this.doesUseAmm) {
      return false
    }
    deadline = BigNumber.from(deadline?.toString() || 0)
    return amountOutMin?.gt(0) || deadline?.gt(0)
  }

  private async getGasEstimateFromAddress (sourceChain: TChain, destinationChain: TChain): Promise<any> {
    let address = await this.getSignerAddress()
    if (!address) {
      address = await this.getBonderAddress(sourceChain, destinationChain)
    }
    return address
  }

  async withdraw (
    chain: TChain,
    recipient: string,
    amount: BigNumberish,
    transferNonce: string,
    bonderFee: BigNumberish,
    amountOutMin: BigNumberish,
    deadline: number,
    transferRootHash: string,
    rootTotalAmount: BigNumberish,
    transferIdTreeIndex: number,
    siblings: string[],
    totalLeaves: number
  ) {
    chain = this.toChainModel(chain)
    await this.checkConnectedChain(this.signer, chain)
    const populatedTx = await this.populateWithdrawTx(
      chain,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      transferRootHash,
      rootTotalAmount,
      transferIdTreeIndex,
      siblings,
      totalLeaves
    )
    return this.sendTransaction(populatedTx, chain)
  }

  async populateWithdrawTx (
    chain: TChain,
    recipient: string,
    amount: BigNumberish,
    transferNonce: string,
    bonderFee: BigNumberish,
    amountOutMin: BigNumberish,
    deadline: number,
    transferRootHash: string,
    rootTotalAmount: BigNumberish,
    transferIdTreeIndex: number,
    siblings: string[],
    totalLeaves: number
  ) {
    chain = this.toChainModel(chain)
    const txOptions = await this.txOverrides(chain)
    const args = [
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      transferRootHash,
      rootTotalAmount,
      transferIdTreeIndex,
      siblings,
      totalLeaves,
      txOptions
    ] as const

    const bridge = await this.getBridgeContract(chain)
    return bridge.populateTransaction.withdraw(...args)
  }

  async populateWithdrawTransferTx (sourceChain: TChain, destinationChain: TChain, transferIdOrTransactionHash: string): Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    const wp = new WithdrawalProof(this.network, transferIdOrTransactionHash)
    await wp.generateProof()
    wp.checkWithdrawable()
    const {
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      transferRootHash,
      rootTotalAmount,
      transferIdTreeIndex,
      siblings,
      totalLeaves
    } = wp.getTxPayload()
    return this.populateWithdrawTx(
      wp.transfer.destinationChain,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      transferRootHash!,
      rootTotalAmount!,
      transferIdTreeIndex!,
      siblings!,
      totalLeaves!
    )
  }

  async withdrawTransfer (sourceChain: TChain, destinationChain: TChain, transferIdOrTransactionHash: string): Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    const populatedTx = await this.populateWithdrawTransferTx(sourceChain, destinationChain, transferIdOrTransactionHash)
    return this.sendTransaction(populatedTx, destinationChain)
  }

  async getWithdrawProof (sourceChain: TChain, destinationChain: TChain, transferIdOrTransactionHash: string): Promise<any> {
    sourceChain = this.toChainModel(sourceChain)
    const wp = new WithdrawalProof(this.network, transferIdOrTransactionHash)
    return wp.generateProof()
  }

  setPriceFeedApiKeys (apiKeys: ApiKeys = {}): void {
    this.priceFeedApiKeys = apiKeys
    this.priceFeed.setApiKeys(this.priceFeedApiKeys)
  }

  async needsApproval (
    amount: TAmount,
    sourceChain: TChain,
    address?: string,
    destinationChain?: TChain // this param was later added hence it's after the address param for backward compatibility
  ): Promise<boolean> {
    const token = this.getCanonicalToken(sourceChain)
    const isHTokenTransfer = false
    const spender = this.getSendApprovalAddress(sourceChain, isHTokenTransfer, destinationChain)
    return token.needsApproval(spender, amount, address)
  }

  async needsHTokenApproval (
    amount: TAmount,
    sourceChain: TChain,
    address?: string,
    destinationChain?: TChain // this param was later added hence it's after the address param for backward compatibility
  ): Promise<boolean> {
    const token = this.getCanonicalToken(sourceChain)
    const isHTokenTransfer = true
    const spender = this.getSendApprovalAddress(sourceChain, isHTokenTransfer, destinationChain)
    return token.needsApproval(spender, amount, address)
  }

  parseUnits (value: TAmount, decimals?: number):BigNumber {
    value = value.toString() || '0'
    const token = this.toTokenModel(this.tokenSymbol)
    return parseUnits(value, decimals ?? token.decimals)
  }

  formatUnits (value: TAmount, decimals?: number):number {
    value = value.toString() || '0'
    const token = this.toTokenModel(this.tokenSymbol)
    return Number(formatUnits(value, decimals ?? token.decimals))
  }

  calcAmountOutMin (amountOut: TAmount, slippageTolerance: number): BigNumber {
    amountOut = BigNumber.from(amountOut.toString())
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    return amountOut.mul(minBps).div(10000)
  }

  async isDestinationChainPaused (destinationChain: TChain): Promise<boolean> {
    destinationChain = this.toChainModel(destinationChain)
    const l1Bridge = await this.getL1Bridge()
    const isPaused = await l1Bridge.isChainIdPaused(destinationChain.chainId)
    return isPaused
  }

  // chains that the asset supports
  override get supportedChains (): string[] {
    const supported = new Set()
    const token = this.toTokenModel(this.tokenSymbol)
    for (const chain in this.chains) {
      if (this.addresses[token.canonicalSymbol][chain]) {
        supported.add(chain)
      }
    }
    return Array.from(supported) as string[]
  }

  // L2 chains that the asset supports to LP
  get supportedLpChains (): string[] {
    const token = this.toTokenModel(this.tokenSymbol)
    const supported = new Set()
    const nonAmmAssets = this.getNonAmmAssets()
    for (const chain of this.supportedChains) {
      if (chain === ChainSlug.Ethereum || token.canonicalSymbol === TokenModel.HOP) {
        continue
      }
      if (nonAmmAssets.has(token.canonicalSymbol)) {
        continue
      }
      supported.add(chain)
    }
    return Array.from(supported) as string[]
  }

  getSupportedLpChains (): string[] {
    return this.supportedLpChains
  }

  getNonAmmAssets (): Set<string> {
    const list = new Set([CanonicalToken.HOP])
    if (this.network === NetworkSlug.Goerli) {
      list.add(CanonicalToken.USDT)
      list.add(CanonicalToken.DAI)
      list.add(CanonicalToken.UNI)
    }

    return list
  }

  async getAccountLpBalance (chain: TChain, account?: string): Promise<BigNumber> {
    const lpToken = this.getSaddleLpToken(chain)
    const balance = await lpToken.balanceOf(account)
    return balance
  }

  async getAccountLpCanonicalBalance (chain: TChain, account?: string): Promise<BigNumber> {
    const token = this.toTokenModel(this.tokenSymbol)
    const lpToken = this.getSaddleLpToken(chain)
    const balance = await lpToken.balanceOf(account)
    const amm = this.getAmm(chain)
    const virtualPrice = await amm.getVirtualPrice()
    const canonicalBalance = balance.mul(virtualPrice).div(parseUnits('1', 18))
    return canonicalBalance
  }

  async getAccountLpCanonicalBalanceUsd (chain: TChain, account?: string) {
    const token = this.toTokenModel(this.tokenSymbol)
    const [balance, tokenPrice] = await Promise.all([
      this.getAccountLpCanonicalBalance(chain, account),
      this.getPriceByTokenSymbol(token.canonicalSymbol)
    ])
    if (balance.lte(0)) {
      return 0
    }
    const balanceFormatted = this.formatUnits(balance, 18)
    let balanceUsd = balanceFormatted * tokenPrice
    if (balanceUsd < 0) {
      balanceUsd = 0
    }
    return balanceUsd
  }

  async getPriceByTokenSymbol (tokenSymbol: string): Promise<number> {
    const timeStart = Date.now()
    const price = await this.priceFeed.getPriceByTokenSymbol(tokenSymbol)
    this.debugTimeLog('getPriceByTokenSymbol', timeStart)
    if (price == null) {
      throw new Error(`null price for token "${tokenSymbol}"`)
    }
    return price
  }

  private async isValidRelayerAndRelayerFee (relayer: string, relayerFee: BigNumber): Promise<boolean> {
    return (
      relayer !== constants.AddressZero ||
      relayerFee.eq(0)
    )
  }

  // TODO: This is a temporary solution. Should retrieve from onchain and cache value.
  private getLpFeeBps (chain: Chain): BigNumber {
    const defaultFeeBps = 4
    const customFeeBps: Record<string, number> = {
      [Chain.PolygonZk.slug]: 1,
      [Chain.Nova.slug]: 1
    }

    if (customFeeBps[chain.slug]) {
      return BigNumber.from(customFeeBps[chain.slug])
    }
    return BigNumber.from(defaultFeeBps)
  }
}

export default HopBridge
