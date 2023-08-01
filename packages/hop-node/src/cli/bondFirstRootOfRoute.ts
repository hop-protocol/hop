import L1Bridge from 'src/watchers/classes/L1Bridge'
import MerkleTree from 'src/utils/MerkleTree'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import { Chain } from 'src/constants'
import { actionHandler, parseString, root } from './shared'
import {
  getBondTransferRootWatcher
} from 'src/watchers/watchers'

root
  .command('bond-first-root-of-route')
  .description('Bond the first root of a route')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-root-hash <hash>', 'Transfer root hash', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  let { chain, token, transferRootHash, args } = source
  if (!transferRootHash) {
    transferRootHash = args[0]
  }
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!transferRootHash) {
    throw new Error('transfer root hash is required')
  }

  const transferRoot = await getTransferRoot(
    chain,
    token,
    transferRootHash
  )

  if (!transferRoot?.transferIds?.length) {
    throw new Error('No transfer IDs found')
  }

  const transferIds: string[] = []
  for (const transfer of transferRoot.transferIds) {
    transferIds.push(transfer.transferId)
  }

  const tree = new MerkleTree(transferIds)
  const rootHash = tree.getHexRoot()
  if (rootHash !== transferRootHash) {
    throw new Error('calculated transfer root hash does not match')
  }

  const watcher = await getBondTransferRootWatcher({ chain, token, dryMode: true })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const dbTransferRoot: any = await watcher.db.transferRoots.getByTransferRootHash(rootHash)

  // Sanity checks
  if (!dbTransferRoot) {
    throw new Error('TransferRoot does not exist in the DB')
  }
  if (dbTransferRoot.transferIds?.length) {
    throw new Error('TransferRoot already has transfer IDs')
  }

  const l1Bridge = watcher.bridge as L1Bridge
  return l1Bridge.bondTransferRoot(
    transferRootHash,
    dbTransferRoot.destinationChainId,
    dbTransferRoot.totalAmount
  )
}
