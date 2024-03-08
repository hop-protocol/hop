import { BigNumber, Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool, Route, TICK_SPACINGS, TickMath, Trade, nearestUsableTick, encodeRouteToPath } from '@uniswap/v3-sdk'
import { UniswapQuoterV2Abi } from '@hop-protocol/core/abi'
import { chainIdToSlug } from './chainIdToSlug'

type TickSpacing = 100 | 500 | 3000 | 10000

const addresses: any = {
  mainnet: {
    optimism: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '0x2ab22ac86b25bd448a4d9dc041bd2384655299c4',
        }
      },
      quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
      tokens: ['0x7F5c764cBc14f9669B88837ca1490cCa17c31607', '0x0b2c639c533813f4aa9d7837caf62653d097ff85'] // USDC.e, USDC
    },
    arbitrum: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '0x8e295789c9465487074a65b1ae9Ce0351172393f',
        }
      },
      quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
      tokens: ['0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', '0xaf88d065e77c8cc2239327c5edb3a432268e5831']
    },
    polygon: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '0xD36ec33c8bed5a9F7B6630855f1533455b98a418',
        }
      },
      quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
      tokens: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359']
    },
    base: {
      swapRouter: '0x2626664c2603336E57B271c5C0b26F421741e481',
      pools: {
        USDC: {
          'USDC.e': '0x06959273E9A65433De71F5A452D529544E07dDD0',
        }
      },
      quoter: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a',
      tokens: ['0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913']
    }
  }
}

export async function getSwapParams(options: any) {
  const { network, chainId, provider, amountIn, recipient, getQuote = false } = options
  const chain = chainIdToSlug(network, chainId)
  const decimals = 6

  const fromToken = 'USDC.e'
  const toToken = 'USDC'

  if (!addresses[network]) {
    throw new Error(`Network "${network}" is not supported at this time. Supported options are ${Object.keys(addresses).join(',')}`)
  }

  if (!addresses[network][chain]) {
    throw new Error(`Chain "${chain}" is not supported at this time. Supported options are ${Object.keys(addresses[network]).join(',')}`)
  }

  const { pools, quoter } = addresses[network][chain]
  const poolAddress = pools?.[toToken]?.[fromToken]
  if (!poolAddress) {
    throw new Error(`"from" token "${fromToken}" is not supported at this time. Supported options are ${Object.keys(pools[toToken]).join(',')}`)
  }

  const tokens = addresses?.[network]?.[chain]?.tokens

  // Define the tokens
  const tokenA = new Token(chainId, tokens[0], decimals, fromToken)
  const tokenB = new Token(chainId, tokens[1], decimals, toToken)

  // Create a pool
  const poolContract = new Contract(poolAddress, IUniswapV3PoolABI, provider)

  // Fetch pool details
  const [token0, token1, feeTier, liquidity, slot0] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])

  const sqrtPriceX96 = slot0[0]
  const tick =  slot0[1]

  // Trade.exactIn doesn't seem to work unless ticks are specified
  // see https://github.com/Uniswap/v3-sdk/issues/52
  const pool = new Pool(tokenA, tokenB, feeTier, sqrtPriceX96, liquidity, tick, [
    {
      index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeTier as TickSpacing]),
      liquidityNet: liquidity,
      liquidityGross: liquidity
    },
    {
      index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeTier as TickSpacing]),
      liquidityNet: BigNumber.from(liquidity).mul(-1).toString(),
      liquidityGross: liquidity
    }
  ])

  // Define a route
  const route = new Route([pool], tokenA, tokenB)

  // Create a trade for a given input amount
  const amountInTokenA = CurrencyAmount.fromRawAmount(tokenA, amountIn.toString())
  const trade = await Trade.exactIn(route, amountInTokenA)

  // Calculate slippage tolerance and set deadline
  const slippageTolerance = new Percent('50', '10000') // 0.5%
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from now

  const exactOutput = false
  const swapParams = {
      path: encodeRouteToPath(route, exactOutput),
      recipient: recipient,
      deadline: deadline.toString(),
      amountIn: trade.inputAmount.toExact(),
      amountOutMinimum: trade.minimumAmountOut(slippageTolerance).toExact(),
  }

  if (getQuote) {
    const quoterContract = new Contract(
      quoter,
      UniswapQuoterV2Abi,
      provider
    )

    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
      token0,
      token1,
      feeTier,
      amountIn.toString(),
      0
    )

    const quotedAmountOutFormatted =  formatUnits(quotedAmountOut, decimals)

    return {
      swapParams,
      quotedAmountOut,
      quotedAmountOutFormatted
    }
  }

  return {
    swapParams
  }
}
