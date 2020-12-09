import { useState, useCallback } from 'react'
import Transaction from 'src/models/Transaction'

const useTransactions = () => {
  const [transactions, _setTransactions] = useState<Transaction[]>([])

  const handleChange = useCallback(
    (pending: boolean, tx: Transaction) => {
      const filtered = transactions.filter(
        (t: Transaction) => t.hash !== tx.hash
      )
      _setTransactions([...filtered, tx])
    },
    [transactions]
  )

  const setTransactions = (txs: Transaction[]) => {
    for (const tx of txs) {
      tx.off('pending', handleChange)
      tx.on('pending', handleChange)
    }
    _setTransactions(txs)
  }

  return {
    transactions,
    setTransactions
  }
}

export default useTransactions
