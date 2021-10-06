import { useState, useEffect, useCallback } from 'react'
import logger from 'src/logger'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'
import { useApp } from '.'

export interface TxHistory {
  transactions: Transaction[]
  setTransactions: (txs: Transaction[]) => void
  addTransaction: (tx: Transaction) => void
  clear: () => void
}

const useTxHistory = (): TxHistory => {
  // logger.debug('useTxHistory render')
  const { sdk } = useApp()

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
    async function checkTransferIds() {
      if (sdk && 'bridge' in sdk && transactions.length) {
        for (const stx of transactions) {
          try {
            await stx.checkIsTransferIdSpent(sdk)
          } catch (error) {
            logger.error(error, stx)
          }
        }
      }
    }

    checkTransferIds()

    // Poll for balance changes every X seconds
    const pollInterval = 5000
    const timeoutId = setInterval(checkTransferIds, pollInterval)
    return () => clearInterval(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
