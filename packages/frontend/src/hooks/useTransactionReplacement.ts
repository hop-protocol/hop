import { ContractTransaction } from '@ethersproject/contracts'
import { errors } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import Transaction from 'src/models/Transaction'
// import logger from 'src/logger'
// import Network from 'src/models/Network'
// import { Token } from '@hop-protocol/sdk'

function useTransactionReplacement(
  txHistory
  // sdk
  // fromNetwork?: Network,
  // toNetwork?: Network,
  // token?: Token
) {
  // const [transaction, setTransaction] = useState<ContractTransaction>()
  // const [txModel, setTxModel] = useState<any>()
  // const [watcher, setWatcher] = useState<any>()

  const waitForTransaction = useCallback(
    async (transaction: ContractTransaction, txModelArgs: any) => {
      if (!transaction) return
      // setTransaction(transaction)

      try {
        return await transaction.wait()
      } catch (error: any) {
        if (error.code === errors.TRANSACTION_REPLACED) {
          const { replacement, receipt } = error
          if (error.cancelled) {
            // console.log(`error.cancelled__error.replacement:`, error.replacement)
          } else {
            console.log(`replaced transaction, receipt:`, replacement, receipt)
            const replacementTxModel = new Transaction({
              hash: error.replacement.hash,
              replaced: true,
              ...txModelArgs,
            })

            // Replace local storage
            txHistory?.replaceTransaction(transaction.hash, replacementTxModel)

            // if (watcher) {
            //   watcher.off(sdk.Event.DestinationTxReceipt)
            // }

            // const { token, networkName, destNetworkName } = txModelArgs
            // if (destNetworkName) {
            //   const replacementWatcher = sdk.watch(
            //     replacementTxModel.hash,
            //     token.symbol,
            //     networkName,
            //     destNetworkName
            //   )
            //   setWatcher(replacementWatcher)
            // }

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
    [txHistory]
  )

  // useEffect(() => {
  //   if (watcher) {
  //     console.log(`watcher changed:`, watcher)
  //     watcher.on(sdk.Event.DestinationTxReceipt, async data => {
  //       logger.debug(`dest tx receipt event data:`, data)
  //       if (txModel && !txModel.destTxHash) {
  //         txModel.destTxHash = data.receipt.transactionHash
  //         txModel.pendingDestinationConfirmation = false
  //         txHistory?.updateTransaction(txModel)
  //       }

  //       watcher.off(sdk.Event.DestinationTxReceipt)
  //     })

  //     return () => watcher.off(sdk.Event.DestinationTxReceipt)
  //   }
  // }, [watcher])

  // useEffect(() => {
  //   if (sdk && transaction && fromNetwork && toNetwork && token) {
  //     console.log(`fromNetwork:`, fromNetwork)
  //     console.log(`toNetwork:`, toNetwork)
  //     const watcher = sdk.watch(transaction.hash, token.symbol, fromNetwork.slug, toNetwork.slug)
  //     setWatcher(watcher)
  //   }
  // }, [sdk, transaction, fromNetwork, toNetwork, token])

  return {
    // transaction,
    // setTransaction,
    // replacement,
    waitForTransaction,
  }
}

export { useTransactionReplacement }
