import { useState, useEffect, useCallback } from 'react'
import Transaction from 'src/models/Transaction'

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const cached = sessionStorage.getItem('recentTransactions')
      if (!cached) return []
      const txs = JSON.parse(cached)
      return txs.map((config: any) => new Transaction(config))
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
      const recents = transactions.map(
        ({ hash, networkName, pending }: Transaction) => {
          return { hash, networkName, pending }
        }
      )
      sessionStorage.setItem('recentTransactions', JSON.stringify(recents))
    } catch (err) {
      // noop
    }

    for (const tx of transactions) {
      tx.off('pending', handleChange)
      tx.on('pending', handleChange)
    }
  }, [transactions, handleChange])

  return {
    transactions,
    setTransactions
  }
}

export default useTransactions
