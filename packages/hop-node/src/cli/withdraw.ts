import { logger, program } from './shared'
import {
  setGlobalConfigFromConfigFile,
  Config,
  parseConfigFile
} from './shared/config'
import db from 'src/db'
import {
  getStakeWatchers,
  startCommitTransferWatchers
} from 'src/watchers/watchers'
import LoadTest from 'src/loadTest'
import {
  db as dbConfig,
  config as globalConfig,
  setConfigByNetwork
} from 'src/config'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import { Chain } from 'src/constants'
import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'

async function withdrawTokens (
  network: string,
  chain: string,
  token: string,
  amount: number,
  recipient: string,
  isHToken: boolean = false
) {
  if (!recipient) {
    throw new Error('recipient address is required')
  }
  if (!amount) {
    throw new Error('amount is required. E.g. 100')
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
  const parsedAmount = await instance.parseUnits(amount)
  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }
  logger.debug(`attempting to send ${amount} ${label} to ${recipient}`)
  const tx = await instance.transfer(recipient, parsedAmount)
  logger.info(`transfer tx: ${tx.hash}`)
  await tx.wait()
  balance = await instance.getBalance()
  logger.debug(`${label} balance: ${await instance.formatUnits(balance)}`)
}

program
  .command('withdraw')
  .description('Withdraw tokens from wallet')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .option('-r, --recipient <string>', 'Recipient to send tokens to')
  .option('--htoken', 'Withdraw hTokens')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const network = source.network || globalConfig.network
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      const recipient = source.recipient
      const isHToken = !!source.htoken
      await withdrawTokens(network, chain, token, amount, recipient, isHToken)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
