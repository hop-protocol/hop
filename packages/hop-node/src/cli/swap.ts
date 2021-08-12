import { Chain } from 'src/constants'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { swap } from 'src/uniswap'

import { logger, program } from './shared'

program
  .command('swap')
  .description('Swap tokens on uniswap')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--from <string>', 'From token')
  .option('--to <string>', 'To token')
  .option('--amount <string>', 'From token amount')
  .option('--deadline <string>', 'Deadline in seconds')
  .option('--slippage <string>', 'Slippage tolerance. E.g. 0.5')
  .option('--recipient <string>', 'Recipient')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const fromToken = source.from
      const toToken = source.to
      const amount = Number(source.args[0] || source.amount)
      const deadline = Number(source.deadline)
      const slippage = Number(source.slippage)
      const recipient = source.recipient
      if (!chain) {
        throw new Error('chain is required')
      }
      if (chain !== Chain.Ethereum) {
        throw new Error('currently only ethereum chain is supported for swapping')
      }
      if (!fromToken) {
        throw new Error('"from" token is required')
      }
      if (!toToken) {
        throw new Error('"to" token is required')
      }
      if (!amount) {
        throw new Error('"from" token amount is required')
      }

      const tx = await swap({
        fromToken,
        toToken,
        amount,
        deadline,
        slippage,
        recipient
      })
      logger.info(`swap tx: ${tx.hash}`)
      logger.log('waiting for receipt')
      const receipt = await tx.wait()
      const success = receipt.status === 1
      if (!success) {
        throw new Error('status not successful')
      }
      logger.log('success')

      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
