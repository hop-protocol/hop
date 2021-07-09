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
  .command('stake-status')
  .description('Stake status')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
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
      await staker(network, chain, token, 0, StakerAction.Status)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
