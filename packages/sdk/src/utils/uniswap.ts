import { BigNumber, Contract } from 'ethers'
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool, Route, TICK_SPACINGS, TickMath, Trade, encodeRouteToPath, nearestUsableTick } from '@uniswap/v3-sdk'
import { UniswapQuoterV2Abi, erc20Abi } from '@hop-protocol/core/abi'
import { chainIdToSlug } from './chainIdToSlug'
import { parseUnits, formatUnits } from 'ethers/lib/utils'

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
  },
  sepolia: {
    ethereum: {
      swapRouter: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
      pools: {
        USDC: {
          'USDC.e': '0x66c4CbdF224E2b11f1275633D7b8427b29CAC856', // TODO
        }
      },
      quoter: '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3',
      tokens: ['0x95B01328BA6f4de261C4907fB35eE3c4968e9CEF', '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'] // TODO
    },
    optimism: {
      swapRouter: '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4',
      pools: {
        USDC: {
          'USDC.e': '0x9Fd47350647449DDc52Ab8b6eEa1AA8623911D63',
        }
      },
      quoter: '0xC5290058841028F1614F3A6F0F5816cAd0df5E27',
      tokens: ['0xB15312eA17d95375E64317C363A0e6304330D82e', '0x5fd84259d66Cd46123540766Be93DFE6D43130D7']
    },
    arbitrum: {
      swapRouter: '0x101F443B4d1b059569D643917553c771E1b9663E',
      pools: {
        USDC: {
          'USDC.e': '', // TODO
        }
      },
      quoter: '0x2779a0CC1c3e0E44D2542EC3e79e3864Ae93Ef0B',
      tokens: ['', '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'] // TODO
    },
    base: {
      swapRouter: '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4',
      pools: {
        USDC: {
          'USDC.e': '', // TODO
        }
      },
      quoter: '0xC5290058841028F1614F3A6F0F5816cAd0df5E27',
      tokens: ['', '0x036CbD53842c5426634e7929541eC2318f3dCF7e']  // TODO
    },
  },
  goerli: {
    ethereum: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '0x0434A080441D0824B480B6a256d7607Ea94D69D9', // TODO
        }
      },
      quoter: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      tokens: ['0x48876ba88a6085281Ce87e2CE202058d74C9d8dd', '0x07865c6e87b9f70255377e024ace6630c1eaa37f'] // TODO
    },
    optimism: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '0xf6b90BC9d296db48164C6223F62bcDB3aeEFBCD0', // TODO
        }
      },
      quoter: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      tokens: ['0xCB4cEeFce514B2d910d3ac529076D18e3aDD3775', '0xe05606174bac4a6364b31bd0eca4bf4dd368f8c6'] // USDC.e, USDC // TODO
    },
    arbitrum: {
      swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      pools: {
        USDC: {
          'USDC.e': '', // TODO
        }
      },
      quoter: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      tokens: ['0x17078F231AA8dc256557b49a8f2F72814A71f633', '0xfd064a18f3bf249cf1f87fc203e90d8f650f2d63'] // TODO
    },
    base: {
      swapRouter: '0x2626664c2603336E57B271c5C0b26F421741e481',
      pools: {
        USDC: {
          'USDC.e': '', // TODO
        }
      },
      quoter: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a',
      tokens: ['', '0xf175520c52418dfe19c8098071a252da48cd1c19']  // TODO
    },
  },
}

export async function getUSDCSwapParams(options: any) {
  const { network, chainId, provider, amountIn, recipient, getQuote = false } = options
  const chain = chainIdToSlug(network, chainId)

  const { chainId: providerChainId } = await provider.getNetwork()
  if (chainId !== Number(providerChainId.toString())) {
    throw new Error(`provider chain id doesn't match chainId`)
  }

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

  const fromTokenContract = new Contract(tokens[0], erc20Abi, provider)
  const toTokenContract = new Contract(tokens[1], erc20Abi, provider)

  const fromTokenDecimals = await fromTokenContract.decimals()
  const toTokenDecimals = await toTokenContract.decimals()

  // Define the tokens
  const tokenA = new Token(chainId, tokens[0], fromTokenDecimals, fromToken)
  const tokenB = new Token(chainId, tokens[1], toTokenDecimals, toToken)

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
      amountIn: parseUnits(trade.inputAmount.toExact(), fromTokenDecimals).toString(),
      amountOutMinimum: parseUnits(trade.minimumAmountOut(slippageTolerance).toExact(), toTokenDecimals).toString(),
  }

  if (getQuote) {
    const quoterContract = new Contract(
      quoter,
      UniswapQuoterV2Abi,
      provider
    )

    // const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    //   token0,
    //   token1,
    //   amountIn.toString(),
    //   feeTier,
    //   0
    // )

    const quotedAmountOut = await quoterContract.callStatic.quoteExactInput(
      encodeRouteToPath(route, exactOutput),
      amountIn.toString()
    )

    const quotedAmountOutFormatted =  formatUnits(quotedAmountOut, toTokenDecimals)

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
