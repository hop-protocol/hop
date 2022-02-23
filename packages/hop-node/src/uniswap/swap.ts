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

type Config = {
  chain: string
  fromToken: string
  toToken: string
  amount: number
  max?: boolean
  recipient: string
  slippage?: number
  deadline: number
}

const addresses: any = {
  ethereum: {
    swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    pools: {
      ETH: { // ETH is "toToken"
        USDC: '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8',
        USDT: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
        DAI: '0x60594a405d53811d3bc4766596efd80fd545a270',
        MATIC: '0x290A6a7460B308ee3F19023D2D00dE604bcf5B42',
        WBTC: '0x4585fe77225b41b697c938b018e2ac67ac5a20c0'
      }
    }
  },
  optimism: {
    swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    pools: {
      ETH: { // ETH is "toToken"
        USDC: '0xB589969D38CE76D3d7AA319De7133bC9755fD840',
        USDT: '0xc858A329Bf053BE78D6239C4A4343B8FbD21472b',
        DAI: '0x03aF20bDAaFfB4cC0A521796a223f7D85e2aAc31',
        WBTC: '0x73b14a78a0d396c521f954532d43fd5ffe385216'
      }
    }
  },
  arbitrum: {
    swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    pools: {
      ETH: { // ETH is "toToken"
        USDC: '0x17c14d2c404d167802b16c450d3c99f88f2c4f4d',
        USDT: '0x641c00a822e8b671738d32a431a4fb6074e5c79d',
        DAI: '0xa961f0473da4864c5ed28e00fcc53a3aab056c1b',
        WBTC: '0x2f5e87c9312fa29aed5c179e456625d79015299c'
      }
    }
  },
  // UNTESTED!
  polygon: {
    swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    pools: {
      MATIC: { // MATIC is "toToken"
        USDC: '0xa374094527e1673a86de625aa59517c5de346d32',
        USDT: '0x9b08288c3be4f62bbf8d1c20ac9c5e6f9467d8b7',
        ETH: '0x86f1d8390222a3691c28938ec7404a1661e618e0'
      }
    }
  }
}

export async function swap (config: Config) {
  let { chain, fromToken, toToken, amount, max, slippage, recipient, deadline } = config
  if (!addresses[chain]) {
    throw new Error(`chain "${chain}" currently not supported at at this time`)
  }
  const { swapRouter, pools } = addresses[chain]
  const wallet = wallets.get(chain)
  if (!pools[toToken]) {
    throw new Error(`"${toToken}" currently not supported at at this time`)
  }
  const poolAddress = pools[toToken][fromToken]
  if (!poolAddress) {
    throw new Error(`"from" token "${fromToken}" is not supported at this time. Supported options are ${Object.keys(pools[toToken]).join(',')}`)
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

  logger.debug('got pool information')

  const token1 = getToken(
    pool.token1.address,
    wallet
  )

  let sourceToken = token0
  let routeToken0: any = pool.token0
  let routeToken1: any = pool.token1

  const token0Symbol = await token0.symbol()
  if ((chain !== 'polygon' && token0Symbol === 'WETH' || token0Symbol === 'ETH') || (chain === 'polygon' && token0Symbol === 'WMATIC' || token0Symbol === 'MATIC')) { // eslint-disable-line
    sourceToken = token1
    const tmp = routeToken0
    routeToken0 = routeToken1
    routeToken1 = tmp
  }

  if ((chain !== 'polygon' && toToken === 'ETH') || (chain === 'polygon' && toToken === 'MATIC')) { // eslint-disable-line
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

  logger.debug('getting trade route')

  const trade = await Trade.fromRoute(
    new Route([pool], routeToken0, routeToken1),
    CurrencyAmount.fromRawAmount(routeToken0, parsedAmount.toString()),
    TradeType.EXACT_INPUT
  )

  logger.debug('got trade route')

  const slippageTolerance = new Percent((slippage ?? 1) * 100, 10000)
  recipient = recipient ?? sender
  deadline = (Date.now() / 1000 + (deadline || 300)) | 0 // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing

  if (!recipient) {
    throw new Error('recipient is required')
  }
  if (!deadline) {
    throw new Error('deadline is required')
  }

  logger.debug('getting swap call parameters')

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
