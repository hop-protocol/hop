import {
  Config,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from './shared/config'
import { logger, program } from './shared'

import { StakerAction, staker } from './stake'
import {
  config as globalConfig
} from 'src/config'

program
  .command('unstake')
  .description('Unstake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .action(async (source: any) => {
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
      await staker(network, chain, token, amount, StakerAction.Unstake)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
