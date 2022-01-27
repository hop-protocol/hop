import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'
import getCanonicalTokenSymbol from 'src/utils/getCanonicalTokenSymbol'
import isHToken from 'src/utils/isHToken'
import wallets from 'src/wallets'
import { BigNumber, utils as ethersUtils } from 'ethers'
import { Chain, TokenIndex } from 'src/constants'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'

import { swap as uniswapSwap } from 'src/uniswap'

root
  .command('swap')
  .description('Swap tokens on Uniswap or via Hop AMM')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--from <symbol>', 'From token', parseString)
  .option('--to <symbol>', 'To token', parseString)
  .option('--amount <number>', 'From token amount', parseNumber)
  .option('--max [boolean]', 'Use max tokens instead of specific amount', parseBool)
  .option('--deadline <seconds>', 'Deadline in seconds', parseNumber)
  .option('--slippage <number>', 'Slippage tolerance. E.g. 0.5', parseNumber)
  .option('--recipient <address>', 'Recipient', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, from: fromToken, to: toToken, amount, max, recipient, deadline, slippage } = source
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
  if (fromToken === toToken) {
    throw new Error('from-token and to-token cannot be the same')
  }
  const isWrapperWithdrawal = getIsWrappedToken(fromToken)
  const fromTokenIsHToken = isHToken(fromToken)
  const toTokenIsHToken = isHToken(toToken)
  const isAmmSwap = fromTokenIsHToken || toTokenIsHToken
  const deadlineBn = deadline ? BigNumber.from(deadline) : undefined
  let tx: any
  if (isWrapperWithdrawal) {
    const wallet = wallets.get(chain)
    const wrappedTokenAddress = wrappedTokenAddresses[chain]
    const abi = ['function withdraw(uint256)']
    const ethersInterface = new ethersUtils.Interface(abi)
    const parsedAmount = ethersUtils.parseUnits(amount.toString())
    const data = ethersInterface.encodeFunctionData(
      'withdraw', [parsedAmount]
    )
    tx = await wallet.sendTransaction({
      to: wrappedTokenAddress,
      data
    })
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
    const tokenSymbol = fromTokenIsHToken ? toToken : fromToken
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
    tx = await token.approve(spender, amountIn)
    if (tx) {
      logger.info(`approval tx: ${tx.hash}`)
      await tx?.wait()
    }

    logger.debug(`attempting to swap ${l2Bridge.formatUnits(amountIn)} ${fromToken} for at least ${l2Bridge.formatUnits(minAmountOut)} ${toToken}`)
    tx = await amm.swap(fromTokenIndex, toTokenIndex, amountIn, minAmountOut, deadlineBn)
  } else {
    logger.debug('uniswap swap')
    tx = await uniswapSwap({
      chain,
      fromToken,
      toToken,
      amount,
      max,
      deadline,
      slippage,
      recipient
    })
  }
  if (!tx) {
    throw new Error('tx object not received')
  }
  logger.info(`swap tx: ${tx.hash}`)
  logger.log('waiting for receipt')
  const receipt = await tx.wait()
  const success = receipt.status === 1
  if (!success) {
    throw new Error('status not successful')
  }
  logger.log('success')
}

function getIsWrappedToken (token: string): boolean {
  token = token.toLowerCase()
  return ['weth', 'wmatic', 'wxdai'].includes(token)
}

const wrappedTokenAddresses: any = {
  ethereum: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  optimism: '0x4200000000000000000000000000000000000006',
  arbitrum: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  polygon: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  gnosis: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'
}
