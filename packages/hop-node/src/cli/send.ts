import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import chainSlugToId from 'src/utils/chainSlugToId'
import contracts from 'src/contracts'
import wallets from 'src/wallets'
import { BigNumber } from 'ethers'
import { Chain, nativeChainTokens } from 'src/constants'
import { actionHandler, logger, parseBool, parseNumber, parseString, root } from './shared'
import { formatEther, parseEther } from 'ethers/lib/utils'

root
  .command('send')
  .description('Send tokens over Hop bridge or send to another recipient')
  .option('--from-chain <slug>', 'From chain', parseString)
  .option('--to-chain <slug>', 'To chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--amount <number>', 'Amount (in human readable format)', parseNumber)
  .option('--recipient <address>', 'Recipient to send tokens to', parseString)
  .option('--htoken [boolean]', 'Send hTokens', parseBool)
  .option('--native [boolean]', 'Send the native token to a recipient', parseBool)
  .option('--self [boolean]', 'Send to self and reset nonce', parseBool)
  .option('--gas-price <price>', 'Gas price to use', parseString)
  .option('--max [boolean]', 'Use max tokens instead of specific amount', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { fromChain, toChain, token, amount, recipient, htoken: isHToken, native: isNativeSend, self: isSelfSend, gasPrice, max: shouldSendMax } = source
  const isSameChain = (fromChain && toChain) && (fromChain === toChain)
  if (isHToken && isNativeSend) {
    throw new Error('Cannot use --htoken and --native flag together')
  }

  if (isSelfSend) {
    await sendToSelf(fromChain, gasPrice)
  } else if (isSameChain) {
    await transferTokens(fromChain, token, amount, recipient, isHToken, shouldSendMax)
  } else if (isNativeSend) {
    await sendNativeToken(fromChain, amount, recipient, shouldSendMax)
  } else {
    await sendTokens(fromChain, toChain, token, amount, recipient, isHToken, shouldSendMax)
  }
}

async function sendNativeToken (
  chain: string,
  amount: number,
  recipient: string,
  shouldSendMax: boolean
) {
  if (!amount) {
    throw new Error('amount is required. E.g. 100')
  }

  if (!recipient) {
    throw new Error('recipient is required for sending a native asset')
  }

  if (shouldSendMax) {
    throw new Error('please specify an amount when sending native tokens')
  }

  const wallet = wallets.get(chain)
  const parsedAmount = parseEther(amount.toString())
  let balance = await wallet.getBalance()
  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }

  logger.debug(`attempting to send ${amount} to ${recipient} on ${chain}`)
  const tx = await wallet.sendTransaction({
    value: parsedAmount,
    to: recipient
  })
  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  balance = await wallet.getBalance()
  logger.debug(`send complete. new balance: ${formatEther(balance)}`)
}

async function sendToSelf (chain: string, gasPrice: string) {
  const wallet = wallets.get(chain)
  const provider = wallet.provider
  const selfAddress = await wallet.getAddress()
  const nonce = await provider?.getTransactionCount(selfAddress)
  const tx = await wallet.sendTransaction({
    value: 0,
    to: selfAddress,
    nonce,
    gasPrice: BigNumber.from(gasPrice)
  })
  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  logger.debug(`send with ${nonce} complete`)
}

async function transferTokens (
  chain: string,
  token: string,
  amount: number,
  recipient: string,
  isHToken: boolean,
  shouldSendMax: boolean
) {
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!recipient) {
    throw new Error('recipient address is required')
  }
  if (!amount && !shouldSendMax) {
    throw new Error('max flag or amount is required. E.g. 100')
  }
  if (!token) {
    throw new Error('token is required')
  }
  const tokenContracts = contracts.get(token, chain)
  if (!tokenContracts) {
    throw new Error('token contracts not found')
  }
  let instance: Token
  if (chain === Chain.Ethereum) {
    instance = new Token(tokenContracts.l1CanonicalToken)
  } else {
    if (isHToken) {
      instance = new Token(tokenContracts.l2HopBridgeToken)
    } else {
      instance = new Token(tokenContracts.l2CanonicalToken)
    }
  }

  let balance = await instance.getBalance()
  const label = `${chain}.${isHToken ? 'h' : ''}${token}`
  logger.debug(`${label} balance: ${await instance.formatUnits(balance)}`)
  let parsedAmount
  if (shouldSendMax) {
    parsedAmount = balance
  } else {
    parsedAmount = await instance.parseUnits(amount)
  }

  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }

  const formattedAmount = (await (instance.formatUnits(parsedAmount))).toString()
  logger.debug(`attempting to send ${formattedAmount} ${label} to ${recipient}`)
  const tx = await instance.transfer(recipient, parsedAmount)
  logger.info(`transfer tx: ${tx.hash}`)
  await tx.wait()
  balance = await instance.getBalance()
  logger.debug(`${label} balance: ${await instance.formatUnits(balance)}`)
}

async function sendTokens (
  fromChain: string,
  toChain: string,
  token: string,
  amount: number,
  recipient: string,
  isHToken: boolean,
  shouldSendMax: boolean
) {
  const isFromNative = nativeChainTokens[fromChain] === token

  if (!amount && !shouldSendMax) {
    throw new Error('max flag or amount is required. E.g. 100')
  }
  if (!token) {
    throw new Error('token is required')
  }
  const tokenContracts = contracts.get(token, fromChain)
  if (!tokenContracts) {
    throw new Error('token contracts not found')
  }
  let tokenClass: Token
  let bridge: L1Bridge | L2Bridge
  if (fromChain === Chain.Ethereum) {
    tokenClass = new Token(tokenContracts.l1CanonicalToken)
    bridge = new L1Bridge(tokenContracts.l1Bridge)
  } else {
    bridge = new L2Bridge(tokenContracts.l2Bridge)
    if (isHToken) {
      tokenClass = new Token(tokenContracts.l2HopBridgeToken)
    } else {
      tokenClass = new Token(tokenContracts.l2CanonicalToken)
    }
  }

  const signer = tokenClass.contract.signer
  if (!recipient) {
    recipient = await signer.getAddress()
  }
  if (!recipient) {
    throw new Error('recipient address is required')
  }

  const wallet = wallets.get(fromChain)
  let balance = await (isFromNative ? wallet.getBalance() : tokenClass.getBalance())
  const label = `${fromChain}.${isHToken ? 'h' : ''}${token}`
  logger.debug(`${label} balance: ${await bridge.formatUnits(balance)}`)
  let parsedAmount
  if (shouldSendMax) {
    parsedAmount = balance
  } else {
    parsedAmount = await bridge.parseUnits(amount)
  }
  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }

  let tx: any
  if (!isFromNative) {
    let spender = bridge.address
    if (fromChain !== Chain.Ethereum && !isHToken) {
      spender = (bridge as L2Bridge).ammWrapper.contract.address
    }
    const tx = await tokenClass.approve(spender, parsedAmount)
    if (tx) {
      logger.debug('approve tx:', tx.hash)
      await tx?.wait()
    }
  }

  const formattedAmount = (await bridge.formatUnits(parsedAmount)).toString()
  logger.debug(`attempting to send ${formattedAmount} ${label} ⟶  ${toChain} to ${recipient}`)
  const destinationChainId = chainSlugToId(toChain)
  if (fromChain === Chain.Ethereum) {
    if (isHToken) {
      tx = await (bridge as L1Bridge).convertCanonicalTokenToHopToken(
        destinationChainId,
        parsedAmount,
        recipient
      )
    } else {
      tx = await (bridge as L1Bridge).sendCanonicalTokensToL2(
        destinationChainId,
        parsedAmount,
        recipient
      )
    }
  } else {
    if (isHToken) {
      tx = await (bridge as L2Bridge).sendHTokens(
        destinationChainId,
        parsedAmount,
        recipient
      )
    } else {
      tx = await (bridge as L2Bridge).sendCanonicalTokens(
        destinationChainId,
        parsedAmount,
        recipient
      )
    }
  }
  logger.info(`send tx: ${tx.hash}`)
  await tx.wait()
  balance = await (isFromNative ? wallet.getBalance() : tokenClass.getBalance())
  logger.debug(`${label} balance: ${await tokenClass.formatUnits(balance)}`)
  logger.debug('tokens should arrive at destination in 5-15 minutes')
}
