import { isL1ChainId } from '@hop-protocol/hop-node-core/utils'
import { SendBondWithdrawalTxParams } from '#src/watchers/BondWithdrawalWatcher.js'
import { Transfer } from '#src/db/TransfersDb.js'
import { WatcherNotFoundError } from './shared/utils.js'
import {
  getBondWithdrawalWatcher
} from '#src/watchers/watchers.js'

import { actionHandler, parseBool, parseInputFileList, parseString, parseStringArray, root } from './shared/index.js'

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
    throw new Error('source chain is required in order to apply correct reorg redundant protection')
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
    throw new Error(WatcherNotFoundError)
  }

  for (const transferId of transferIds) {
    try {
      const dbTransfer: Transfer | null = await watcher.db.transfers.getByTransferId(transferId)
      if (!dbTransfer) {
        throw new Error('TransferId does not exist in the DB')
      }
      if (dbTransfer.sourceChainSlug !== chain) {
        throw new Error(`Source chain from DB does not match the source chain: dbTransfer.sourceChainSlug=${dbTransfer.sourceChainSlug}, chain=${chain}`)
      }
      const attemptSwap = watcher.bridge.shouldAttemptSwapDuringBondWithdrawal(dbTransfer.amountOutMin!, dbTransfer.deadline!)
      if (attemptSwap && isL1ChainId(dbTransfer.destinationChainId!)) {
        throw new Error('Cannot bond transfer because a swap is being attempted on mainnet. Please withdraw instead.')
      }

      const txParams: SendBondWithdrawalTxParams = {
        transferId: dbTransfer.transferId,
        recipient: dbTransfer.recipient!,
        amount: dbTransfer.amount!,
        transferNonce: dbTransfer.transferNonce!,
        bonderFee: dbTransfer.bonderFee!,
        attemptSwap,
        destinationChainId: dbTransfer.destinationChainId!,
        amountOutMin: dbTransfer.amountOutMin!,
        deadline: dbTransfer.deadline!,
        transferSentIndex: dbTransfer.transferSentIndex!,
        transferSentTimestamp: dbTransfer.transferSentTimestamp!,
        isFinalized: dbTransfer.isFinalized!
      }
      await watcher.sendBondWithdrawalTx(txParams)
    } catch (err: any) {
      console.log(err)
      // nop
    }
  }

  console.log('complete')
}
