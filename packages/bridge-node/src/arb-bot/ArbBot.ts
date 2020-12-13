import '../moduleAlias'
import { Contract, BigNumber } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import chalk from 'chalk'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import erc20Artifact from '@hop-exchange/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import uniswapFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Library.sol/Factory.json'
import uniswapV2PairArtifact from '../abi/UniswapV2Pair.json'

const wait = async (t: number) => {
  return new Promise(resolve => setTimeout(() => resolve(), t))
}

const UINT256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

interface TokenConfig {
  label: string
  address: string
}

interface UniswapConfig {
  router: Partial<TokenConfig>
  factory: Partial<TokenConfig>
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

  async tilReady () {
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

    this.uniswapRouter = new Contract(
      config.uniswap.router.address,
      uniswapRouterArtifact.abi,
      this.wallet
    )

    this.uniswapFactory = new Contract(
      config.uniswap.factory.address,
      uniswapFactoryArtifact.abi,
      this.wallet
    )

    this.token0 = {
      label: config.token0.label,
      contract: new Contract(
        config.token0.address,
        erc20Artifact.abi,
        this.wallet
      )
    }

    this.token1 = {
      label: config.token1.label,
      contract: new Contract(
        config.token1.address,
        erc20Artifact.abi,
        this.wallet
      )
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

  private async approveTokens () {
    let tx = await this.approveToken(this.token0)
    if (tx) {
      console.log(`${this.token0.label} approve tx: ${tx?.hash}`)
      await tx?.wait()
    }

    tx = await this.approveToken(this.token1)
    if (tx) {
      console.log(`${this.token1.label} approve tx: ${tx?.hash}`)
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
    console.log(`${this.token0.label} balance: ${token0Balance}`)

    const token1Balance = await this.getToken1Balance()
    console.log(`${this.token1.label} balance: ${token1Balance}`)
  }

  private async checkArbitrage () {
    const token0AmountOut = await this.getToken0AmountOut()
    const token1AmountOut = await this.getToken1AmountOut()
    const cacheKey = `${token0AmountOut},${token1AmountOut}`
    if (this.cache[cacheKey]) {
      return
    }

    this.cache[cacheKey] = true

    console.log('Checking for arbitrage opportunity')
    console.log(
      `${this.arbitrageAmount} ${this.token0.label} = ${token0AmountOut} ${this.token1.label}`
    )
    console.log(
      `${this.arbitrageAmount} ${this.token1.label} = ${token1AmountOut} ${this.token0.label}`
    )

    let tx: any
    if (token0AmountOut > this.arbitrageAmount * this.minThreshold) {
      const profit = token0AmountOut - this.arbitrageAmount
      console.log(
        chalk.green(
          `Arbitrage opportunity: ${this.token0.label} 🡒 ${this.token1.label} (+${profit} ${this.token1.label})`
        )
      )

      const path = [this.token0.contract.address, this.token1.contract.address]
      tx = await this.trade(path, this.arbitrageAmount)
      console.log(chalk.yellow(`trade tx: ${tx?.hash}`))
      await tx?.wait()
    }

    if (token1AmountOut > this.arbitrageAmount * this.minThreshold) {
      const profit = token1AmountOut - this.arbitrageAmount
      console.log(
        chalk.green(
          `Arbitrage opportunity: ${this.token1.label} 🡒 ${this.token0.label} (+${profit} ${this.token0.label})`
        )
      )

      const path = [this.token1.contract.address, this.token0.contract.address]
      tx = await this.trade(path, this.arbitrageAmount)
      console.log(chalk.yellow(`trade tx: ${tx?.hash}`))
      await tx?.wait()
    }

    if (!tx) {
      console.log('No abitrage opportunity')
    }

    this.cache[cacheKey] = false
  }

  private async trade (
    path: string[],
    amountInNum: number,
    amountOutMinNum: number = 0
  ) {
    const amountIn = parseUnits(amountInNum.toString(), 18)
    const amountOutMin = parseUnits(amountOutMinNum.toString(), 18)
    const deadline = (Date.now() / 1000 + 300) | 0
    return this.uniswapRouter?.swapExactTokensForTokens(
      amountIn.toString(),
      amountOutMin,
      path,
      this.accountAddress,
      deadline
    )
  }

  private async startWatcher () {
    const pairAddress = await this.uniswapFactory?.getPair(
      this.token0.contract.address,
      this.token1.contract.address
    )
    const pair = new Contract(
      pairAddress,
      uniswapV2PairArtifact.abi,
      this.wallet
    )

    const SWAP_EVENT = 'Swap'
    pair.on(SWAP_EVENT, event => {
      console.log('Detected swap event')
      this.checkArbitrage()
    })
  }

  public async start () {
    console.log('Starting arbitrage bot')
    await this.tilReady()
    console.log(`account address: ${this.accountAddress}`)

    await this.checkBalances()
    await this.approveTokens()
    this.startWatcher()

    while (true) {
      try {
        await this.checkArbitrage()
        await this.checkBalances()
        console.log(`Rechecking in ${this.pollTimeSec} seconds`)
        await wait(this.pollTimeSec * 1e3)
      } catch (err) {
        console.error(err)
      }
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
}

export default ArbBot
