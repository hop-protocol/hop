import { useCallback } from 'react'
import { errors, ContractTransaction } from 'ethers'
import { TxHistory } from 'src/contexts/AppContext/useTxHistory'
import Transaction from 'src/models/Transaction'
import { getTransferSentDetailsFromLogs } from 'src/utils/logs'

function useTransactionReplacement(txHistory?: TxHistory) {
  const { transactions, replaceTransaction, addTransaction, updateTransaction } = txHistory!

  const waitForTransaction = useCallback(
    async (transaction: ContractTransaction, txModelArgs: any) => {
      if (!transaction) return

      try {
        return await transaction.wait()
      } catch (error: any) {
        if (error.code === errors.TRANSACTION_REPLACED) {
          const { replacement, receipt } = error
          console.log(`replacement tx, receipt:`, replacement, receipt)

          // User ran MetaMask "Speed up" feature
          if (!error.cancelled) {
            const tsDetails = getTransferSentDetailsFromLogs(receipt.logs)
            console.log(`replacement tsDetails:`, tsDetails)

            const replacementTxModel = new Transaction({
              ...txModelArgs,
              hash: replacement.hash,
              pendingDestinationConfirmation: true,
              replaced: true,
              transferId: tsDetails?.transferId,
            })

            // Replace local storage
            replaceTransaction(transaction.hash, replacementTxModel)

            return {
              originalTx: transaction,
              replacementTxModel,
              replacementTx: replacement,
              replacementReceipt: receipt,
            }
          }
        }
      }
    },
    [transactions, replaceTransaction]
  )

  return { waitForTransaction, transactions, addTransaction, updateTransaction }
}

export { useTransactionReplacement }
