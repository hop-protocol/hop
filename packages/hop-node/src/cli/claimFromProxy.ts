import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'
import wallets from 'src/wallets'
import { Chain, nativeChainTokens } from 'src/constants'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'
import { parseEther } from 'ethers/lib/utils'

import { BigNumber, Contract, providers, constants } from 'ethers'
import { getProxyAddressForChain } from 'src/config'

enum TransactionTypes {
  Native,
  ERC20,
  ERC721
}

root
  .command('claim-from-proxy')
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
  const proxyAbi = ['function claimFunds(address,uint256,uint256)']
  const proxyContract = new Contract(proxyAddress, proxyAbi, wallet)
  const tokenAddress = constants.AddressZero
  const type = TransactionTypes.Native

  logger.debug(`sending native tokens from proxy to EOA: attempting to send ${amount} to ${eoaAddress} on ${chain}`)
  const tx = await proxyContract.claimFunds(tokenAddress, parsedAmount, type)

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

  const eoaAddress = await wallet.getAddress()
  const proxyAbi = ['function claimFunds(address,uint256,uint256)']
  const proxyContract = new Contract(proxyAddress, proxyAbi, wallet)
  const tokenAddress = tokenInstance.address
  const type = TransactionTypes.ERC20

  logger.debug(`sending tokens ${tokenAddress}from  proxy to EOA: attempting to send ${amount} to ${eoaAddress} on ${chain}`)
  const tx = await proxyContract.claimFunds(tokenAddress, parsedAmount, type)

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
