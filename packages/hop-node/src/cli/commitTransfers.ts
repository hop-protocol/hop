import { chainSlugToId } from '@hop-protocol/hop-node-core/utils'
import { WatcherNotFoundError } from './shared/utils.js'
import { actionHandler, parseBool, parseString, root } from './shared/index.js'
import { getCommitTransfersWatcher } from '#src/watchers/watchers.js'

root
  .command('commit-transfers')
  .description('Start the relayer watcher')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--destination-chain <slug>', 'Destination chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { config, sourceChain, destinationChain, token, dry: dryMode } = source
  if (!sourceChain) {
    throw new Error('source chain is required')
  }
  if (!destinationChain) {
    throw new Error('destination chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  const watcher = await getCommitTransfersWatcher({ chain: sourceChain, token, dryMode })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }

  const destinationChainId = chainSlugToId(destinationChain)
  await watcher.checkIfShouldCommit(destinationChainId)
}
