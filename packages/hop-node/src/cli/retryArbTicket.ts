import { Chain } from 'src/constants'
import {
  getXDomainMessageRelayWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseString, parseStringArray, root } from './shared'

root
  .command('retry-arb-ticket')
  .description('Retry a stuck Arbitrum ticket')
  .option('--token <symbol>', 'Token', parseString)
  .option('--tx-hashes <hash, ...>', 'Comma-separated L1 tx hashes', parseStringArray)
  .action(actionHandler(main))

async function main (source: any) {
  const { token, txHashes } = source

  if (!token) {
    throw new Error('Token not found')
  }
  if (!txHashes?.length) {
    throw new Error('Tx hash not found')
  }

  const dryMode = false
  const watcher = await getXDomainMessageRelayWatcher({ token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const chainSlug = Chain.Arbitrum
  for (const txHash of txHashes) {
    await watcher.redeemArbitrumTransaction(txHash, chainSlug)
  }
}
