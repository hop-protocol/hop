import { chainSlugToId } from '@hop-protocol/hop-node-core/utils'
import { WatcherNotFoundError } from './shared/utils.js'
import {
  getL1ToL2RelayWatcher
} from '#watchers/watchers.js'

import { actionHandler, parseNumber, parseString, parseStringArray, root } from './shared/index.js'

root
  .command('relay-l1-to-l2-message')
  .description('Relay a message from L1 to L2')
  .option('--chain <slug>', 'Source chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--message-index <number>', 'Message index of redemption transaction for Arbitrum', parseNumber)
  .option('--tx-hashes <hash, ...>', 'Comma-separated L1 tx hashes', parseStringArray)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, messageIndex, txHashes } = source

  if (!chain) {
    throw new Error('Chain not found')
  }
  if (!token) {
    throw new Error('Token not found')
  }
  if (!txHashes?.length) {
    throw new Error('Tx hash not found')
  }

  if (txHashes?.length > 1 && messageIndex) {
    throw new Error('Cannot specify message index when retrying multiple tx hashes')
  }

  const dryMode = false
  const watcher = await getL1ToL2RelayWatcher({ token, dryMode })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }

  const chainId = chainSlugToId(chain)
  for (const txHash of txHashes) {
    await watcher.sendRelayTx(chainId, txHash, messageIndex ?? 0)
  }
}
