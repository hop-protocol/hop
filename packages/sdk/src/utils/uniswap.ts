import { BigNumber, Contract } from 'ethers'
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool, Route, TICK_SPACINGS, TickMath, Trade, nearestUsableTick } from '@uniswap/v3-sdk'
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
      tokens: ['0x7F5c764cBc14f9669B88837ca1490cCa17c31607', '0x0b2c639c533813f4aa9d7837caf62653d097ff85'] // USDC.e, USDC
    },
    arbitrum: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '0x8e295789c9465487074a65b1ae9Ce0351172393f',
        }
      },
      tokens: ['0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', '0xaf88d065e77c8cc2239327c5edb3a432268e5831']
    },
    polygon: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '0xD36ec33c8bed5a9F7B6630855f1533455b98a418',
        }
      },
      tokens: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359']
    },
    base: {
      swapRouter: '0x2626664c2603336E57B271c5C0b26F421741e481',
      pools: {
        USDC: {
          'USDC.e': '0x06959273E9A65433De71F5A452D529544E07dDD0',
        }
      },
      tokens: ['0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913']
    }
  }
}

export async function getSwapParams(options: any) {
  const { network, chainId, provider, amountIn, recipient } = options
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

  const { pools } = addresses[network][chain]
  const poolAddress = pools?.[toToken]?.[fromToken]
  if (!poolAddress) {
    throw new Error(`"from" token "${fromToken}" is not supported at this time. Supported options are ${Object.keys(pools[toToken]).join(',')}`)
  }

  const tokens = addresses?.[network]?.[chain]?.tokens

  // Define the tokens
  const tokenA = new Token(chainId, tokens[0], decimals, fromToken)
  const tokenB = new Token(chainId, tokens[1], decimals, toToken)

  const poolContract = new Contract(poolAddress, IUniswapV3PoolABI, provider)

  // Fetch pool details
  const slot0 = await poolContract.slot0()
  const sqrtPriceX96 = slot0.sqrtPriceX96.toString()
  const tick = slot0.tick
  const liquidity = await poolContract.liquidity()
  const feeTier = await poolContract.fee()

  const pool = new Pool(tokenA, tokenB, feeTier, sqrtPriceX96, liquidity, tick,
    [
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
    ]
  )

  // Define a route
  const route = new Route([pool], tokenA, tokenB)

  // Create a trade for a given input amount
  const amountInTokenA = CurrencyAmount.fromRawAmount(tokenA, amountIn.toString())
  const trade = await Trade.fromRoute(route, amountInTokenA, TradeType.EXACT_INPUT)

  // Calculate slippage tolerance and set deadline
  const slippageTolerance = new Percent('50', '10000') // 0.5%
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from now

  const swapParams = {
      path: tokens.join('-'),
      recipient: recipient,
      deadline: deadline.toString(),
      amountIn: trade.inputAmount.toExact(),
      amountOutMinimum: trade.minimumAmountOut(slippageTolerance).toExact(),
  }

  return swapParams
}
