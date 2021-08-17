import CommitTransferWatcher from 'src/watchers/CommitTransferWatcher'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { chainSlugToId } from 'src/utils'
import { logger, program } from './shared'
import { startWatchers } from 'src/watchers/watchers'

program
  .command('commit-transfers')
  .description('Start the relayer watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--source-chain <string>', 'Source chain')
  .option('--destination-chain <string>', 'Destination chain')
  .option('--token <string>', 'Token')
  .option('--transfer-id <string>', 'Transfer ID')
  .option(
    '-d, --dry',
    'Start in dry mode. If enabled, no transactions will be sent.'
  )
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
      const dryMode = !!source.dry
      if (!sourceChain) {
        throw new Error('source chain is required')
      }
      if (!destinationChain) {
        throw new Error('destination chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }

      const { watchers } = startWatchers({
        enabledWatchers: ['commitTransfers'],
        tokens: [token],
        start: false,
        dryMode
      })

      const watcher = watchers.find(watcher => {
        if (watcher instanceof CommitTransferWatcher) {
          if (watcher.chainSlug === sourceChain) {
            return watcher
          }
        }
        return null
      })

      if (!watcher) {
        throw new Error('watcher not found')
      }

      const destinationChainId = chainSlugToId(destinationChain)
      await watcher.checkIfShouldCommit(destinationChainId)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
