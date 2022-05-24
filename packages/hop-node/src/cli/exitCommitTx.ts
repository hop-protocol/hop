import ArbitrumBridgeWatcher from 'src/watchers/ArbitrumBridgeWatcher'
import GnosisBridgeWatcher from 'src/watchers/GnosisBridgeWatcher'
import OptimismBridgeWatcher from 'src/watchers/OptimismBridgeWatcher'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import { actionHandler, parseBool, parseString, root } from './shared'
import { getXDomainMessageRelayWatcher } from 'src/watchers/watchers'

type ExitWatcher = GnosisBridgeWatcher | PolygonBridgeWatcher | OptimismBridgeWatcher | ArbitrumBridgeWatcher

root
  .command('exit-commit-tx')
  .description('Exit the commit transaction')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--tx-hashes <hash>', 'Comma-separated tx hashes with CommitTransfers event log', parseString)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, txHash: commitTxHash, txHashes: commitTxHashes, dry: dryMode } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!commitTxHashes) {
    throw new Error('commit tx hash is required')
  }

  const watcher = await getXDomainMessageRelayWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const chainSpecificWatcher: ExitWatcher = watcher.watchers[chain]
  const txHashes = commitTxHashes.split(',')
  for (const txHash of txHashes) {
    await chainSpecificWatcher.relayXDomainMessage(txHash)
  }
  console.log('done')
}
