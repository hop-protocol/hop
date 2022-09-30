import ArbitrumBridgeWatcher from 'src/watchers/ArbitrumBridgeWatcher'
import GnosisBridgeWatcher from 'src/watchers/GnosisBridgeWatcher'
import OptimismBridgeWatcher from 'src/watchers/OptimismBridgeWatcher'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import { actionHandler, parseBool, parseInputFileList, parseString, parseStringArray, root } from './shared'
import { getXDomainMessageRelayWatcher } from 'src/watchers/watchers'

type ExitWatcher = GnosisBridgeWatcher | PolygonBridgeWatcher | OptimismBridgeWatcher | ArbitrumBridgeWatcher

root
  .command('confirm-root')
  .description('Confirm a root')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--tx-hashes <hash, ...>', 'Comma-separated tx hashes with CommitTransfers event log', parseStringArray)
  .option('--roots <root, ...>', 'Comma-separated roots to be confirmed', parseStringArray)
  .option('--roots-file <filepath>', 'Filenamepath containing list of roots to be confirmed', parseInputFileList)
  .option('--bypass-canonical-bridge [boolean]', 'Confirm a root via the messenger wrapper', parseBool)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const {
    chain,
    token,
    txHashes: commitTxHashes,
    roots,
    rootsFile: rootsFileList,
    bypassCanonicalBridge,
    dry: dryMode
  } = source

  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  if (bypassCanonicalBridge) {
    if (commitTxHashes?.length) {
      throw new Error('commit tx hash is not supported when bypassing canonical bridge')
    }
    if (!roots?.length && !rootsFileList) {
      throw new Error('root is required when bypassing canonical bridge')
    }
    if (roots?.length && rootsFileList) {
      throw new Error('only specify roots or roots file, not both')
    }
  } else {
    if (!commitTxHashes?.length) {
      throw new Error('commit tx hash is required')
    }
    if (roots?.length || rootsFileList) {
      throw new Error('root is not supported when exiting via the canonical messenger')
    }
  }

  const watcher = await getXDomainMessageRelayWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const chainSpecificWatcher: ExitWatcher = watcher.watchers[chain]

  if (bypassCanonicalBridge) {
    const confirmationRoots = roots ?? rootsFileList
    for (const confirmationRoot of confirmationRoots) {
    }
  } else {
    for (const commitTxHash of commitTxHashes) {
      await chainSpecificWatcher.relayXDomainMessage(commitTxHash)
    }
  }
  console.log('done')
}
