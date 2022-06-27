import {
  getBondTransferRootWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseBool, parseString, root } from './shared'

root
  .command('bond-transfer-root')
  .description('Bond transfer root')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--root-hash <hash>', 'Transfer root hash', parseString)
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
    rootHash,
    totalAmount,
    dry: dryMode
  } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!rootHash) {
    throw new Error('transfer root hash is required')
  }
  if (!totalAmount) {
    throw new Error('total amount is required')
  }

  const watcher = await getBondTransferRootWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const dbTransferRoot: any = await watcher.db.transferRoots.getByTransferRootHash(rootHash)
  if (!dbTransferRoot) {
    throw new Error('TransferRoot does not exist in the DB')
  }

  await watcher.sendBondTransferRoot(rootHash, dbTransferRoot.destinationChainId, dbTransferRoot.totalAmount)
}
