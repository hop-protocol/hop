import { useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Transaction from 'src/models/Transaction'
import find from 'lodash/find'
import { filterByHash, sortByRecentTimestamp } from 'src/utils'

export interface TxHistory {
  transactions?: Transaction[]
  setTransactions: Dispatch<SetStateAction<Transaction[] | undefined>>
  addTransaction: (tx: Transaction) => void
  removeTransaction: (tx: Transaction) => void
  updateTransaction: (tx: Transaction, updateOpts: any, matchingHash?: string) => void
  // clear: () => void
}

export interface UpdateTransactionOptions {
  pending?: boolean
  pendingDestinationConfirmation?: boolean
  destNetworkName?: string
  destTxHash?: string
  replaced?: boolean | string
}

const cacheKey = 'recentTransactions:v000'

const useTxHistory = (defaultTxs: Transaction[] = []): TxHistory => {
  const { provider } = useWeb3Context()

  const [transactions, setTransactions/*, clear */] = useLocalStorage<Transaction[] | undefined>(
    cacheKey,
    defaultTxs,
  )

  function filterSortAndSetTransactions(tx: Transaction, txs?: Transaction[], hashFilter?: string) {
    setTransactions(prevTransactions => {
      const currentTxs = txs ?? prevTransactions ?? []
      const filtered = filterByHash(currentTxs, hashFilter)
      return sortByRecentTimestamp([...filtered, tx]).slice(0, 4)
    })
  }

  function addTransaction(tx: Transaction) {
    const match = find(transactions, ['hash', tx.replaced])
    filterSortAndSetTransactions(tx, transactions, match?.hash)
  }

  const removeTransaction = useCallback(
    (tx: Transaction) => {
      setTransactions(prevTransactions => {
        if (!prevTransactions) return []
        const filtered = filterByHash(prevTransactions, tx.hash)
        return sortByRecentTimestamp(filtered).slice(0, 4)
      })
    }, []
  )

  const updateTransaction = useCallback(
    (tx: Transaction, updateOpts: UpdateTransactionOptions, matchingHash?: string) => {
      const newTransactions = [...(transactions ?? [])] // Create a new array
      const txIndex = newTransactions.findIndex(t => t.hash === (matchingHash || tx.hash))
      if (txIndex === -1) return // No transaction found to update
      
      // Create a new transaction object instead of mutating
      const newTx = { ...newTransactions[txIndex], ...updateOpts }
      newTransactions[txIndex] = newTx as Transaction
      
      setTransactions(newTransactions)
    }, [transactions]
  )

  // on page load or any time a new transaction is created
  // useEffect(() => {
  //   if (!provider || !transactions) {
  //     return
  //   }

  //   // scan through each transaction in localStorage
  //   transactions.forEach(tx => {
  //     // creating listeners for each
  //     const listenForTx = async () => {
  //       try {
  //         await provider.waitForTransaction(tx.hash)
  //         updateTransaction(tx, { pending: false })
  //       } catch (e) {
  //         console.error("Error transaction listener:", e)
  //       }
  //     }

  //     listenForTx()
  //   })
  // }, [transactions])

  return {
    transactions,
    setTransactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
    // clear,
  }
}

export default useTxHistory
