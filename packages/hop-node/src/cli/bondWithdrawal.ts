import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'
import { Chain } from 'src/constants'

import { actionHandler, parseBool, parseString, parseStringArray, root } from './shared'

root
  .command('bond-withdrawal')
  .description('Bond withdrawal')
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-ids <id, ...>', 'Comma-separated transfer ids', parseStringArray)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { token, dry: dryMode, transferIds } = source
  if (!token) {
    throw new Error('token is required')
  }
  if (!transferIds) {
    throw new Error('transfer ID is required')
  }

  const watcher = await getBondWithdrawalWatcher({ token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const chain = Chain.Arbitrum
  const arbitrumWatcher = await getBondWithdrawalWatcher({ token, dryMode, chain })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  for (const transferId of transferIds) {
    const dbTransfer: any = await watcher.db.transfers.getByTransferId(transferId)
    if (!dbTransfer) {
      throw new Error('TransferId does not exist in the DB')
    }
    dbTransfer.attemptSwap = watcher.bridge.shouldAttemptSwap(dbTransfer.amountOutMin, dbTransfer.deadline)
    if (dbTransfer.attemptSwap && dbTransfer.destinationChainId === 1) {
      throw new Error('Cannot bond transfer because a swap is being attempted on mainnet. Please withdraw instead.')
    }

    // Check if spent and skip if so
    const isSpent = await arbitrumWatcher.bridge.isTransferIdSpent(transferId)
    if (isSpent) continue

    await watcher.sendBondWithdrawalTx(dbTransfer)
  }
}
