import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

import { StakerAction, staker } from './stake'

program
  .command('unstake')
  .description('Unstake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      await staker(chain, token, amount, StakerAction.Unstake)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
