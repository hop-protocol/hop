import CommitTransfersWatcher from 'src/watchers/CommitTransfersWatcher'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import chainSlugToId from 'src/utils/chainSlugToId'
import { actionHandler, logger, parseString, root } from './shared'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'

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

  const watchers = await getWatchers({
    enabledWatchers: ['commitTransfers'],
    tokens: [token],
    dryMode: true
  })

  const watcher = findWatcher(watchers, CommitTransfersWatcher, sourceChain) as CommitTransfersWatcher
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const destinationChainId = chainSlugToId(destinationChain)!
  const bridge = (watcher.bridge as L2Bridge)
  const exists = await bridge.doPendingTransfersExist(destinationChainId)
  if (!exists) {
    logger.debug('no pending transfers exists')
    process.exit(0)
  }

  const pendingTransfers = await bridge.getPendingTransfers(destinationChainId)
  logger.debug(pendingTransfers)
}
