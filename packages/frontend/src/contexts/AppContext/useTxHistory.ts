import { useState, useEffect, useCallback } from 'react'
import Transaction from 'src/models/Transaction'

export interface TxHistory {
  transactions: Transaction[]
  setTransactions: (txs: Transaction[]) => void
  addTransaction: (tx: Transaction) => void
  clear: () => void
}

const useTxHistory = (): TxHistory => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const cached = sessionStorage.getItem('recentTransactions')
      if (!cached) return []
      const txs = JSON.parse(cached)
      return txs.map((obj: any) => Transaction.fromObject(obj))
    } catch (err) {
      return []
    }
  })

  const handleChange = useCallback(
    (pending: boolean, tx: Transaction) => {
      const filtered = transactions.filter(
        (t: Transaction) => t.hash !== tx.hash
      )
      setTransactions([...filtered, tx])
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
    setTransactions([...transactions, tx])
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
