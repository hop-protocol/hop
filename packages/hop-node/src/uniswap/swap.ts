import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import erc20Abi from '@hop-protocol/core/abi/generated/MockERC20.json'
import wallets from 'src/wallets'
import { BigNumber, Contract, constants } from 'ethers'
import { CurrencyAmount, Ether, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool, Route, SwapRouter, TICK_SPACINGS, TickMath, Trade, nearestUsableTick } from '@uniswap/v3-sdk'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

const logger = new Logger({
  tag: 'Uniswap'
})

type Immutables = {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: BigNumber
}

type State = {
  liquidity: BigNumber
  sqrtPriceX96: BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

async function getPoolImmutables (poolContract: Contract) {
  const immutables: Immutables = {
    factory: await poolContract.factory(),
    token0: await poolContract.token0(),
    token1: await poolContract.token1(),
    fee: await poolContract.fee(),
    tickSpacing: await poolContract.tickSpacing(),
    maxLiquidityPerTick: await poolContract.maxLiquidityPerTick()
  }
  return immutables
}

async function getPoolState (poolContract: Contract) {
  const slot = await poolContract.slot0()
  const PoolState: State = {
    liquidity: await poolContract.liquidity(),
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6]
  }
  return PoolState
}

async function getPool (poolContract: Contract) {
  const { chainId } = await poolContract.provider.getNetwork()
  const immutables = await getPoolImmutables(poolContract)
  const state = await getPoolState(poolContract)

  const token0 = getToken(
    immutables.token0,
    poolContract.provider
  )

  const token1 = getToken(
    immutables.token1,
    poolContract.provider
  )

  const token0Decimals = Number((await token0.decimals()).toString())
  const token1Decimals = Number((await token1.decimals()).toString())

  const token0Symbol = await token0.symbol()
  const token1Symbol = await token1.symbol()

  const token0Name = await token0.name()
  const token1Name = await token1.name()

  const TokenA = new Token(chainId, immutables.token0, token0Decimals, token0Symbol, token0Name)
  const TokenB = new Token(chainId, immutables.token1, token1Decimals, token1Symbol, token1Name)

  const liquidity = state.liquidity.toString()
  const feeAmount = immutables.fee
  const pool = new Pool(
    TokenA,
    TokenB,
    feeAmount,
    state.sqrtPriceX96.toString(),
    liquidity,
    state.tick,
    [
      {
        index: nearestUsableTick(TickMath.MIN_TICK, (TICK_SPACINGS as any)[feeAmount]),
        liquidityNet: liquidity,
        liquidityGross: liquidity
      },
      {
        index: nearestUsableTick(TickMath.MAX_TICK, (TICK_SPACINGS as any)[feeAmount]),
        liquidityNet: BigNumber.from(liquidity).mul(-1).toString(),
        liquidityGross: liquidity
      }
    ]
  )

  return pool
}

function getToken (address: string, provider: any) {
  return new Contract(
    address,
    erc20Abi,
    provider
  )
}

export type Config = {
  chain: string
  fromToken: string
  toToken: string
  amount: number
  max?: boolean
  recipient?: string
  slippage?: number
  deadline?: number
}

const addresses: any = {
  ethereum: {
    swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    ethPools: {
      USDC: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
      USDT: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
      DAI: '0x60594a405d53811d3bc4766596efd80fd545a270',
      MATIC: '0x290A6a7460B308ee3F19023D2D00dE604bcf5B42'
    }
  },
  optimism: {
    swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    ethPools: {
      USDC: '0xc2c0786e85ac9b0b223966d040ebc641fa44225e',
      USDT: '0xcf438c19332d507326210da527fb9cf792fd3e18',
      DAI: '0x2e9c575206288f2219409289035facac0b670c2f'
    }
  },
  arbitrum: {
    swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    ethPools: {
      USDC: '0x17c14d2c404d167802b16c450d3c99f88f2c4f4d',
      USDT: '0x641c00a822e8b671738d32a431a4fb6074e5c79d'
    }
  }
}

export async function swap (config: Config) {
  let { chain, fromToken, toToken, amount, max, slippage, recipient, deadline } = config
  if (toToken !== 'ETH') {
    throw new Error('only ETH as the "to" token is supported at this time')
  }
  if (!addresses[chain]) {
    throw new Error(`chain "${chain}" currently not supported at at this time`)
  }
  const { swapRouter, ethPools } = addresses[chain]
  const wallet = wallets.get(chain)
  const poolAddress = ethPools[fromToken]
  if (!poolAddress) {
    throw new Error(`"from" token "${fromToken}" is not supported at this time. Supported options are ${Object.keys(ethPools).join(',')}`)
  }
  if (amount && max) {
    throw new Error('only "amount" or "max" can be set, but not both')
  }

  logger.debug('fetching pool information')

  const poolContract = new Contract(
    poolAddress,
    IUniswapV3PoolABI,
    wallet.provider
  )

  const pool = await getPool(poolContract)
  const token0 = getToken(
    pool.token0.address,
    wallet
  )

  const token1 = getToken(
    pool.token1.address,
    wallet
  )

  let sourceToken = token0
  let routeToken0: any = pool.token0
  let routeToken1: any = pool.token1

  const token0Symbol = await token0.symbol()
  if (token0Symbol === 'WETH' || token0Symbol === 'ETH') {
    sourceToken = token1
    const tmp = routeToken0
    routeToken0 = routeToken1
    routeToken1 = tmp
  }

  if (toToken === 'ETH') {
    routeToken1 = Ether.onChain(chainSlugToId(chain)!) // eslint-disable-line
  }

  const sender = await wallet.getAddress()
  const balance = await sourceToken.balanceOf(sender)
  const decimals = Number((await sourceToken.decimals()).toString())

  let parsedAmount: BigNumber
  if (max) {
    parsedAmount = balance
    amount = Number(formatUnits(parsedAmount, decimals))
  } else {
    parsedAmount = parseUnits(amount.toString(), decimals)
  }

  const trade = await Trade.fromRoute(
    new Route([pool], routeToken0, routeToken1),
    CurrencyAmount.fromRawAmount(routeToken0, parsedAmount.toString()),
    TradeType.EXACT_INPUT
  )

  const slippageTolerance = new Percent((slippage ?? 1) * 100, 10000)
  recipient = recipient ?? sender
  deadline = (Date.now() / 1000 + (deadline ?? 300)) | 0

  const { calldata, value } = SwapRouter.swapCallParameters(trade, {
    slippageTolerance,
    recipient,
    deadline
  })

  if (balance.lt(parsedAmount)) {
    throw new Error(`not enough ${fromToken} balance`)
  }

  logger.debug(`attempting to swap ${amount} ${fromToken} for ${toToken}`)

  const allowance = await sourceToken.allowance(sender, swapRouter)
  if (allowance.lt(parsedAmount)) {
    const tx = await sourceToken.approve(swapRouter, constants.MaxUint256)
    logger.info(`approval tx: ${tx.hash}`)
    logger.debug('waiting for receipt')
    await tx.wait()
  }

  return await wallet.sendTransaction({
    to: swapRouter,
    data: calldata,
    value
  })
}
