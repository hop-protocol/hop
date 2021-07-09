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
import { getTransferIdsForTransferRoot } from 'src/theGraph'

program
  .command('transfer-ids')
  .description('Get transfer IDs for transfer root  hash')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const transferRootHash = source.args[0]
      const chain = source.chain
      if (!transferRootHash) {
        throw new Error('transfer root hash is required')
      }
      if (!chain) {
        throw new Error('chain is required')
      }
      const transferIds = await getTransferIdsForTransferRoot(
        chain,
        transferRootHash
      )
      console.log(JSON.stringify(transferIds, null, 2))
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
