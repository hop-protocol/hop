import { useState } from 'react'
import Transaction from 'src/models/Transaction'

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  return {
    transactions,
    setTransactions
  }
}

export default useTransactions
