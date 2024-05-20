import { WatcherNotFoundError } from './shared/utils.js'
import { actionHandler, parseBool, parseString, parseStringArray, root } from './shared/index.js'
import { chainSlugToId } from '#utils/chainSlugToId.js'
import { getCommitTransfersWatcher } from '#watchers/watchers.js'

root
  .command('commit-transfers')
  .description('Start the relayer watcher')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--destination-chains <slug, ...>', 'Comma-separated destination chains', parseStringArray)
  .option('--token <symbol>', 'Token', parseString)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { config, sourceChain, destinationChains, token, dry: dryMode } = source
  if (!sourceChain) {
    throw new Error('source chain is required')
  }
  if (!destinationChains?.length) {
    throw new Error('destination chains required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  const watcher = await getCommitTransfersWatcher({ chain: sourceChain, token, dryMode })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }

  for (const destinationChain of destinationChains) {
    console.log(`\n\nCommitting from ${sourceChain} to ${destinationChain}...\n\n`)
    const destinationChainId = chainSlugToId(destinationChain)
    await watcher.checkIfShouldCommit(destinationChainId)
  }
}
