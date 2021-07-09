import { logger, program } from './shared'
import {
  setGlobalConfigFromConfigFile,
  Config,
  parseConfigFile
} from './shared/config'
import db from 'src/db'
import {
  getStakeWatchers,
  startCommitTransferWatchers
} from 'src/watchers/watchers'
import LoadTest from 'src/loadTest'
import {
  db as dbConfig,
  config as globalConfig,
  setConfigByNetwork
} from 'src/config'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import { Chain } from 'src/constants'
import Token from 'src/watchers/classes/Token'
import contracts from 'src/contracts'
import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'

program
  .command('xdai-bridge')
  .description('Start the xDai bridge watcher')
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
        new xDaiBridgeWatcher({
          chainSlug: Chain.xDai,
          token
        }).start()
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
