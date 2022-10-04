import {
  getL1ToL2RelayWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseNumber, parseString, parseStringArray, root } from './shared'

root
  .command('retry-arb-ticket')
  .description('Retry a stuck Arbitrum ticket')
  .option('--token <symbol>', 'Token', parseString)
  .option('--message-index <number>', 'Message index of redemption transaction', parseNumber)
  .option('--tx-hashes <hash, ...>', 'Comma-separated L1 tx hashes', parseStringArray)
  .action(actionHandler(main))

async function main (source: any) {
  let { token, messageIndex, txHashes } = source

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
    throw new Error('watcher not found')
  }

  messageIndex = messageIndex ?? 0
  for (const txHash of txHashes) {
    await watcher.sendRelayTx(txHash, messageIndex)
  }
}
