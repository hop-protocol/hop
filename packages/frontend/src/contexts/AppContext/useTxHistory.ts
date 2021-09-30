import { useState, useEffect, useCallback } from 'react'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'

export interface TxHistory {
  transactions: Transaction[]
  setTransactions: (txs: Transaction[]) => void
  addTransaction: (tx: Transaction) => void
  clear: () => void
}

const useTxHistory = (): TxHistory => {
  // logger.debug('useTxHistory render')

  const sort = (list: Transaction[]) => {
    return list.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp)
  }

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const txs = loadState('recentTransactions')
      if (!txs) return []
      return txs.map((obj: Transaction) => Transaction.fromObject(obj))
    } catch (err) {
      return []
    }
  })

  const handleChange = useCallback(
    (pending: boolean, tx: Transaction) => {
      const filtered = transactions.filter((t: Transaction) => t.hash !== tx.hash)
      setTransactions(sort([...filtered, tx]).slice(0, 3))
    },
    [transactions]
  )

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
    setTransactions(sort([...transactions, tx]).slice(0, 3))
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
  }
}

export default useTxHistory
