import { useCallback, Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'react-use'
import Transaction from 'src/models/Transaction'
import find from 'lodash/find'
import { filterByHash, sortByRecentTimestamp } from 'src/utils'

export interface TxHistory {
  transactions?: Transaction[]
  setTransactions: Dispatch<SetStateAction<Transaction[] | undefined>>
  addTransaction: (tx: Transaction) => void
  removeTransaction: (tx: Transaction) => void
  updateTransaction: (tx: Transaction, updateOpts?: any) => void
  clear: () => void
}

export interface UpdateTransactionOptions {
  pendingDestinationConfirmation?: boolean
  destNetworkName?: string
  destTxHash?: string
  replaced?: boolean | string
}

const cacheKey = 'recentTransactions'

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
    const filtered = filterByHash(txs, hashFilter)
    setTransactions(sortByRecentTimestamp([...filtered, tx]).slice(0, 3))
  }

  const addTransaction = useCallback(
    (tx: Transaction) => {
      // If tx exists with hash == tx.replaced, remove it
      const match = find(transactions, ['hash', tx.replaced])
      filterSortAndSetTransactions(tx, transactions, match?.hash)
    },
    [transactions]
  )

  const removeTransaction = useCallback(
    (tx: Transaction) => {
      // If tx exists with hash == tx.replaced, remove it
      const filtered = filterByHash(transactions, tx.hash)
      setTransactions(sortByRecentTimestamp(filtered).slice(0, 3))
    },
    [transactions]
  )

  const updateTransaction = useCallback(
    (tx: Transaction, updateOpts: UpdateTransactionOptions) => {
      for (const key in updateOpts) {
        tx[key] = updateOpts[key]
      }
      filterSortAndSetTransactions(tx, transactions, tx.hash)
    },
    [transactions]
  )

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
