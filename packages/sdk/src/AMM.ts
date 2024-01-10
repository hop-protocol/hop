import Base, { BaseConstructorOptions, ChainProviders } from './Base'
import getBlockNumberFromDate from './utils/getBlockNumberFromDate'
import shiftBNDecimals from './utils/shiftBNDecimals'
import { BigNumber, BigNumberish, constants } from 'ethers'
import { Chain } from './models'
import { SecondsInDay, TokenIndex, TokenSymbol } from './constants'
import { Swap__factory } from '@hop-protocol/core/contracts/factories/generated/Swap__factory'
import { TAmount, TChain, TProvider } from './types'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { formatUnits } from 'ethers/lib/utils'
import { rateLimitRetry } from './utils/rateLimitRetry'

export type AmmConstructorOptions = {
  tokenSymbol?: TokenSymbol,
  chain?: TChain,
} & BaseConstructorOptions

/**
 * Class representing AMM contract
 * @namespace AMM
 */
class AMM extends Base {
  /** Chain model */
  public chain: Chain

  /** Token class instance */
  public tokenSymbol: TokenSymbol

  /**
   * @desc Instantiates AMM instance.
   * Returns a new Hop AMM SDK instance.
   * @param networkOrOptionsObject - L1 network name (e.g. 'mainnet', 'goerli')
   * @param tokenSymbol - Token model
   * @param chain - Chain model
   * @param signer - Ethers `Signer` for signing transactions.
   * @Returns Hop AMM instance
   * @example
   *```js
   *import { AMM, Chain } from '@hop-protocol/sdk'
   *
   *const amm = new AMM('mainnet', 'USDC', Chain.Gnosis)
   *```
   */
  constructor (
    networkOrOptionsObject: string | AmmConstructorOptions,
    tokenSymbol?: TokenSymbol,
    chain?: TChain,
    signer?: TProvider,
    chainProviders?: ChainProviders
  ) {
    super(networkOrOptionsObject, signer, chainProviders)
    if (networkOrOptionsObject instanceof Object) {
      const options = networkOrOptionsObject as AmmConstructorOptions
      if (tokenSymbol || chain || signer || chainProviders) {
        throw new Error('expected only single options parameter')
      }
      tokenSymbol = options.tokenSymbol
      chain = options.chain
    }

    if (!tokenSymbol) {
      throw new Error('token is required')
    }
    chain = this.toChainModel(chain!)
    if (chain) {
      this.chain = chain
    }
    this.tokenSymbol = tokenSymbol
  }

  /**
   * @desc Returns hop AMM instance with signer connected. Used for adding or changing signer.
   * @param signer - Ethers `Signer` for signing transactions.
   * @returns Hop AMM instance with connected signer.
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
  public connect (signer: TProvider): AMM {
    return new AMM({
      network: this.network,
      tokenSymbol: this.tokenSymbol,
      chain: this.chain,
      signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled
    })
  }

  /**
   * @desc Sends transaction to add liquidity to AMM.
   * @param amount0Desired - Amount of token #0 in smallest unit
   * @param amount1Desired - Amount of token #1 in smallest unit
   * @param minToMint - Minimum amount of LP token to mint in order for
   * transaction to be successful.
   * @param deadline - Order deadline in seconds
   * @returns Ethers transaction object.
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
    deadline: BigNumberish = this.defaultDeadlineSeconds
  ): Promise<TransactionResponse> {
    const populatedTx = await this.populateAddLiquidityTx(amount0Desired, amount1Desired, minToMint, deadline)
    return this.sendTransaction(populatedTx, this.chain)
  }

  public async populateAddLiquidityTx (
    amount0Desired: TAmount,
    amount1Desired: TAmount,
    minToMint: TAmount = 0,
    deadline: BigNumberish = this.defaultDeadlineSeconds
  ): Promise<any> {
    deadline = this.normalizeDeadline(deadline)
    const amounts = [amount0Desired, amount1Desired]
    const saddleSwap = await this.getSaddleSwap()
    const payload = [
      amounts,
      minToMint,
      deadline
    ] as const

    const overrides = await this.txOverrides(this.chain)
    return saddleSwap.populateTransaction.addLiquidity(...payload, overrides)
  }

  /**
   * @desc Sends transaction to remove liquidity from AMM.
   * @param liquidityTokenAmount - Amount of LP tokens to burn.
   * @param amount0Min - Minimum amount of token #0 to receive in order
   * for transaction to be successful.
   * @param amount1Min - Minimum amount of token #1 to receive in order
   * for transaction to be successful.
   * transaction to be successful.
   * @param deadline - Order deadline in seconds
   * @returns Ethers transaction object.
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
    liquidityTokenAmount: TAmount,
    amount0Min: TAmount = 0,
    amount1Min: TAmount = 0,
    deadline: BigNumberish = this.defaultDeadlineSeconds
  ): Promise<TransactionResponse> {
    const populatedTx = await this.populateRemoveLiquidityTx(liquidityTokenAmount, amount0Min, amount1Min, deadline)
    return this.sendTransaction(populatedTx, this.chain)
  }

  public async populateRemoveLiquidityTx (
    liquidityTokenAmount: TAmount,
    amount0Min: TAmount = 0,
    amount1Min: TAmount = 0,
    deadline: BigNumberish = this.defaultDeadlineSeconds
  ): Promise<any> {
    deadline = this.normalizeDeadline(deadline)
    const saddleSwap = await this.getSaddleSwap()
    const amounts = [amount0Min, amount1Min]
    const payload = [
      liquidityTokenAmount,
      amounts,
      deadline
    ] as const

    const overrides = await this.txOverrides(this.chain)
    return saddleSwap.populateTransaction.removeLiquidity(...payload, overrides)
  }

  public async removeLiquidityOneToken (
    lpAmount: TAmount,
    tokenIndex: number,
    amountMin: TAmount = BigNumber.from(0),
    deadline: BigNumberish = this.defaultDeadlineSeconds
  ): Promise<any> {
    deadline = this.normalizeDeadline(deadline)
    const saddleSwap = await this.getSaddleSwap()
    const payload = [
      lpAmount,
      tokenIndex,
      amountMin,
      deadline
    ] as const

    const overrides = await this.txOverrides(this.chain)
    return saddleSwap.removeLiquidityOneToken(
      ...payload,
      overrides
    )
  }

  public async removeLiquidityImbalance (
    amount0: TAmount,
    amount1: TAmount,
    maxBurnAmount: TAmount = BigNumber.from(0),
    deadline: BigNumberish = this.defaultDeadlineSeconds
  ): Promise<any> {
    deadline = this.normalizeDeadline(deadline)
    const saddleSwap = await this.getSaddleSwap()
    const amounts = [amount0, amount1]
    return saddleSwap.removeLiquidityImbalance(
      amounts,
      maxBurnAmount,
      deadline,
      await this.txOverrides(this.chain)
    )
  }

  public async calculateRemoveLiquidityOneToken (
    tokenAmount: TAmount,
    tokenIndex: number
  ): Promise<any> {
    const recipient = await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient address is required')
    }
    const saddleSwap = await this.getSaddleSwap()
    const overrides = await this.txOverrides(this.chain)
    return saddleSwap.calculateRemoveLiquidityOneToken(
      recipient,
      tokenAmount,
      tokenIndex,
      overrides
    )
  }

  public async calculateToHToken (amount: BigNumberish): Promise<BigNumber> {
    return this.calculateSwap(
      TokenIndex.CanonicalToken,
      TokenIndex.HopBridgeToken,
      amount
    )
  }

  public async calculateFromHToken (amount: BigNumberish): Promise<BigNumber> {
    return this.calculateSwap(
      TokenIndex.HopBridgeToken,
      TokenIndex.CanonicalToken,
      amount
    )
  }

  public async calculateAddLiquidityMinimum (
    amount0: TAmount,
    amount1: TAmount
  ): Promise<BigNumber> {
    const amounts = [amount0, amount1]
    const saddleSwap = await this.getSaddleSwap()
    const recipient = await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient address is required')
    }
    const isDeposit = true
    const total = await this.getReservesTotal()
    if (total.lte(0)) {
      return BigNumber.from(0)
    }

    const overrides = await this.txOverrides(this.chain)

    return saddleSwap.calculateTokenAmount(
      recipient,
      amounts,
      isDeposit,
      overrides
    )
  }

  public async calculateRemoveLiquidityMinimum (lpTokenAmount: TAmount): Promise<any> {
    const saddleSwap = await this.getSaddleSwap()
    const recipient = await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient address is required')
    }
    const overrides = await this.txOverrides(this.chain)
    return saddleSwap.calculateRemoveLiquidity(
      recipient,
      lpTokenAmount,
      overrides
    )
  }

  public async calculateRemoveLiquidityMinimumLpTokens (
    amount0: TAmount,
    amount1: TAmount
  ): Promise<BigNumber> {
    const amounts = [amount0, amount1]
    const saddleSwap = await this.getSaddleSwap()
    const recipient = await this.getSignerAddress()
    if (!recipient) {
      throw new Error('recipient address is required')
    }

    const isDeposit = false
    const overrides = await this.txOverrides(this.chain)

    return saddleSwap.calculateTokenAmount(
      recipient,
      amounts,
      isDeposit,
      overrides
    )
  }

  /**
   * @desc Returns the address of the L2 canonical token.
   * @returns address
   */
  public async getCanonicalTokenAddress (): Promise<string> {
    return this.getL2CanonicalTokenAddress(this.tokenSymbol, this.chain)
  }

  /**
   * @desc Returns the address of the L2 hop token.
   * @returns address
   */
  public async getHopTokenAddress (): Promise<string> {
    return this.getL2HopBridgeTokenAddress(this.tokenSymbol, this.chain)
  }

  /**
   * @desc Returns the Saddle swap contract instance for the specified chain.
   * @returns Ethers contract instance.
   */
  public async getSaddleSwap (): Promise<any> {
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
    return Swap__factory.connect(saddleSwapAddress, provider)
  }

  public async getSwapFee (): Promise<number> {
    const saddleSwap = await this.getSaddleSwap()
    const data = await saddleSwap.swapStorage()
    const poolFeePrecision = 10
    const swapFee = data.swapFee
    return Number(formatUnits(swapFee.toString(), poolFeePrecision))
  }

  public async getYieldStatsForDay (unixTimestamp: number, days: number = 1): Promise<any> {
    if (this.tokenSymbol === 'HOP') {
      throw new Error('getYieldStatsForDay: Unsupported, there is no AMM for HOP token.')
    }
    const token = this.toTokenModel(this.tokenSymbol)
    const saddleSwap = await this.getSaddleSwap()

    const endTimestamp = unixTimestamp
    let endBlockNumber = await getBlockNumberFromDate(this.chain, endTimestamp)
    endBlockNumber = endBlockNumber - 10 // make sure block exists by adding a negative buffer to prevent rpc errors with gnosis rpc

    const callOverrides = {
      blockTag: endBlockNumber
    }

    const [reserve0, reserve1, data] = await Promise.all([
      saddleSwap.getTokenBalance(0, callOverrides),
      saddleSwap.getTokenBalance(1, callOverrides),
      saddleSwap.swapStorage(callOverrides)
    ])

    const startTimestamp = endTimestamp - (days * SecondsInDay)
    let startBlockNumber = await getBlockNumberFromDate(this.chain, startTimestamp)

    const tokenSwapEvents: any[] = []
    const perBatch = 2000
    let endBatchBlockNumber = Math.min(
      startBlockNumber + perBatch,
      endBlockNumber
    )
    while (startBlockNumber < endBlockNumber) {
      tokenSwapEvents.push(
        ...(await saddleSwap.queryFilter(
          saddleSwap.filters.TokenSwap(),
          startBlockNumber,
          endBatchBlockNumber
        ))
      )

      startBlockNumber = endBatchBlockNumber
      endBatchBlockNumber = Math.min(
        endBatchBlockNumber + perBatch,
        endBlockNumber
      )
    }

    const basisPoints = data.swapFee
    const FEE_DENOMINATOR = '10000000000' // 10**10
    const decimals = token.decimals

    let totalVolume = BigNumber.from(0)
    let totalFees = BigNumber.from(0)
    for (const event of tokenSwapEvents) {
      const tokensSold = event.args.tokensSold
      totalFees = totalFees.add(
        tokensSold
          .mul(BigNumber.from(basisPoints))
          .div(BigNumber.from(FEE_DENOMINATOR))
      )

      totalVolume = totalVolume.add(tokensSold)
    }

    const totalLiquidity = reserve0.add(reserve1)
    const totalLiquidityFormatted = Number(
      formatUnits(totalLiquidity, decimals)
    )
    const totalFeesFormatted = Number(formatUnits(totalFees, decimals))
    const totalVolumeFormatted = Number(formatUnits(totalVolume, decimals))

    return { totalFeesFormatted, totalLiquidityFormatted, totalVolume, totalVolumeFormatted }
  }

  public async getDailyVolume (): Promise<any> {
    const { volume, volumeFormatted } = await this.getYieldData()
    return {
      volume,
      volumeFormatted
    }
  }

  public async getApr (days: number = 1): Promise<any> {
    const { apr } = await this.getYieldData(days)
    return apr
  }

  public async getApy (days: number = 1): Promise<any> {
    const { apy } = await this.getYieldData(days)
    return apy
  }

  public async getYieldData (days: number = 1): Promise<any> {
    if (![1, 7, 30].includes(days)) {
      throw new Error('invalid arg: valid days are: 1, 7, 30')
    }

    const provider = this.chain.provider
    if (!provider) {
      throw new Error('expected provider')
    }
    const block = await provider.getBlock('latest')
    const endTimestamp = block.timestamp

    const {
      totalFeesFormatted: feesEarnedToday,
      totalLiquidityFormatted: totalLiquidityToday,
      totalVolume,
      totalVolumeFormatted
    } = await this.getYieldStatsForDay(endTimestamp, days)

    const { apr, apy } = this.calcYield(feesEarnedToday, totalLiquidityToday, days)

    return {
      apr: Math.max(apr, 0),
      apy: Math.max(apy, 0),
      volume: totalVolume,
      volumeFormatted: totalVolumeFormatted
    }
  }

  public calcYield (feesEarned: number, principal: number, days: number): any {
    const rate = feesEarned / principal
    const period = 365 / days
    const apr = rate * period
    const apy = (1 + rate) ** period - 1
    return { apr, apy }
  }

  public async getVirtualPrice (): Promise<BigNumber> {
    const saddleSwap = await this.getSaddleSwap()
    return saddleSwap.getVirtualPrice()
  }

  public async getPriceImpact (amount0: TAmount, amount1: TAmount): Promise<BigNumber> {
    const token = this.toTokenModel(this.tokenSymbol)
    const decimals = token.decimals
    const [virtualPrice, depositLpTokenAmount] = await Promise.all([
      this.getVirtualPrice(),
      this.calculateAddLiquidityMinimum(amount0, amount1)
    ])
    let tokenInputSum = BigNumber.from(amount0.toString()).add(
      BigNumber.from(amount1.toString())
    )

    // convert to 18 decimals
    tokenInputSum = shiftBNDecimals(tokenInputSum, 18 - decimals)

    const isWithdraw = false
    const priceImpact = this.calculatePriceImpact(
      tokenInputSum,
      depositLpTokenAmount,
      virtualPrice,
      isWithdraw
    )

    return priceImpact
  }

  public async getRemoveLiquidityPriceImpact (amount0: TAmount, amount1: TAmount): Promise<BigNumber> {
    const token = this.toTokenModel(this.tokenSymbol)
    const decimals = token.decimals
    const [virtualPrice, withdrawLpTokenAmount] = await Promise.all([
      this.getVirtualPrice(),
      this.calculateRemoveLiquidityMinimumLpTokens(amount0, amount1)
    ])
    let tokenInputSum = BigNumber.from(amount0.toString()).add(
      BigNumber.from(amount1.toString())
    )

    // convert to 18 decimals
    tokenInputSum = shiftBNDecimals(tokenInputSum, 18 - decimals)

    const isWithdraw = true
    const priceImpact = this.calculatePriceImpact(
      withdrawLpTokenAmount,
      tokenInputSum,
      virtualPrice,
      isWithdraw
    )

    return priceImpact
  }

  calculateSwap = rateLimitRetry(async (
    fromIndex: TokenIndex,
    toIndex: TokenIndex,
    amount: BigNumberish
  ) => {
    const saddleSwap = await this.getSaddleSwap()
    return saddleSwap.calculateSwap(fromIndex, toIndex, amount)
  })

  /**
   * @readonly
   * @desc The default deadline to use in seconds.
   * @returns Deadline in seconds
   */
  public get defaultDeadlineSeconds (): number {
    const defaultDeadlineMinutes = 30
    return (Date.now() / 1000 + defaultDeadlineMinutes * 60) | 0
  }

  /**
   * @desc Truncate any decimal places in deadline unix timestamp.
   * @param deadline - deadline timestamp
   * @returns Deadline in seconds
   */
  private normalizeDeadline (deadline: BigNumberish): number {
    return parseInt(deadline.toString(), 10)
  }

  isHighPriceImpact (priceImpact: BigNumber): boolean {
    // assumes that priceImpact has 18d precision
    const negOne = BigNumber.from(10)
      .pow(18 - 2)
      .mul(-1)
    return priceImpact.lte(negOne)
  }

  // We want to multiply the lpTokenAmount by virtual price
  // Deposits: (VP * output) / input - 1
  // Swaps: (1 * output) / input - 1
  // Withdraws: output / (input * VP) - 1
  private calculatePriceImpact (
    tokenInputAmount: BigNumber, // assumed to be 18d precision
    tokenOutputAmount: BigNumber,
    virtualPrice = BigNumber.from(10).pow(18),
    isWithdraw: boolean = false
  ): BigNumber {
    if (tokenInputAmount.eq(0) && tokenOutputAmount.eq(0)) {
      return constants.Zero
    }

    if (tokenInputAmount.lte(0)) {
      return constants.Zero
    }

    if (isWithdraw) {
      return tokenOutputAmount
        .mul(BigNumber.from(10).pow(36))
        .div(tokenInputAmount.mul(virtualPrice))
        .sub(BigNumber.from(10).pow(18))
    }

    return virtualPrice
      .mul(tokenOutputAmount)
      .div(tokenInputAmount)
      .sub(BigNumber.from(10).pow(18))
  }

  public async getReserves (): Promise<BigNumber[]> {
    const saddleSwap = await this.getSaddleSwap()
    return Promise.all([
      saddleSwap.getTokenBalance(0),
      saddleSwap.getTokenBalance(1)
    ])
  }

  public async getReservesTotal (): Promise<BigNumber> {
    const [reserve0, reserve1] = await this.getReserves()
    return reserve0.add(reserve1)
  }

  public async calculateAmountsForLpToken (lpTokenAmount: TAmount): Promise<BigNumber[]> {
    const account = this.signer ? await this.getSignerAddress() : constants.AddressZero
    const saddleSwap = await this.getSaddleSwap()
    return saddleSwap.calculateRemoveLiquidity(
      account,
      lpTokenAmount,
      await this.txOverrides(this.chain)
    )
  }

  public async calculateTotalAmountForLpToken (lpTokenAmount: TAmount): Promise<BigNumber> {
    const amounts = await this.calculateAmountsForLpToken(lpTokenAmount)
    return amounts[0].add(amounts[1])
  }
}

export default AMM
