import { useState, useEffect, useCallback } from 'react'
import Transaction from 'src/models/Transaction'
import logger from 'src/logger'

export interface TxHistory {
  transactions: Transaction[]
  setTransactions: (txs: Transaction[]) => void
  addTransaction: (tx: Transaction) => void
  clear: () => void
}

const useTxHistory = (): TxHistory => {
  //logger.debug('useTxHistory render')

  const sort = (list: Transaction[]) => {
    return list.sort(
      (a: Transaction, b: Transaction) => b.timestamp - a.timestamp
    )
  }

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const cached = sessionStorage.getItem('recentTransactions')
      if (!cached) return []
      const txs = JSON.parse(cached)
      return txs.map((obj: Transaction) => Transaction.fromObject(obj))
    } catch (err) {
      return []
    }
  })

  const handleChange = useCallback(
    (pending: boolean, tx: Transaction) => {
      const filtered = transactions.filter(
        (t: Transaction) => t.hash !== tx.hash
      )
      setTransactions(sort([...filtered, tx]).slice(0, 3))
    },
    [transactions]
  )

  useEffect(() => {
    try {
      const recents = transactions.map((tx: Transaction) => {
        return tx.toObject()
      })
      sessionStorage.setItem('recentTransactions', JSON.stringify(recents))
    } catch (err) {
      // noop
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
    sessionStorage.setItem('recentTransactions', JSON.stringify([]))
    setTransactions([])
  }

  return {
    transactions,
    setTransactions,
    addTransaction,
    clear
  }
}

export default useTxHistory
