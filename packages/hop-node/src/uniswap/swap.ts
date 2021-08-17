import wallets from 'src/wallets'
import { BigNumber, Contract } from 'ethers'
import { Chain } from 'src/constants'
import { CurrencyAmount, Ether, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool, Route, SwapRouter, TICK_SPACINGS, TickMath, Trade, nearestUsableTick } from '@uniswap/v3-sdk'
import { erc20Abi } from '@hop-protocol/core/abi'
import { parseUnits } from 'ethers/lib/utils'

interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: BigNumber;
}

interface State {
  liquidity: BigNumber;
  sqrtPriceX96: BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
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

  const TokenA = new Token(1, immutables.token0, token0Decimals, token0Symbol, token0Name)
  const TokenB = new Token(1, immutables.token1, token1Decimals, token1Symbol, token1Name)
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
  fromToken: string
  toToken: string
  amount: number
  recipient?: string
  slippage?: number
  deadline?: number
}

const swapRouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
const ethPools: {[key: string]: string} = {
  USDC: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
  USDT: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
  DAI: '0x60594a405d53811d3bc4766596efd80fd545a270'
}

export async function swap (config: Config) {
  let { fromToken, toToken, amount, slippage, recipient, deadline } = config
  if (toToken !== 'ETH') {
    throw new Error('only ETH as the "to" token is not supported at this time')
  }
  const wallet = wallets.get(Chain.Ethereum)
  const poolAddress = ethPools[fromToken]
  if (!poolAddress) {
    throw new Error(`"from" token "${fromToken}" is not supported at this time. Supported options are ${Object.keys(ethPools).join(',')}`)
  }
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

  const decimals = Number((await token0.decimals()).toString())
  const parsedAmount = parseUnits(amount.toString(), decimals)
  const trade = await Trade.fromRoute(
    new Route([pool], pool.token0, toToken === 'ETH' ? Ether.onChain(1) : pool.token1),
    CurrencyAmount.fromRawAmount(pool.token0, parsedAmount.toString()),
    TradeType.EXACT_INPUT
  )

  const sender = await wallet.getAddress()
  const slippageTolerance = new Percent((slippage || 1) * 100, 10000)
  recipient = recipient || sender
  deadline = (Date.now() / 1000 + (deadline || 300)) | 0

  const { calldata, value } = SwapRouter.swapCallParameters(trade, {
    slippageTolerance,
    recipient,
    deadline
  })

  const balance = await token0.balanceOf(sender)
  if (balance.lt(parsedAmount)) {
    throw new Error(`not enough ${fromToken} balance`)
  }

  console.log(`attempting to swap ${amount} ${fromToken} for ${toToken}`)

  const allowance = await token0.allowance(sender, swapRouter)
  if (allowance.lt(parsedAmount)) {
    const tx = await token0.approve(swapRouter, parsedAmount)
    console.log(`approval tx: ${tx.hash}`)
    console.log('waiting for receipt')
    await tx.wait()
  }

  return wallet.sendTransaction({
    to: swapRouter,
    data: calldata,
    value
  })
}
