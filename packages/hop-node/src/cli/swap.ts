import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'
import getCanonicalTokenSymbol from 'src/utils/getCanonicalTokenSymbol'
import isHToken from 'src/utils/isHToken'
import wallets from 'src/wallets'
import { BigNumber, utils as ethersUtils } from 'ethers'
import { Chain, TokenIndex, nativeChainTokens } from 'src/constants'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'

import { swap as oneInchSwap } from 'src/1inch'

root
  .command('swap')
  .description('Swap tokens on Uniswap or via Hop AMM')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--from <symbol>', 'From token', parseString)
  .option('--to <symbol>', 'To token', parseString)
  .option('--amount <number>', 'From token amount (in human readable format)', parseNumber)
  .option('--max [boolean]', 'Use max tokens instead of specific amount', parseBool)
  .option('--deadline <seconds>', 'Deadline in seconds', parseNumber)
  .option('--slippage <number>', 'Slippage tolerance. E.g. 0.5', parseNumber)
  .option('--recipient <address>', 'Recipient', parseString)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  let { chain, from: fromToken, to: toToken, amount, max, recipient, deadline, slippage, dry: dryMode } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!fromToken) {
    throw new Error('"from" token is required')
  }
  if (!toToken) {
    throw new Error('"to" token is required')
  }
  if (!max && !amount) {
    throw new Error('"max" or "amount" is required')
  }
  const fromNative = fromToken === nativeChainTokens[chain]
  const toNative = toToken === nativeChainTokens[chain]
  if (fromToken === toToken) {
    throw new Error('from-token and to-token cannot be the same')
  }

  const isWrapperDeposit = fromNative && isWrappedToken(toToken)
  const isWrapperWithdrawal = isWrappedToken(fromToken) && toNative
  const fromTokenIsHToken = isHToken(fromToken)
  const toTokenIsHToken = isHToken(toToken)
  const isAmmSwap = fromTokenIsHToken || toTokenIsHToken
  const deadlineBn = deadline ? BigNumber.from(deadline) : undefined
  let tx: any
  const isWrapperSwap = (isWrapperDeposit || isWrapperWithdrawal) && !isAmmSwap
  if (isWrapperSwap) {
    if (isWrapperDeposit) {
      const validTokens = isValidChainWrapTokens(chain, fromToken, toToken)
      if (!validTokens) {
        throw new Error('token options are invalid. Make sure the token symbols correspond to the chain')
      }
      logger.debug('wrapping token')
      const parsedAmount = ethersUtils.parseEther(amount.toString())
      if (dryMode) {
        logger.warn(`dry: ${dryMode}, skipping wrap tx`)
      } else {
        tx = await wrapToken(chain, parsedAmount)
      }
    } else if (isWrapperWithdrawal) {
      const validTokens = isValidChainWrapTokens(chain, toToken, fromToken)
      if (!validTokens) {
        throw new Error('token options are invalid. Make sure the token symbols correspond to the chain')
      }
      logger.debug('unwrapping token')
      const parsedAmount = ethersUtils.parseEther(amount.toString())
      if (dryMode) {
        logger.warn(`dry: ${dryMode}, skipping unwrap tx`)
      } else {
        tx = await unwrapToken(chain, parsedAmount)
      }
    }
  } else if (isAmmSwap) {
    logger.debug('L2 AMM swap')
    if (fromTokenIsHToken && toTokenIsHToken) {
      throw new Error('both from-token and to-token cannot be hTokens')
    }
    const fromTokenCanonicalSymbol = getCanonicalTokenSymbol(fromToken)
    const toTokenCanonicalSymbol = getCanonicalTokenSymbol(toToken)
    if (fromTokenCanonicalSymbol !== toTokenCanonicalSymbol) {
      throw new Error('both from-token and to-token must be the same asset type')
    }
    if (chain === Chain.Ethereum) {
      throw new Error('no AMM on Ethereum chain')
    }

    if (fromNative) {
      logger.debug(`wrapping ${fromToken}`)
      const parsedAmount = ethersUtils.parseEther(amount.toString())
      if (dryMode) {
        logger.warn(`dry: ${dryMode}, skipping swap wrap tx`)
      } else {
        const wrapTx = await wrapToken(chain, parsedAmount)
        logger.debug(`swap tx: ${wrapTx.hash}`)
        logger.debug('waiting for wrap tx confirmation')
        await wrapTx.wait()
      }
      fromToken = fromTokenCanonicalSymbol
    }

    const tokenSymbol = fromTokenIsHToken ? toTokenCanonicalSymbol : fromTokenCanonicalSymbol
    const l2BridgeContract = contracts.get(tokenSymbol, chain)?.l2Bridge
    if (!l2BridgeContract) {
      throw new Error(`L2 bridge contract not found for ${chain}.${tokenSymbol}`)
    }
    const l2Bridge = new L2Bridge(l2BridgeContract)
    const amm = l2Bridge.amm
    const ammWrapper = l2Bridge.ammWrapper

    let fromTokenIndex: number
    let toTokenIndex: number
    let token: Token
    if (fromTokenIsHToken) {
      fromTokenIndex = TokenIndex.HopBridgeToken
      toTokenIndex = TokenIndex.CanonicalToken
      token = await l2Bridge.hToken()
    } else {
      fromTokenIndex = TokenIndex.CanonicalToken
      toTokenIndex = TokenIndex.HopBridgeToken
      token = await l2Bridge.canonicalToken()
    }

    let amountIn = l2Bridge.parseUnits(amount)
    if (max) {
      logger.debug('max flag used')
      amountIn = await token.getBalance()
    }

    let amountOut: BigNumber
    if (fromTokenIsHToken) {
      amountOut = await amm.calculateToHTokensAmount(amountIn)
    } else {
      amountOut = await amm.calculateFromHTokensAmount(amountIn)
    }

    const slippageToleranceBps = (slippage || 0.5) * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const minAmountOut = amountOut.mul(minBps).div(10000)

    logger.debug('checking approval')
    const spender = amm.address
    if (dryMode) {
      logger.warn(`dry: ${dryMode}, skipping swap approval tx`)
    } else {
      tx = await token.approve(spender, amountIn)
      if (tx) {
        logger.info(`approval tx: ${tx.hash}`)
        await tx?.wait()
      }
    }

    logger.debug(`attempting to swap ${l2Bridge.formatUnits(amountIn)} ${fromToken} for at least ${l2Bridge.formatUnits(minAmountOut)} ${toToken}`)
    if (dryMode) {
      logger.warn(`dry: ${dryMode}, skipping swap tx`)
    } else {
      tx = await amm.swap(fromTokenIndex, toTokenIndex, amountIn, minAmountOut, deadlineBn)
    }

    logger.info(`swap tx: ${tx.hash}`)

    if (toNative) {
      const receipt = await tx.wait()
      for (const event of receipt.events) {
        if (event.event === 'TokenSwap') {
          logger.debug(`unwrapping ${toToken}`)
          const parsedAmount = event.args.tokensBought
          if (dryMode) {
            logger.warn(`dry: ${dryMode}, skipping swap unwrap tx`)
          } else {
            const unwrapTx = await unwrapToken(chain, parsedAmount)
            logger.debug('waiting for unwrap tx confirmation')
            await unwrapTx.wait()
            tx = unwrapTx
          }
          break
        }
      }
    }
  } else {
    logger.debug('dex swap')
    tx = await oneInchSwap({
      chain,
      fromToken,
      toToken,
      amount,
      max,
      slippage,
      recipient,
      dryMode
    })
  }

  if (dryMode) {
    logger.log('done')
  } else {
    if (!tx) {
      throw new Error('tx object not received')
    }
    if (tx) {
      logger.info(`swap tx: ${tx.hash}`)
      logger.log('waiting for receipt')
      const receipt = await tx.wait()
      const success = receipt.status === 1
      if (!success) {
        throw new Error('status not successful')
      }
      logger.log('success')
    }
  }
}

async function wrapToken (chain: string, parsedAmount: BigNumber) {
  const wallet = wallets.get(chain)
  const wrappedTokenAddress = wrappedTokenAddresses[chain]
  const abi = ['function deposit()']
  const ethersInterface = new ethersUtils.Interface(abi)
  const data = ethersInterface.encodeFunctionData(
    'deposit', []
  )
  return wallet.sendTransaction({
    to: wrappedTokenAddress,
    value: parsedAmount,
    data
  })
}

async function unwrapToken (chain: string, parsedAmount: BigNumber) {
  const wallet = wallets.get(chain)
  const wrappedTokenAddress = wrappedTokenAddresses[chain]
  const abi = ['function withdraw(uint256)']
  const ethersInterface = new ethersUtils.Interface(abi)
  const data = ethersInterface.encodeFunctionData(
    'withdraw', [parsedAmount]
  )
  return wallet.sendTransaction({
    to: wrappedTokenAddress,
    data
  })
}

function isWrappedToken (token: string) {
  return !!wrappedNativeToNative[token]
}

function isValidChainWrapTokens (chain: string, nativeToken: string, wrappedToken: string) {
  return nativeChainTokens[chain] === nativeToken && nativeToWrappedNative[nativeToken] === wrappedToken
}

const wrappedTokenAddresses: Record<string, string> = {
  ethereum: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  optimism: '0x4200000000000000000000000000000000000006',
  arbitrum: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  polygon: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  gnosis: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'
}

const wrappedNativeToNative: Record<string, string> = {
  WETH: 'ETH',
  WMATIC: 'MATIC',
  WXDAI: 'XDAI'
}

const nativeToWrappedNative: Record<string, string> = {
  ETH: 'WETH',
  MATIC: 'WMATIC',
  XDAI: 'WXDAI'
}
