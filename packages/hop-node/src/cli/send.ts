import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'
import { Chain } from 'src/constants'

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
  let instance: Token
  if (fromChain === Chain.Ethereum) {
    instance = new Token(tokenContracts.l1CanonicalToken)
  } else {
    if (isHToken) {
      instance = new Token(tokenContracts.l2HopBridgeToken)
    } else {
      instance = new Token(tokenContracts.l2CanonicalToken)
    }
  }

  if (!recipient) {
    recipient = await instance.contract.signer.getAddress()
  }
  if (!recipient) {
    throw new Error('recipient address is required')
  }

  let balance = await instance.getBalance()
  const label = `${fromChain}.${isHToken ? 'h' : ''}${token}`
  logger.debug(`${label} balance: ${await instance.formatUnits(balance)}`)
  const parsedAmount = await instance.parseUnits(amount)
  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }
  logger.debug(`attempting to send ${amount} ${label} to ${recipient} on ${toChain}`)
  const tx = await instance.transfer(recipient, parsedAmount)
  logger.info(`transfer tx: ${tx.hash}`)
  await tx.wait()
  balance = await instance.getBalance()
  logger.debug(`${label} balance: ${await instance.formatUnits(balance)}`)
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
      await sendTokens(fromChain, toChain, token, amount, recipient, isHToken)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
