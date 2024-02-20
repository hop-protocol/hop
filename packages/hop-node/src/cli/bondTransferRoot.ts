import { SendBondTransferRootTxParams } from 'src/watchers/BondTransferRootWatcher.js'
import { WatcherNotFoundError } from './shared/utils.js'
import {
  getBondTransferRootWatcher
} from 'src/watchers/watchers.js'

import { actionHandler, parseBool, parseString, parseStringArray, root } from './shared/index.js'

root
  .command('bond-transfer-root')
  .description('Bond transfer root')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--root-hashes <hash, ...>', 'Comma-separated transfer root hashes', parseStringArray)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const {
    sourceChain: chain,
    token,
    rootHashes,
    dry: dryMode
  } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!rootHashes?.length) {
    throw new Error('transfer root hash is required')
  }

  const watcher = await getBondTransferRootWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }

  for (const rootHash of rootHashes) {
    const dbTransferRoot: any = await watcher.db.transferRoots.getByTransferRootHash(rootHash)
    if (!dbTransferRoot) {
      throw new Error('TransferRoot does not exist in the DB')
    }

    const txParams: SendBondTransferRootTxParams = {
      transferRootId: dbTransferRoot.transferRootId!,
      transferRootHash: rootHash,
      destinationChainId: dbTransferRoot.destinationChainId!,
      totalAmount: dbTransferRoot.totalAmount!,
      transferIds: dbTransferRoot.transferIds!,
      rootCommittedAt: dbTransferRoot.committedAt!
    }

    await watcher.sendBondTransferRoot(txParams)
  }
}
