import { SendBondWithdrawalTxParams } from 'src/watchers/BondWithdrawalWatcher'
import { Transfer } from 'src/db/TransfersDb'
import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseBool, parseInputFileList, parseString, parseStringArray, root } from './shared'

root
  .command('bond-withdrawal')
  .description('Bond withdrawal')
  .option('--source-chain <slug>', 'Source chain', parseString)
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
  let {
    sourceChain: chain,
    token,
    dry: dryMode,
    transferIds,
    transferIdsFile: transferIdsFileList
  } = source
  if (!chain) {
    throw new Error('chain is required in order to apply correct reorg redundant protection')
  }
  if (transferIdsFileList && !transferIds) {
    transferIds = transferIdsFileList
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!transferIds?.length) {
    throw new Error('transfer ID is required')
  }

  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  for (const transferId of transferIds) {
    try {
      const dbTransfer: Transfer = await watcher.db.transfers.getByTransferId(transferId)
      if (!dbTransfer) {
        throw new Error('TransferId does not exist in the DB')
      }
      if (dbTransfer.sourceChainSlug !== chain) {
        throw new Error('Source chain from DB does not match the source chain')
      }
      const attemptSwap = watcher.bridge.shouldAttemptSwapDuringBondWithdrawal(dbTransfer.amountOutMin, dbTransfer.deadline)
      if (attemptSwap && dbTransfer.destinationChainId === 1) {
        throw new Error('Cannot bond transfer because a swap is being attempted on mainnet. Please withdraw instead.')
      }

      const txParams: SendBondWithdrawalTxParams = ({
        transferId: dbTransfer.transferId,
        sender: dbTransfer.sender!,
        recipient: dbTransfer.recipient!,
        amount: dbTransfer.amount!,
        transferNonce: dbTransfer.transferNonce!,
        bonderFee: dbTransfer.bonderFee!,
        attemptSwap,
        destinationChainId: dbTransfer.destinationChainId!,
        amountOutMin: dbTransfer.amountOutMin!,
        deadline: dbTransfer.deadline!,
        transferSentIndex: dbTransfer.transferSentIndex!
      })
      await watcher.sendBondWithdrawalTx(txParams)
    } catch (err: any) {
      console.log(err)
      // nop
    }
  }

  console.log('complete')
}
