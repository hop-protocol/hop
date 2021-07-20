import {
  Config,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from './shared/config'
import { logger, program } from './shared'

import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'
import { Chain } from 'src/constants'
import {
  config as globalConfig
} from 'src/config'

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
      for (const token of tokens) {
        new xDaiBridgeWatcher({
          chainSlug: Chain.xDai,
          tokenSymbol: token
        }).start()
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
