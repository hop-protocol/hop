import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseBool, parseInputFileList, parseString, parseStringArray, root } from './shared'

root
  .command('bond-withdrawal')
  .description('Bond withdrawal')
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-ids <id, ...>', 'Comma-separated transfer ids', parseStringArray)
  .option('--transfer-ids-file <filepath>', 'Filenamepath containing list of transfer IDs', parseInputFileList)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  let { token, dry: dryMode, transferIds, transferIdsFile: transferIdsFileList } = source
  if (transferIdsFileList && !transferIds) {
    transferIds = transferIdsFileList
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!transferIds?.length) {
    throw new Error('transfer ID is required')
  }

  const watcher = await getBondWithdrawalWatcher({ token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  for (const transferId of transferIds) {
    try {
      const dbTransfer: any = await watcher.db.transfers.getByTransferId(transferId)
      if (!dbTransfer) {
        throw new Error('TransferId does not exist in the DB')
      }
      dbTransfer.attemptSwap = watcher.bridge.shouldAttemptSwap(dbTransfer.amountOutMin, dbTransfer.deadline)
      if (dbTransfer.attemptSwap && dbTransfer.destinationChainId === 1) {
        throw new Error('Cannot bond transfer because a swap is being attempted on mainnet. Please withdraw instead.')
      }

      await watcher.sendBondWithdrawalTx(dbTransfer)
    } catch (err: any) {
      console.log(err)
      // nop
    }
  }

  console.log('complete')
}
