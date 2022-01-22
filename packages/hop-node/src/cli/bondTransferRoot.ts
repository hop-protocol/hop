import BondTransferRootWatcher from 'src/watchers/BondTransferRootWatcher'
import {
  findWatcher,
  getWatchers
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
  const { sourceChain: chain, token, dry: dryMode, rootHash } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!rootHash) {
    throw new Error('transfer root hash is required')
  }

  const watchers = await getWatchers({
    enabledWatchers: ['bondTransferRoot'],
    tokens: [token],
    dryMode
  })

  const watcher = findWatcher(watchers, BondTransferRootWatcher, chain) as BondTransferRootWatcher 
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const dbTransferRoot: any = await watcher.db.transferRoots.getByTransferRootHash(rootHash)
  if (!dbTransferRoot) {
    throw new Error('Transfer root does not exist in the DB')
  }

  const {
    destinationChainId,
    totalAmount
  } = dbTransferRoot

  if (!destinationChainId) {
    throw new Error('destinationChainId is required')
  }
  if (!totalAmount) {
    throw new Error('totalAmount is required')
  }

  await watcher.sendBondTransferRoot(rootHash, destinationChainId, totalAmount)
}
