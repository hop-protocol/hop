import {
  config as globalConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'
import { Chain } from 'src/constants'

program
  .command('xdai-bridge')
  .description('Start the xDai bridge watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const tokens = Object.keys(globalConfig.tokens ?? {})
      const promises: Array<Promise<void>> = []
      for (const token of tokens) {
        promises.push(new xDaiBridgeWatcher({
          chainSlug: Chain.xDai,
          tokenSymbol: token
        }).start())
      }
      await Promise.all(promises)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
