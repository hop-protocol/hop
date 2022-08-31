import chainSlugToId from 'src/utils/chainSlugToId'
import { actionHandler, parseBool, parseString, root } from './shared'
import { getCommitTransfersWatcher } from 'src/watchers/watchers'

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
    throw new Error('watcher not found')
  }

  const destinationChainId = chainSlugToId(destinationChain)
  await watcher.checkIfShouldCommit(destinationChainId)
}
