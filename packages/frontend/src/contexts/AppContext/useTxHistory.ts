import { useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'react-use'
import Transaction from 'src/models/Transaction'
import find from 'lodash/find'
import { filterByHash, sortByRecentTimestamp } from 'src/utils'

export interface TxHistory {
  transactions?: Transaction[]
  setTransactions: Dispatch<SetStateAction<Transaction[] | undefined>>
  addTransaction: (tx: Transaction) => void
  removeTransaction: (tx: Transaction) => void
  updateTransaction: (tx: Transaction, updateOpts: any, matchingHash?: string) => void
  clear: () => void
}

export interface UpdateTransactionOptions {
  pending?: boolean
  pendingDestinationConfirmation?: boolean
  destNetworkName?: string
  destTxHash?: string
  replaced?: boolean | string
}

const cacheKey = 'recentTransactions:v000'

const maxTransactionCount: number = 4

const localStorageSerializationOptions = {
  raw: false,
  serializer: (value: Transaction[]) => {
    return JSON.stringify(
      value.map(tx => {
        return tx.toObject()
      })
    )
  },
  deserializer: (value: string) => {
    return JSON.parse(value).map((obj: Transaction) => Transaction.fromObject(obj))
  },
}

const useTxHistory = (defaultTxs: Transaction[] = []): TxHistory => {
  const [transactions, setTransactions, clear] = useLocalStorage<Transaction[]>(
    cacheKey,
    defaultTxs,
    localStorageSerializationOptions
  )

  function filterSortAndSetTransactions(tx: Transaction, txs?: Transaction[], hashFilter?: string) {
    setTransactions(prevTransactions => {
      const currentTxs = txs ?? prevTransactions ?? []
      const filtered = filterByHash(currentTxs, hashFilter)
      return sortByRecentTimestamp([...filtered, tx]).slice(0, maxTransactionCount)
    })
  }

  function addTransaction(tx: Transaction) {
    const match = find(transactions, ['hash', tx.replaced])
    filterSortAndSetTransactions(tx, transactions, match?.hash)
  }

  function removeTransaction(tx: Transaction) {
    setTransactions(prevTransactions => {
      if (!prevTransactions) return []
      const filtered = filterByHash(prevTransactions, tx.hash)
      return sortByRecentTimestamp(filtered).slice(0, maxTransactionCount)
    })
  }

  const updateTransaction = useCallback(
    (tx: Transaction, updateOpts: UpdateTransactionOptions, matchingHash?: string) => {
      const newTransactions = [...(transactions ?? [])]
      const txIndex = newTransactions.findIndex(t => t.hash === (matchingHash || tx.hash))
      if (txIndex === -1) return // No transaction found to update
      
      // Create a new transaction object instead of mutating
      const newTx = { ...newTransactions[txIndex], ...updateOpts }
      newTransactions[txIndex] = newTx as Transaction
      
      setTransactions(newTransactions)
    }, [transactions]
  )

  // this will make sure to update in local storage the updated pending status,
  // so it doesn't show as pending indefinitely on reload.
  // This wouldn't be an issue if useEffect worked properly with array nested
  // of nested objects and it detected property changes.
  useEffect(() => {
    transactions?.forEach(tx => {
      const oldPending = tx.pending
      const oldPendingDC = tx.pendingDestinationConfirmation
      const cbPending = (pending: boolean) => {
        if (oldPending !== pending) {
          updateTransaction(tx, { pending })
        }
      }
      const cbPendingDC = (pendingDestinationConfirmation: boolean) => {
        if (oldPendingDC !== pendingDestinationConfirmation) {
          updateTransaction(tx, { pendingDestinationConfirmation })
        }
      }
      tx.once('pending', cbPending)
      tx.once('pendingDestinationConfirmation', cbPendingDC)
    })
    return () => {
      transactions?.forEach(tx => {
        tx.removeAllListeners()
      })
    }
  }, [transactions])

  return {
    transactions,
    setTransactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
    clear,
  }
}

export default useTxHistory
