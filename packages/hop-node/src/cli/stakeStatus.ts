import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

import { StakerAction, staker } from './stake'

program
  .command('stake-status')
  .description('Stake status')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      await staker(chain, token, 0, StakerAction.Status)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
