import { Chain } from 'src/constants'
import {
  Config,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from './shared/config'
import { swap } from 'src/uniswap'

import { logger, program } from './shared'

program
  .command('swap')
  .description('Swap tokens on uniswap')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-i, --from <string>', 'From token')
  .option('-o, --to <string>', 'To token')
  .option('-a, --amount <string>', 'From token amount')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const fromToken = source.from
      const toToken = source.to
      const amount = Number(source.args[0] || source.amount)
      if (!chain) {
        throw new Error('chain is required')
      }
      if (chain !== Chain.Ethereum) {
        throw new Error('currently only ethereum chain is supported for swapping')
      }
      if (!fromToken) {
        throw new Error('"from" token is required')
      }
      if (fromToken !== 'USDC') {
        throw new Error('currently only USDC as "from" token is supported for swapping')
      }
      if (!toToken) {
        throw new Error('"to" token is required')
      }
      if (toToken !== 'ETH') {
        throw new Error('currently only ETH as "to" token is supported for swapping')
      }
      if (!amount) {
        throw new Error('"from" token amount is required')
      }

      const tx = await swap(amount)
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
