import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait } from 'src/utils'
import chalk from 'chalk'
import Logger from 'src/logger'
import { UINT256 } from 'src/constants'
import queue from 'src/watchers/helpers/queue'

interface TokenConfig {
  label: string
  contract: Contract
}

interface UniswapConfig {
  router: Partial<TokenConfig>
  factory: Partial<TokenConfig>
  exchange: Partial<TokenConfig>
}

interface Config {
  label: string
  token0: TokenConfig
  token1: TokenConfig
  uniswap: UniswapConfig
  wallet: any
  minThreshold: number
  maxTradeAmount: number
}

interface Token {
  label: string
  contract: Contract
}

class ArbBot {
  logger: Logger
  uniswapRouter: Contract
  uniswapFactory: Contract
  uniswapExchange: Contract
  token0: Token
  token1: Token
  wallet: any
  accountAddress: string
  minThreshold: number
  maxTradeAmount: number
  ready: boolean = false
  pollTimeSec: number = 10
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
      `Starting ${this.token0.label}<->${this.token1.label} arbitrage bot`
    )
    this.logger.log(`maxTradeAmount: ${this.maxTradeAmount}`)
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
          this.logger.log(`Rechecking in ${this.pollTimeSec} seconds`)
          await wait(this.pollTimeSec * 1e3)
        } catch (err) {
          this.logger.error('arb bot error:', err.message)
          await wait(this.pollTimeSec * 1e3)
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

  public async getToken0AmountOut (amount: number) {
    const path = [this.token0.contract.address, this.token1.contract.address]
    return this.getAmountOut(path, amount)
  }

  public async getToken1AmountOut (amount: number) {
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
    this.wallet = config.wallet
    this.minThreshold = config.minThreshold
    this.maxTradeAmount = config.maxTradeAmount
    this.uniswapRouter = config.uniswap.router.contract
    this.uniswapFactory = config.uniswap.factory.contract
    this.uniswapExchange = config.uniswap.exchange.contract
    this.token0 = {
      label: config.token0.label,
      contract: config.token0.contract
    }
    this.token1 = {
      label: config.token1.label,
      contract: config.token1.contract
    }

    this.accountAddress = await this.wallet.getAddress()
    this.ready = true
  }

  private async getTokenBalance (token: Token) {
    const balance = await token.contract.balanceOf(this.accountAddress)
    const formattedBalance = Number(formatUnits(balance, 18))
    return formattedBalance
  }

  private async approveToken (token: Token) {
    const approveAmount = BigNumber.from(UINT256)
    const approved = await token.contract.allowance(
      this.accountAddress,
      this.uniswapRouter.address
    )

    if (approved.lt(approveAmount)) {
      return token.contract.approve(
        this.uniswapRouter.address,
        approveAmount.toString()
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

  private async getAmountOut (path: string[], amount: number) {
    const amountIn = parseUnits(amount.toString(), 18)
    const amountsOut = await this.uniswapRouter?.getAmountsOut(amountIn, path)
    const amountOut = Number(formatUnits(amountsOut[1].toString(), 18))
    return amountOut
  }

  private async checkBalances () {
    const token0Balance = await this.getToken0Balance()
    this.logger.log(`${this.token0.label} balance: ${token0Balance}`)

    const token1Balance = await this.getToken1Balance()
    this.logger.log(`${this.token1.label} balance: ${token1Balance}`)
  }

  private async checkArbitrage () {
    const check = async (pathTokens: Token[], execute: boolean = false) => {
      this.logger.debug(
        `Checking for arbitrage opportunity. ${pathTokens[0].label}, ${pathTokens[1].label}`
      )
      const reserves = await this.getReserves()
      this.logger.log(`reserve 0: ${reserves[0]}`)
      this.logger.log(`reserve 1: ${reserves[1]}`)
      const [token0, token1] = pathTokens
      const token0Balance = await this.getTokenBalance(token0)
      const delta = Math.abs(reserves[0] - reserves[1])
      let token0TradeAmount = Math.min(
        Math.max(token0Balance, this.maxTradeAmount),
        delta / 2,
        100_000
      )
      if (token0TradeAmount <= 0.01) {
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

      const shouldArb = token0AmountOut > token0TradeAmount * this.minThreshold
      if (!execute) {
        return shouldArb
      }

      this.logger.debug(
        `${token0TradeAmount} ${token0.label} = ${token0AmountOut} ${token1.label}`
      )

      if (!shouldArb) {
        this.logger.debug('No abitrage opportunity')
        return
      }

      this.cache[cacheKey] = true
      const profit = token0AmountOut - token0TradeAmount
      this.logger.log(
        chalk.green(
          `Arbitrage opportunity: ${token0.label} 🡒 ${token1.label} (+${profit} ${token1.label})`
        )
      )

      const tx = await this.trade(pathTokens, token0TradeAmount)
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

  @queue
  private async trade (
    pathTokens: Token[],
    amountInNum: number,
    amountOutMinNum: number = 0
  ) {
    const amountIn = parseUnits(amountInNum.toString(), 18)
    const amountOutMin = parseUnits(amountOutMinNum.toString(), 18)
    const deadline = (Date.now() / 1000 + 300) | 0
    const path = pathTokens.map(token => token.contract.address)
    this.logger.log('trade params:')
    this.logger.log('amountIn:', amountInNum)
    this.logger.log('amountOutMin:', amountOutMinNum)
    this.logger.log(
      'pathTokens:',
      pathTokens.map(token => token.label).join(', ')
    )
    this.logger.log('path:', path.join(', '))
    this.logger.log('deadline:', deadline)

    const inputToken = pathTokens[0]
    const pathToken0Balance = await this.getTokenBalance(inputToken)
    if (pathToken0Balance < amountInNum) {
      throw new Error(
        `Not enough ${inputToken.label} tokens. Need ${amountInNum}, have ${pathToken0Balance}`
      )
    }

    return this.uniswapRouter?.swapExactTokensForTokens(
      amountIn.toString(),
      amountOutMin,
      path,
      this.accountAddress,
      deadline
    )
  }

  async getReserves () {
    const reserves = await this.uniswapExchange.getReserves()
    const reserve0 = Number(formatUnits(reserves[0], 18))
    const reserve1 = Number(formatUnits(reserves[1], 18))
    return [reserve0, reserve1]
  }

  private async startEventWatcher () {
    const SWAP_EVENT = 'Swap'
    this.uniswapExchange
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
}

export default ArbBot
