import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import {
  startChallengeWatchers
} from 'src/watchers/watchers'

program
  .command('challenger')
  .description('Start the challenger watcher')
  .option('--config <string>', 'Config file to use.')
  .option(
    '--dry',
    'Start in dry mode. If enabled, no transactions will be sent.'
  )
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      await startChallengeWatchers({
        dryMode: source.dryMode
      })
    } catch (err) {
      logger.error(err)
    }
  })
