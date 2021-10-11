import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import Token from 'src/watchers/classes/Token'
import chainSlugToId from 'src/utils/chainSlugToId'
import contracts from 'src/contracts'
import getRpcProvider from 'src/utils/getRpcProvider'
import { BigNumber, Wallet } from 'ethers'
import { Chain } from 'src/constants'
import {
  FileConfig,
  config as globalConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { logger, program } from './shared'

async function sendTokens (
  fromChain: string,
  toChain: string,
  token: string,
  amount: number,
  recipient: string,
  isHToken: boolean = false
) {
  if (!amount) {
    throw new Error('amount is required. E.g. 100')
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

  const isNativeToken = token === 'MATIC' && fromChain === Chain.Polygon
  let balance : BigNumber
  if (isNativeToken) {
    balance = await signer.getBalance()
  } else {
    balance = await tokenClass.getBalance()
  }
  const label = `${fromChain}.${isHToken ? 'h' : ''}${token}`
  logger.debug(`${label} balance: ${await tokenClass.formatUnits(balance)}`)
  const parsedAmount = await tokenClass.parseUnits(amount)
  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }

  let spender = bridge.address
  if (fromChain !== Chain.Ethereum && !isHToken) {
    spender = (bridge as L2Bridge).ammWrapper.contract.address
  }
  let tx = await tokenClass.approve(spender, parsedAmount)
  if (tx) {
    logger.debug('approve tx:', tx.hash)
  }

  logger.debug(`attempting to send ${amount} ${label} ⟶  ${toChain} to ${recipient}`)
  const destinationChainId = chainSlugToId(toChain)
  if (fromChain === Chain.Ethereum) {
    if (isHToken) {
      tx = await (bridge as L1Bridge).convertCanonicalTokenToHopToken(
        destinationChainId,
        parsedAmount
      )
    } else {
      tx = await (bridge as L1Bridge).sendCanonicalTokensToL2(
        destinationChainId,
        parsedAmount
      )
    }
  } else {
    if (isHToken) {
      tx = await (bridge as L2Bridge).sendHTokens(
        destinationChainId,
        parsedAmount
      )
    } else {
      tx = await (bridge as L2Bridge).sendCanonicalTokens(
        destinationChainId,
        parsedAmount
      )
    }
  }
  logger.info(`send tx: ${tx.hash}`)
  await tx?.wait()
  balance = await tokenClass.getBalance()
  logger.debug(`${label} balance: ${await tokenClass.formatUnits(balance)}`)
  logger.debug('tokens should arrive at destination in 5-15 minutes')
}

async function sendNativeToken (
  chain: string,
  amount: number,
  recipient: string
) {
  if (!amount) {
    throw new Error('amount is required. E.g. 100')
  }

  if (!recipient) {
    throw new Error('recipient is required for sending a native asset')
  }

  const provider = getRpcProvider(chain)
  const wallet = new Wallet(globalConfig.bonderPrivateKey, provider)

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
  await tx?.wait()
  balance = await wallet.getBalance()
  logger.debug(`send complete. new balance: ${formatEther(balance)}`)
}

program
  .command('send')
  .description('Send tokens over Hop bridge')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--from-chain <string>', 'From chain')
  .option('--to-chain <string>', 'To chain')
  .option('--token <string>', 'Token')
  .option('--amount <number>', 'Amount (in human readable format)')
  .option('--recipient <string>', 'Recipient to send tokens to')
  .option('--htoken', 'Send hTokens')
  .option('--native', 'Send the native token')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const fromChain = source.fromChain
      const toChain = source.toChain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      const recipient = source.recipient
      const isHToken = !!source.htoken
      const isNativeSend = !!source.native
      if (isHToken && isNativeSend) {
        throw new Error('Cannot use --htoken and --native flag together')
      }
      if (isNativeSend) {
        await sendNativeToken(fromChain, amount, recipient)
      } else {
        await sendTokens(fromChain, toChain, token, amount, recipient, isHToken)
      }
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
