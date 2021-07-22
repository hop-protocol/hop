import wallets from 'src/wallets'
import { BigNumber, Contract } from 'ethers'
import { Chain } from 'src/constants'
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool, Route, SwapRouter, TICK_SPACINGS, TickMath, Trade, nearestUsableTick } from '@uniswap/v3-sdk'
import { erc20Abi } from '@hop-protocol/abi'
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
  const TokenA = new Token(1, immutables.token0, 6, 'USDC', 'USD Coin')
  const TokenB = new Token(1, immutables.token1, 18, 'WETH', 'Wrapped Ether')
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

export async function swap (amount: number) {
  console.log(`attempting to swap ${amount} USDC for ETH`)
  const parsedAmount = parseUnits(amount.toString(), 6)
  const wallet = wallets.get(Chain.Ethereum)
  const swapRouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'
  const poolContract = new Contract(
    poolAddress,
    IUniswapV3PoolABI,
    wallet.provider
  )

  const pool = await getPool(poolContract)
  const trade = await Trade.fromRoute(
    new Route([pool], pool.token0, pool.token1),
    CurrencyAmount.fromRawAmount(pool.token0, parsedAmount.toString()),
    TradeType.EXACT_INPUT
  )

  const slippageTolerance = new Percent(1, 100)
  const recipient = await wallet.getAddress()
  const deadline = (Date.now() / 1000 + 300) | 0

  const { calldata, value } = SwapRouter.swapCallParameters(trade, {
    slippageTolerance,
    recipient,
    deadline
  })

  const erc20 = new Contract(
    pool.token0.address,
    erc20Abi,
    wallet
  )

  const allowance = await erc20.allowance(recipient, swapRouter)
  if (allowance.lt(parsedAmount)) {
    const tx = await erc20.approve(swapRouter, parsedAmount)
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
