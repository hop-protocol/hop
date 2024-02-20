import L2Bridge from 'src/watchers/classes/L2Bridge.js'
import { chainSlugToId } from '@hop-protocol/hop-node-core/utils'
import { WatcherNotFoundError } from './shared/utils.js'
import { actionHandler, logger, parseString, root } from './shared/index.js'
import {
  getCommitTransfersWatcher
} from 'src/watchers/watchers.js'

root
  .command('pending-transfers')
  .description('Get pending transfer IDs')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--destination-chain <slug>', 'Destination chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { sourceChain, destinationChain, token } = source
  if (!sourceChain) {
    throw new Error('source chain is required')
  }
  if (!destinationChain) {
    throw new Error('destination chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  const watcher = await getCommitTransfersWatcher({ chain: sourceChain, token, dryMode: true })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
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
}
