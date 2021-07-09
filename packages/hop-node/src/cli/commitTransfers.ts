import { logger, program } from './shared'
import {
  setGlobalConfigFromConfigFile,
  Config,
  parseConfigFile
} from './shared/config'
import { startCommitTransferWatchers } from 'src/watchers/watchers'

program
  .command('relayer')
  .description('Start the relayer watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      await startCommitTransferWatchers()
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
