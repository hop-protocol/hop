import L2Bridge from 'src/watchers/classes/L2Bridge'
import getTransferSent from 'src/theGraph/getTransferSent'
import { WatcherNotFoundError } from './shared/utils'
import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseBool, parseString, parseStringArray, root } from './shared'

root
  .command('resync-transfer')
  .description('Resync transfer')
  .option('--chain <slug>', 'Source chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-ids <id, ...>', 'Comma-separated transfer ids', parseStringArray)
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
    transferIds
  } = source

  if (!chain) {
    throw new Error('source chain is required in order to apply correct reorg redundant protection')
  }
  if (!transferIds?.length) {
    throw new Error('transfer ID is required')
  }

  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode: true })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }

  // TODO: Add L1 -> L2
  // TODO: Add roots (and others)

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

    const events = await bridge.bridgeContract.queryFilter(
      bridge.l2BridgeWriteContract.filters.TransferSent(),
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
  }
}
