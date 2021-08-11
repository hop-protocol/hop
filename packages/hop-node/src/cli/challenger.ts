import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'
import {
  startChallengeWatchers
} from 'src/watchers/watchers'

program
  .command('challenger')
  .description('Start the challenger watcher')
  .option('--config <string>', 'Config file to use.')
  .option(
    '-d, --dry',
    'Start in dry mode. If enabled, no transactions will be sent.'
  )
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      await startChallengeWatchers(undefined, undefined, source.dryMode)
    } catch (err) {
      logger.error(err.message)
    }
  })
