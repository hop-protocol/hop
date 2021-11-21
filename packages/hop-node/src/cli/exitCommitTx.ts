import xDomainMessageRelayWatcher from 'src/watchers/xDomainMessageRelayWatcher'
import ArbitrumBridgeWatcher from 'src/watchers/ArbitrumBridgeWatcher'
import OptimismBridgeWatcher from 'src/watchers/OptimismBridgeWatcher'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'
import { findWatcher, getWatchers } from 'src/watchers/watchers'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

type ExitWatcher = xDaiBridgeWatcher | PolygonBridgeWatcher | OptimismBridgeWatcher | ArbitrumBridgeWatcher

program
  .command('exit-commit-tx')
  .description('Exit the commit transaction')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--token <string>', 'Token')
  .option('--tx-hash <string>', 'Tx hash with CommitTransfers event log')
  .option(
    '-d, --dry',
    'Start in dry mode. If enabled, no transactions will be sent.'
  )
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }

      const chain = source.chain
      const token = source.token
      const commitTxHash = source.txHash
      const dryMode = !!source.dry
      if (!chain) {
        throw new Error('chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }
      if (!commitTxHash) {
        throw new Error('commit tx hash is required')
      }

      const watchers = await getWatchers({
        enabledWatchers: ['xDomainMessageRelay'],
        tokens: [token],
        dryMode
      })

      const watcher = findWatcher(watchers, xDomainMessageRelayWatcher, chain) as xDomainMessageRelayWatcher
      if (!watcher) {
        throw new Error('watcher not found')
      }

      const chainSpecificWatcher: ExitWatcher = watcher.watchers[chain]
      await chainSpecificWatcher.relayXDomainMessage(commitTxHash)
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
