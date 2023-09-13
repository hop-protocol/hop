import chainSlugToId from 'src/utils/chainSlugToId'
import { RelayL1ToL2MessageOpts } from 'src/watchers/classes/IChainWatcher'
import {
  getL1ToL2RelayWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseNumber, parseString, parseStringArray, root } from './shared'

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
    throw new Error('watcher not found')
  }

  const chainId = chainSlugToId(chain)
  const relayL1ToL2MessageOpts: RelayL1ToL2MessageOpts = {
    messageIndex: messageIndex ?? 0
  }
  for (const txHash of txHashes) {
    await watcher.sendRelayTx(chainId, txHash, relayL1ToL2MessageOpts)
  }
}
