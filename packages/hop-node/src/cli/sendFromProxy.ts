import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import chainSlugToId from 'src/utils/chainSlugToId'
import contracts from 'src/contracts'
import wallets from 'src/wallets'
import { CanonicalTokenConvertOptions } from 'src/watchers/classes/Bridge'
import { Chain, nativeChainTokens } from 'src/constants'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'
import { Interface, formatEther, parseEther } from 'ethers/lib/utils'

import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import { BigNumber, Contract, providers } from 'ethers'
import encodeProxyTransactions from 'src/utils/encodeProxyTransactions'
import { ProxyTransaction } from 'src/types'
import { getProxyAddressForChain } from 'src/config'

root
  .command('send-from-proxy')
  .description('Send from the proxy to the sender')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--amount <number>', 'Amount (in human readable format)', parseNumber)
  .option('--htoken [boolean]', 'Send hTokens', parseBool)
  .option('--max [boolean]', 'Use max tokens instead of specific amount', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, amount, htoken: isHToken, max: shouldSendMax } = source

  if (!chain) {
    throw new Error('chain is required')
  }

  if (!token) {
    throw new Error('token is required')
  } 

  if (!amount && !shouldSendMax) {
    throw new Error('max flag or amount is required. E.g. 100')
  }

  if (amount && shouldSendMax) {
    throw new Error('max flag and amount cannot be used together')
  }

  if (isHToken && chain === Chain.Ethereum) {
    throw new Error('hTokens are only available on layer 2')
  }

  const proxyAddress = getProxyAddressForChain(token, chain)
  if (!proxyAddress) {
    throw new Error('proxy address not found')
  }

  const isNativeSend = nativeChainTokens[chain] === token && !isHToken

  if (isNativeSend) {
    await transferNativeFromProxy(proxyAddress, chain, amount, shouldSendMax)
  } else {
    await transferErc20FromProxy(token, proxyAddress, chain, amount, shouldSendMax, isHToken)
  }
}

async function transferNativeFromProxy (
  proxyAddress: string,
  chain: string,
  amount: number,
  shouldSendMax: boolean
): Promise<providers.TransactionResponse> {
  const wallet = wallets.get(chain)
  
  let parsedAmount: BigNumber
  let proxyBalance = await wallet.provider!.getBalance(proxyAddress)
  if (shouldSendMax) {
    parsedAmount = proxyBalance 
  } else {
    parsedAmount = parseEther(amount.toString())
  }

  if (proxyBalance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }

  const eoaAddress = await wallet.getAddress()
  const proxyTransaction: ProxyTransaction = {
    to: eoaAddress,
    data: '0x',
    value: parsedAmount
  }

  const proxyAbi = ['function executeTransactions(bytes[])']
  const proxyContract = new Contract(proxyAddress, proxyAbi, wallet)

  logger.debug(`sending native tokens from proxy to EOA: attempting to send ${amount} to ${eoaAddress} on ${chain}`)

  const txData: string[] = encodeProxyTransactions([proxyTransaction])
  const tx = await proxyContract.executeTransactions(txData)

  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  logger.debug(`send complete`)
  return tx
}

async function transferErc20FromProxy (
  token: string,
  proxyAddress: string,
  chain: string,
  amount: number,
  shouldSendMax: boolean,
  isHToken: boolean
): Promise<providers.TransactionResponse> {
  const wallet = wallets.get(chain)
  const tokenInstance = getTokenInstance(token, chain, isHToken)

  // TODO: Proxy
  let balance = await tokenInstance.getBalance()
  const label = `${chain}.${isHToken ? 'h' : ''}${token}`
  logger.debug(`${label} balance: ${await tokenInstance.formatUnits(balance)}`)
  let parsedAmount
  if (shouldSendMax) {
    parsedAmount = balance
  } else {
    parsedAmount = await tokenInstance.parseUnits(amount)
  }

  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }

  let eoaAddress = await wallet.getAddress()
  const ethersInterface = new Interface(erc20Abi)

  const erc20TransferData = ethersInterface.encodeFunctionData('transfer', [
    eoaAddress,
    parsedAmount
  ])
  const proxyTransaction: ProxyTransaction = {
    to: tokenInstance.address,
    data: erc20TransferData,
    value: BigNumber.from(0)
  }
  const proxyAbi = ['function executeTransactions(bytes[])']
  const proxyContract = new Contract(proxyAddress, proxyAbi, wallet)

  logger.debug(`sending native tokens from proxy to EOA: attempting to send ${amount} to ${eoaAddress} on ${chain}`)

  const txData: string[] = encodeProxyTransactions([proxyTransaction])
  const tx = await proxyContract.executeTransactions(txData)

  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  logger.debug(`send complete`)
  return tx
}

function getTokenInstance (token: string, chain: string, isHToken: boolean): Token {
  const tokenContracts = contracts.get(token, chain)
  if (!tokenContracts) {
    throw new Error('token contracts not found')
  }

  if (chain === Chain.Ethereum) {
    return new Token(tokenContracts.l1CanonicalToken)
  } else {
    if (isHToken) {
      return new Token(tokenContracts.l2HopBridgeToken)
    } else {
      return new Token(tokenContracts.l2CanonicalToken)
    }
  } 
}
