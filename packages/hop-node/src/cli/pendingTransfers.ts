import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import chainSlugToId from 'src/utils/chainSlugToId'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'
import { logger, program } from './shared'

program
  .command('pending-transfers')
  .description('Get pending transfer IDs')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--source-chain <string>', 'Source chain')
  .option('--destination-chain <string>', 'Destination chain')
  .option('--token <string>', 'Token')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const sourceChain = source.sourceChain
      const destinationChain = source.destinationChain
      const token = source.token
      if (!sourceChain) {
        throw new Error('source chain is required')
      }
      if (!destinationChain) {
        throw new Error('destination chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }

      const watchers = getWatchers({
        enabledWatchers: ['commitTransfers'],
        tokens: [token],
        dryMode: true
      })

      const watcher = findWatcher(watchers, CommitTransferWatcher, sourceChain) as CommitTransferWatcher
      if (!watcher) {
        throw new Error('watcher not found')
      }

      const destinationChainId = chainSlugToId(destinationChain)
      const bridge = (watcher.bridge as L2Bridge)
      const exists = await bridge.doPendingTransfersExist(destinationChainId)
      if (!exists) {
        logger.debug('no pending transfers exists')
        process.exit(0)
      }

      const pendingTransfers = await bridge.getPendingTransfers(destinationChainId)
      logger.debug(pendingTransfers)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
