import L2Bridge from 'src/watchers/classes/L2Bridge'
import getTransferSent from 'src/theGraph/getTransferSent'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { WatcherNotFoundError } from './shared/utils'
import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'

import getTransferCommitted from 'src/theGraph/getTransferCommitted'
import getTransferRootId from 'src/utils/getTransferRootId'
import { actionHandler, parseBool, parseString, parseStringArray, root } from './shared'

root
  .command('resync-data')
  .description('Resync data for a given transfer ID or root')
  .option('--chain <slug>', 'Source chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-ids <id, ...>', 'Comma-separated transfer ids', parseStringArray)
  .option('--transfer-roots <root, ...>', 'Comma-separated transfer roots', parseStringArray)
  .option('--mark-as-found [boolean]', 'Mark a DB item as found', parseBool)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const {
    chain,
    token,
    transferIds,
    transferRoots,
    markAsFound
  } = source

  console.log('chain', chain, token, transferIds, transferRoots)

  if (!chain) {
    throw new Error('source chain is required in order to apply correct reorg redundant protection')
  }
  if (!transferIds?.length && !transferRoots?.length) {
    throw new Error('transfer ID or root is required')
  }

  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode: true })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }

  // TODO: Add L1 -> L2
  // TODO: Modularize

  if (transferIds) {
    await handleTransferIds(watcher, chain, transferIds, markAsFound)
  }

  if (transferRoots) {
    await handleTransferRoots(watcher, chain, token, transferRoots, markAsFound)
  }
}

async function handleTransferIds (watcher: any, chain: string, transferIds: string[], markAsFound?: boolean) {
  const blockNumbers: number[] = []
  for (const transferId of transferIds) {
    const transfer = await getTransferSent(chain, transferId)
    if (!transfer) {
      throw new Error(`Transfer ${transferId} not found`)
    }
    blockNumbers.push(transfer.blockNumber)
  }

  if (blockNumbers.length !== transferIds.length) {
    throw new Error('Block numbers and transfer IDs mismatch')
  }

  const bridge = (watcher.bridge as L2Bridge)
  for (let i = 0; i < transferIds.length; i++) {
    const transferId = transferIds[i]
    const blockNumber = blockNumbers[i]

    const l2BridgeContract = bridge.bridgeContract as L2BridgeContract
    const events = await l2BridgeContract.queryFilter(
      l2BridgeContract.filters.TransferSent(),
      blockNumber,
      blockNumber
    )

    for (const event of events) {
      if (event.args?.transferId === transferId) {
        await watcher.syncWatcher.handleTransferSentEvent(event)
        await watcher.syncWatcher.populateTransferDbItem(event.args.transferId)
        break
      }
    }

    if (markAsFound) {
      await watcher.syncWatcher.markItemAsFound('transfer', transferId)
    }
  }

}

async function handleTransferRoots (watcher: any, chain: string, token: string, transferRoots: string[], markAsFound?: boolean) {
  const blockNumbers: number[] = []
  for (const transferRoot of transferRoots) {
    const commit = await getTransferCommitted(chain, token, transferRoot)
    if (!commit) {
      throw new Error(`commit for root ${transferRoot} not found`)
    }
    blockNumbers.push(commit.blockNumber)
  }

  if (blockNumbers.length !== transferRoots.length) {
    throw new Error('Block numbers and transfer root mismatch')
  }

  const bridge = (watcher.bridge as L2Bridge)
  for (let i = 0; i < transferRoots.length; i++) {
    const transferRoot = transferRoots[i]
    const blockNumber = blockNumbers[i]

    const l2BridgeContract = bridge.bridgeContract as L2BridgeContract
    const events = await l2BridgeContract.queryFilter(
      l2BridgeContract.filters.TransfersCommitted(),
      blockNumber,
      blockNumber
    )

    let transferRootId
    for (const event of events) {
      if (event.args?.rootHash === transferRoot) {
        await watcher.syncWatcher.handleTransfersCommittedEvent(event)
        // Uses the ID, not the hash
        transferRootId = getTransferRootId(event.args.rootHash, event.args.totalAmount)
        await watcher.syncWatcher.populateTransferRootDbItem(transferRootId)
        break
      }
    }

    if (!transferRootId) {
      throw new Error(`transfer root ${transferRoot} not found`)
    }

    if (markAsFound) {
      await watcher.syncWatcher.markItemAsFound('transfer', transferRootId)
    }
  }
}
