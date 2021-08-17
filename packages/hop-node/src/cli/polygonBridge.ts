import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import { Chain } from 'src/constants'
import {
  FileConfig,
  config as globalConfig,
  parseConfigFile
  , setGlobalConfigFromConfigFile
} from 'src/config'

import { logger, program } from './shared'

program
  .command('polygon-bridge')
  .description('Start the polygon bridge watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const tokens = Object.keys(globalConfig.tokens)
      for (const token of tokens) {
        new PolygonBridgeWatcher({
          chainSlug: Chain.Polygon,
          tokenSymbol: token
        }).start()
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
