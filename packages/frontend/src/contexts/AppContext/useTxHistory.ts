import { useState, useEffect, useCallback } from 'react'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'
import { sortByRecentTimestamp } from 'src/utils/sort'
import logger from 'src/logger'
import find from 'lodash/find'

export interface TxHistory {
  transactions: Transaction[]
  setTransactions: (txs: Transaction[]) => void
  addTransaction: (tx: Transaction) => void
  clear: () => void
  updateTransaction: (tx: Transaction) => void
  replaceTransaction: (hash: string, tx: Transaction) => void
}

const useTxHistory = (defaultTxs?: Transaction[]): TxHistory => {
  // logger.debug('useTxHistory render')
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const txs = loadState('recentTransactions')
      if (!txs && defaultTxs) return defaultTxs
      if (!txs) return []
      return txs.map((obj: Transaction) => Transaction.fromObject(obj))
    } catch (err) {
      return []
    }
  })

  function updateTransaction(tx: Transaction) {
    const match = find(transactions, ['hash', tx.hash])
    if (!match) {
      logger.error(`no matching transaction ${tx.hash}`)
      return
    }
    const filtered = transactions.filter((t: Transaction) => t.hash !== tx.hash)
    setTransactions(sortByRecentTimestamp([...filtered, tx]).slice(0, 3))
  }

  function replaceTransaction(hash: string, tx: Transaction) {
    const filtered = transactions.filter((t: Transaction) => t.hash !== hash)
    setTransactions(sortByRecentTimestamp([...filtered, tx]).slice(0, 3))
  }

  const handleChange = useCallback(
    (pending: boolean, tx: Transaction) => {
      const filtered = transactions.filter((t: Transaction) => t.hash !== tx.hash)
      setTransactions(sortByRecentTimestamp([...filtered, tx]).slice(0, 3))
    },
    [transactions]
  )

  // Transforms and saves transactions (component state) -> local storage objects
  useEffect(() => {
    try {
      const recents = transactions.map((tx: Transaction) => {
        return tx.toObject()
      })

      saveState('recentTransactions', recents)
    } catch (err) {
      console.error(err)
    }

    for (const tx of transactions) {
      tx.off('pending', handleChange)
      tx.on('pending', handleChange)
    }
  }, [transactions, handleChange])

  const addTransaction = (tx: Transaction) => {
    setTransactions(sortByRecentTimestamp([...transactions, tx]).slice(0, 3))
  }

  const clear = () => {
    saveState('recentTransactions', [])
    setTransactions([])
  }

  return {
    transactions,
    setTransactions,
    addTransaction,
    clear,
    updateTransaction,
    replaceTransaction,
  }
}

export default useTxHistory
