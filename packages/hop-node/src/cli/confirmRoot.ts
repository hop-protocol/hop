import ArbitrumBridgeWatcher from 'src/watchers/ArbitrumBridgeWatcher'
import GnosisBridgeWatcher from 'src/watchers/GnosisBridgeWatcher'
import OptimismBridgeWatcher from 'src/watchers/OptimismBridgeWatcher'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import { actionHandler, parseBool, parseInputFileList, parseString, parseStringArray, root } from './shared'
import { getXDomainMessageRelayWatcher } from 'src/watchers/watchers'
import { BigNumber } from 'ethers'

type ExitWatcher = GnosisBridgeWatcher | PolygonBridgeWatcher | OptimismBridgeWatcher | ArbitrumBridgeWatcher
type ConfirmRootData = {
  rootHash: string
  destinationChainId: string
  totalAmount: string
  rootCommittedAt: string
}

root
  .command('confirm-root')
  .description('Confirm a root with an exit from the canonical bridge or with the messenger wrapper')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--tx-hashes <hash, ...>', 'Comma-separated tx hashes with CommitTransfers event log', parseStringArray)
  .option('--roots-data-file <filepath>', 'Filenamepath containing list of roots to be confirmed', parseInputFileList)
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
    rootsDataFile: rootsDataFileList,
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
    if (!rootsDataFileList) {
      throw new Error('root data is required when bypassing canonical bridge')
    }
  } else {
    if (!commitTxHashes?.length) {
      throw new Error('commit tx hash is required')
    }
    if (rootsDataFileList) {
      throw new Error('root is not supported when exiting via the canonical messenger')
    }
  }

  const watcher = await getXDomainMessageRelayWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  if (bypassCanonicalBridge) {
    const rootData = rootsDataFileList.map((data: ConfirmRootData) => {
      return {
        rootHash: data.rootHash,
        destinationChainId: Number(data.destinationChainId),
        totalAmount: BigNumber.from(data.totalAmount),
        rootCommittedAt: Number(data.rootCommittedAt)
      }
    })
    await watcher.confirmRootsViaWrapper(rootData)
  } else {
    const chainSpecificWatcher: ExitWatcher = watcher.watchers[chain]
    for (const commitTxHash of commitTxHashes) {
      await chainSpecificWatcher.relayXDomainMessage(commitTxHash)
    }
  }
  console.log('done')
}
