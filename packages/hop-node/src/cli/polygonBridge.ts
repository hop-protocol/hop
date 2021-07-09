import { logger, program } from './shared'
import {
  setGlobalConfigFromConfigFile,
  Config,
  parseConfigFile
} from './shared/config'
import db from 'src/db'
import { startCommitTransferWatchers } from 'src/watchers/watchers'
import LoadTest from 'src/loadTest'
import { db as dbConfig, config as globalConfig } from 'src/config'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import { Chain } from 'src/constants'

program
  .command('polygon-bridge')
  .description('Start the polygon bridge watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const tokens = Object.keys(globalConfig.tokens)
      for (let token of tokens) {
        new PolygonBridgeWatcher({
          chainSlug: Chain.Polygon,
          token
        }).start()
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
