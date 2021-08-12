import '../moduleAlias'
import Logger from 'src/logger'
import chalk from 'chalk'
import queue from 'src/decorators/queue'
import { BigNumber, Contract, ethers } from 'ethers'
import { Chain } from 'src/constants'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { config as globalConfig } from 'src/config'
import { wait } from 'src/utils'

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1
}

interface TokenConfig {
  label: string
  contract: Contract
}

interface AmmConfig {
  saddleSwap: Partial<TokenConfig>
}

interface Config {
  label: string
  network: string
  token0: TokenConfig
  token1: TokenConfig
  tokenDecimals: number
  amm: AmmConfig
  wallet: any
  minThreshold: number
  maxTradeAmount: number
}

interface Token {
  label: string
  contract: Contract
}

class ArbBot {
  network: string
  logger: Logger
  saddleSwap: Contract
  token0: Token
  token1: Token
  tokenDecimals: number
  wallet: any
  accountAddress: string
  minThreshold: number
  maxTradeAmount: BigNumber = BigNumber.from(0)
  ready: boolean = false
  pollIntervalSec: number = 10
  cache: any = {}

  constructor (config: Config) {
    this.logger = new Logger({
      tag: 'arbBot',
      prefix: config.label,
      color: 'green'
    })
    this.init(config)
  }

  public async start () {
    this.logger.log(
      `Starting ${this.token0.label}↔${this.token1.label} arbitrage bot`
    )
    this.logger.log(`maxTradeAmount: ${this.formatUnits(this.maxTradeAmount)}`)
    this.logger.log(`minThreshold: ${this.minThreshold}`)
    try {
      await this.tilReady()
      this.logger.log(`account address: ${this.accountAddress}`)

      await this.checkBalances()
      await this.approveTokens()
      this.startEventWatcher().catch(this.logger.error)

      while (true) {
        try {
          await this.checkArbitrage()
          await this.checkBalances()
          this.logger.log(`Rechecking in ${this.pollIntervalSec} seconds`)
          await wait(this.pollIntervalSec * 1e3)
        } catch (err) {
          this.logger.error('arb bot error:', err.message)
          await wait(this.pollIntervalSec * 1e3)
        }
      }
    } catch (err) {
      this.logger.error('arb bot error:', err.message)
    }
  }

  public async getToken0Balance () {
    return this.getTokenBalance(this.token0)
  }

  public async getToken1Balance () {
    return this.getTokenBalance(this.token1)
  }

  public async getToken0AmountOut (amount: BigNumber) {
    const path = [this.token0.contract.address, this.token1.contract.address]
    return this.getAmountOut(path, amount)
  }

  public async getToken1AmountOut (amount: BigNumber) {
    const path = [this.token1.contract.address, this.token0.contract.address]
    return this.getAmountOut(path, amount)
  }

  private async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return this.tilReady()
  }

  private async init (config: Config) {
    this.network = config.network
    this.wallet = config.wallet
    this.minThreshold = config.minThreshold
    this.saddleSwap = config.amm.saddleSwap.contract
    this.token0 = {
      label: config.token0.label,
      contract: config.token0.contract
    }
    this.token1 = {
      label: config.token1.label,
      contract: config.token1.contract
    }
    this.tokenDecimals = config.tokenDecimals
    if (config.maxTradeAmount) {
      this.maxTradeAmount = this.parseUnits(config.maxTradeAmount.toString())
    }
    this.accountAddress = await this.wallet.getAddress()
    this.ready = true
  }

  private async getTokenBalance (token: Token) {
    return token.contract.balanceOf(this.accountAddress)
  }

  private async approveToken (token: Token) {
    this.logger.debug('approving tokens')
    const approveAmount = BigNumber.from(ethers.constants.MaxUint256)
    const approved = await token.contract.allowance(
      this.accountAddress,
      this.saddleSwap.address
    )

    if (approved.lt(approveAmount)) {
      return token.contract.approve(
        this.saddleSwap.address,
        approveAmount,
        await this.txOverrides()
      )
    }
  }

  @queue
  private async approveTokens () {
    let tx = await this.approveToken(this.token0)
    if (tx) {
      this.logger.log(`${this.token0.label} approve tx:`, chalk.yellow(tx.hash))
      await tx?.wait()
    }

    tx = await this.approveToken(this.token1)
    if (tx) {
      this.logger.log(`${this.token1.label} approve tx:`, chalk.yellow(tx.hash))
      await tx?.wait()
    }
  }

  private async getAmountOut (path: string[], amount: BigNumber) {
    const [tokenIndexFrom, tokenIndexTo] = await this.getTokenIndexes(path)
    if (amount.eq(0)) {
      return BigNumber.from(0)
    }
    const amountsOut = await this.saddleSwap.calculateSwap(
      tokenIndexFrom,
      tokenIndexTo,
      amount
    )
    return amountsOut
  }

  private async getTokenIndexes (path: string[]) {
    const tokenIndexFrom = Number(
      (await this.saddleSwap.getTokenIndex(path[0])).toString()
    )
    const tokenIndexTo = Number(
      (await this.saddleSwap.getTokenIndex(path[1])).toString()
    )

    return [tokenIndexFrom, tokenIndexTo]
  }

  private async checkBalances () {
    const token0Balance = await this.getToken0Balance()
    this.logger.log(
      `${this.token0.label} balance: ${this.formatUnits(token0Balance)}`
    )

    const token1Balance = await this.getToken1Balance()
    this.logger.log(
      `${this.token1.label} balance: ${this.formatUnits(token1Balance)}`
    )
  }

  private async checkArbitrage () {
    const check = async (pathTokens: Token[], execute: boolean = false) => {
      this.logger.debug(
        `Checking for arbitrage opportunity. ${pathTokens[0].label}, ${pathTokens[1].label}`
      )
      const reserves = await this.getReserves()
      this.logger.log(`reserve 0: ${this.formatUnits(reserves[0])}`)
      this.logger.log(`reserve 1: ${this.formatUnits(reserves[1])}`)
      const [token0, token1] = pathTokens
      const token0Balance = await this.getTokenBalance(token0)
      const delta = reserves[0].sub(reserves[1])
      let token0TradeAmount = this.maxTradeAmount
      if (token0Balance.lt(this.maxTradeAmount)) {
        token0TradeAmount = token0Balance
      }
      if (delta.div(2).lt(token0TradeAmount)) {
        token0TradeAmount = delta.div(2)
      }
      if (token0TradeAmount.lte(this.parseUnits('0.01'))) {
        this.logger.log(`No ${token0.label} token balance. Skipping.`)
        return
      }
      const token0AmountOut = await this.getAmountOut(
        pathTokens.map(x => x.contract.address),
        token0TradeAmount
      )
      const cacheKey = `${token0TradeAmount},${token0AmountOut}`
      if (this.cache[cacheKey]) {
        return
      }

      const shouldArb = token0AmountOut
        .mul(this.minThreshold * 100)
        .div(100)
        .gt(token0TradeAmount)
      if (!execute) {
        return shouldArb
      }

      this.logger.debug(
        `${this.formatUnits(token0TradeAmount)} ${
          token0.label
        } = ${this.formatUnits(token0AmountOut)} ${token1.label}`
      )

      if (!shouldArb) {
        this.logger.debug('No abitrage opportunity')
        return
      }

      this.cache[cacheKey] = true
      const profit = token0AmountOut.sub(token0TradeAmount)
      this.logger.log(
        chalk.green(
          `Arbitrage opportunity: ${token0.label} 🡒 ${token1.label} (+${profit} ${token1.label})`
        )
      )

      const slippageToleranceBps = 0.5 * 100
      const minBps = Math.ceil(10000 - slippageToleranceBps)
      const amountOutMin = token0AmountOut.mul(minBps).div(10000)
      const tx = await this.trade(pathTokens, token0TradeAmount, amountOutMin)
      this.logger.log(chalk.yellow(`trade tx: ${tx?.hash}`))
      await tx?.wait()

      if (!tx) {
        this.logger.debug('No abitrage opportunity')
      }

      this.cache[cacheKey] = false
    }

    await check([this.token0, this.token1], true)
    await check([this.token1, this.token0], true)
  }

  private async calcFromHTokenAmount (amount: BigNumber): Promise<BigNumber> {
    amount = BigNumber.from(amount.toString())
    if (amount.eq(0)) {
      return BigNumber.from(0)
    }
    const amountOut = await this.saddleSwap.calculateSwap(
      TokenIndex.HopBridgeToken,
      TokenIndex.CanonicalToken,
      amount
    )
    return amountOut
  }

  @queue
  private async trade (
    pathTokens: Token[],
    amountIn: BigNumber,
    amountOutMin: BigNumber = BigNumber.from(0)
  ) {
    const deadline = (Date.now() / 1000 + 300) | 0
    const path = pathTokens.map(token => token.contract.address)
    this.logger.log('trade params:')
    this.logger.log('amountIn:', this.formatUnits(amountIn))
    this.logger.log('amountOutMin:', this.formatUnits(amountOutMin))
    this.logger.log(
      'pathTokens:',
      pathTokens.map(token => token.label).join(', ')
    )
    this.logger.log('path:', path.join(', '))
    this.logger.log('deadline:', deadline)

    const inputToken = pathTokens[0]
    const pathToken0Balance = await this.getTokenBalance(inputToken)
    if (pathToken0Balance.lt(amountIn)) {
      throw new Error(
        `Not enough ${inputToken.label} tokens. Need ${amountIn}, have ${pathToken0Balance}`
      )
    }
    const [tokenIndexFrom, tokenIndexTo] = await this.getTokenIndexes(path)
    return this.saddleSwap.swap(
      tokenIndexFrom,
      tokenIndexTo,
      amountIn,
      amountOutMin,
      deadline
    )
  }

  async getReserves () {
    const reserves = await Promise.all([
      this.saddleSwap.getTokenBalance(0),
      this.saddleSwap.getTokenBalance(1)
    ])
    return reserves
  }

  private async startEventWatcher () {
    const SWAP_EVENT = 'TokenSwap'
    this.saddleSwap
      .on(SWAP_EVENT, async event => {
        this.logger.log('Detected swap event')
        try {
          await this.checkArbitrage()
        } catch (err) {
          this.logger.error('arb bot checkArbitrage error:', err.message)
        }
      })
      .on('error', err => {
        this.logger.error('arb bot swap event watcher error:', err.message)
      })
  }

  formatUnits (value: BigNumber) {
    return Number(formatUnits(value.toString(), this.tokenDecimals))
  }

  parseUnits (value: string | number) {
    return parseUnits(value.toString(), this.tokenDecimals)
  }

  async txOverrides (): Promise<any> {
    const txOptions: any = {}
    if (globalConfig.isMainnet) {
      if (this.network === Chain.Polygon) {
        // txOptions.gasLimit = 3000000
      }
      // TODO
    } else {
      txOptions.gasLimit = 5000000
      if (this.network === Chain.Optimism) {
        txOptions.gasPrice = 0
        txOptions.gasLimit = 8000000
      } else if (this.network === Chain.xDai) {
        txOptions.gasLimit = 5000000
      }
    }
    return txOptions
  }
}

export default ArbBot
