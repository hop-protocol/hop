import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import { wait } from 'src/utils'
import chalk from 'chalk'
import Logger from 'src/logger'

const logger = new Logger('arbBot', { color: 'green' })

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
  token0: TokenConfig
  token1: TokenConfig
  uniswap: UniswapConfig
  wallet: any
  minThreshold: number
  arbitrageAmount: number
}

interface Token {
  label: string
  contract: Contract
}

class ArbBot {
  uniswapRouter: Contract
  uniswapFactory: Contract
  uniswapExchange: Contract
  token0: Token
  token1: Token
  wallet: any
  accountAddress: string
  minThreshold: number
  arbitrageAmount: number
  ready: boolean = false
  pollTimeSec: number = 10
  cache: any = {}

  constructor (config: Config) {
    this.init(config)
  }

  public async start () {
    logger.log(
      `Starting ${this.token0.label}<->${this.token1.label} arbitrage bot`
    )
    try {
      await this.tilReady()
      logger.log(`account address: ${this.accountAddress}`)

      await this.checkBalances()
      await this.approveTokens()
      this.startEventWatcher().catch(logger.error)

      while (true) {
        try {
          await this.checkArbitrage()
          await this.checkBalances()
          logger.log(`Rechecking in ${this.pollTimeSec} seconds`)
          await wait(this.pollTimeSec * 1e3)
        } catch (err) {
          logger.error('arb bot error:', err.message)
          await wait(this.pollTimeSec * 1e3)
        }
      }
    } catch (err) {
      logger.error('arb bot error:', err.message)
    }
  }

  public async getToken0Balance () {
    return this.getTokenBalance(this.token0)
  }

  public async getToken1Balance () {
    return this.getTokenBalance(this.token1)
  }

  public async getToken0AmountOut () {
    const path = [this.token0.contract.address, this.token1.contract.address]
    return this.getAmountOut(path)
  }

  public async getToken1AmountOut () {
    const path = [this.token1.contract.address, this.token0.contract.address]
    return this.getAmountOut(path)
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
    this.arbitrageAmount = config.arbitrageAmount
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
    const maxApproval = parseUnits('1000000', 18)
    const approveAmount = BigNumber.from(maxApproval)
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

  private async approveTokens () {
    let tx = await this.approveToken(this.token0)
    if (tx) {
      logger.log(`${this.token0.label} approve tx: ${tx?.hash}`)
      await tx?.wait()
    }

    tx = await this.approveToken(this.token1)
    if (tx) {
      logger.log(`${this.token1.label} approve tx: ${tx?.hash}`)
      await tx?.wait()
    }
  }

  private async getAmountOut (path: string[]) {
    const amountIn = parseUnits(this.arbitrageAmount.toString(), 18)
    const amountsOut = await this.uniswapRouter?.getAmountsOut(amountIn, path)
    const amountOut = Number(formatUnits(amountsOut[1].toString(), 18))
    return amountOut
  }

  private async checkBalances () {
    const token0Balance = await this.getToken0Balance()
    logger.log(`${this.token0.label} balance: ${token0Balance}`)

    const token1Balance = await this.getToken1Balance()
    logger.log(`${this.token1.label} balance: ${token1Balance}`)
  }

  private async checkArbitrage () {
    const token0AmountOut = await this.getToken0AmountOut()
    const token1AmountOut = await this.getToken1AmountOut()
    const cacheKey = `${token0AmountOut},${token1AmountOut}`
    if (this.cache[cacheKey]) {
      return
    }

    this.cache[cacheKey] = true

    logger.log('Checking for arbitrage opportunity')
    logger.log(
      `${this.arbitrageAmount} ${this.token0.label} = ${token0AmountOut} ${this.token1.label}`
    )
    logger.log(
      `${this.arbitrageAmount} ${this.token1.label} = ${token1AmountOut} ${this.token0.label}`
    )

    let tx: any
    if (token0AmountOut > this.arbitrageAmount * this.minThreshold) {
      const profit = token0AmountOut - this.arbitrageAmount
      logger.log(
        chalk.green(
          `Arbitrage opportunity: ${this.token0.label} 🡒 ${this.token1.label} (+${profit} ${this.token1.label})`
        )
      )

      const pathTokens = [this.token0, this.token1]
      tx = await this.trade(pathTokens, this.arbitrageAmount)
      logger.log(chalk.yellow(`trade tx: ${tx?.hash}`))
      await tx?.wait()
    }

    if (token1AmountOut > this.arbitrageAmount * this.minThreshold) {
      const profit = token1AmountOut - this.arbitrageAmount
      logger.log(
        chalk.green(
          `Arbitrage opportunity: ${this.token1.label} 🡒 ${this.token0.label} (+${profit} ${this.token0.label})`
        )
      )

      const pathTokens = [this.token1, this.token0]
      tx = await this.trade(pathTokens, this.arbitrageAmount)
      logger.log(chalk.yellow(`trade tx: ${tx?.hash}`))
      await tx?.wait()
    }

    if (!tx) {
      logger.log('No abitrage opportunity')
    }

    this.cache[cacheKey] = false
  }

  private async trade (
    pathTokens: Token[],
    amountInNum: number,
    amountOutMinNum: number = 0
  ) {
    const amountIn = parseUnits(amountInNum.toString(), 18)
    const amountOutMin = parseUnits(amountOutMinNum.toString(), 18)
    const deadline = (Date.now() / 1000 + 300) | 0
    const path = pathTokens.map(token => token.contract.address)
    logger.log('trade params:')
    logger.log('amountIn:', amountInNum)
    logger.log('amountOutMin:', amountOutMinNum)
    logger.log(
      'pathTokens:',
      pathTokens.map(token => token.label)
    )
    logger.log('path:', path)
    logger.log('deadline:', deadline)

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

  private async startEventWatcher () {
    const SWAP_EVENT = 'Swap'
    this.uniswapExchange
      .on(SWAP_EVENT, async event => {
        logger.log('Detected swap event')
        try {
          await this.checkArbitrage()
        } catch (err) {
          logger.error('arb bot checkArbitrage error:', err.message)
        }
      })
      .on('error', err => {
        logger.error('arb bot swap event watcher error:', err.message)
      })
  }
}

export default ArbBot
