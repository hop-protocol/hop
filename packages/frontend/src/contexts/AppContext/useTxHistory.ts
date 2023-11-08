import { useEffect, useCallback, Dispatch, SetStateAction, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocalStorage } from 'react-use'
import Transaction from 'src/models/Transaction'
import find from 'lodash/find'
import { filterByHash, sortByRecentTimestamp } from 'src/utils'
import isFunction from 'lodash/isFunction'
import cloneDeepWith from 'lodash/cloneDeepWith'
import { Hop } from '@hop-protocol/sdk'

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

const MAX_TRANSACTION_COUNT = 4

const cacheKey = 'recentTransactions:v000'

const localStorageSerializationOptions = {
  raw: false,
  serializer: (value: Transaction[] | undefined) => {
    if (!value) return '' // Handle undefined if needed
    return JSON.stringify(value.map(tx => tx.toObject()))
  },
  deserializer: (value: string) => {
    if (!value) return undefined // Handle empty string if needed
    return JSON.parse(value).map((obj: any) => Transaction.fromObject(obj)) as Transaction[]
  },
}

const useTxHistory = (sdk: Hop): TxHistory => {
  const [transactions, setTransactions] = useState<Transaction[] | undefined>([])

  useEffect(() => {
    // on mount, load from local storage
    const storedTxs = localStorage.getItem(cacheKey)
    if (storedTxs) {
      setTransactions(localStorageSerializationOptions.deserializer(storedTxs))
    }
  }, [])

  useEffect(() => {
    // on transactions change, save to local storage
    if (transactions) {
      localStorage.setItem(cacheKey, localStorageSerializationOptions.serializer(transactions))
    }
  }, [transactions])

  function clear() {
    try {
      localStorage.removeItem(cacheKey)
    } catch (err) {
      console.error(err)
    }
  }

  function filterSortAndSetTransactions(tx: Transaction, txs?: Transaction[], hashFilter?: string) {
    setTransactions(prevTransactions => {
      const currentTxs = txs ?? prevTransactions ?? []
      const filtered = filterByHash(currentTxs, hashFilter)
      return sortByRecentTimestamp([...filtered, tx]).slice(0, MAX_TRANSACTION_COUNT)
    })
  }

  function addTransaction(tx: Transaction) {
    if (tx.destNetworkName && tx.destNetworkName !== tx.networkName) {
      const match = find(transactions, ['hash', tx.replaced])
      filterSortAndSetTransactions(tx, transactions, match?.hash)
    }
  }

  function removeTransaction(tx: Transaction) {
    setTransactions(prevTransactions => {
      if (!prevTransactions) return []
      const filtered = filterByHash(prevTransactions, tx.hash)
      return sortByRecentTimestamp(filtered).slice(0, MAX_TRANSACTION_COUNT)
    })
  }

  function updateTransaction(tx: Transaction, updateOpts: UpdateTransactionOptions, matchingHash?: string) {
    setTransactions(prevTransactions => {
      if (!prevTransactions) return []
      
      // deep clone to avoid mutating state directly
      const customizer = (value) => {
        if (isFunction(value)) {
          return value
        }
      }

      const clonedTxs = cloneDeepWith(prevTransactions, customizer)
      const targetTx = find(clonedTxs, ['hash', matchingHash || tx.hash])

      if (targetTx) {
        for (const key in updateOpts) {
          targetTx[key] = updateOpts[key]
        }
      }
      
      return sortByRecentTimestamp(clonedTxs).slice(0, MAX_TRANSACTION_COUNT)
    })
  }

  // stores hashes for either pending origin or destination confirmation to prevent redundant listeners
  const listenerSet = useRef(new Set())

  const listenForOriginConfirmation = async (tx) => {
    try {
      tx.provider.once(tx.hash, transaction => {
        listenerSet.current.delete(tx.hash)
        updateTransaction(tx, { pending: false })
      })
    } catch (err) {
      console.error('Error with origin transaction listener:', err)
      listenerSet.current.delete(tx.hash)
    }
  }

  // stores setInterval IDs -- may be cleared to stop polling
  const intervalRefs = useRef({})
  // stores setTimeouts to limit polling to one hour
  const timeoutRefs = useRef({})

  const POLLING_INTERVAL_MS = 15000
  const POLLING_TIMEOUT_MS = 3600000

  const getBondedTxHash = (tx) => {
    return new Promise((resolve, reject) => {
      if (!timeoutRefs.current[tx.hash]) {
        timeoutRefs.current[tx.hash] = setTimeout(() => {
          clearInterval(intervalRefs.current[tx.hash])
          updateTransaction(tx, { pendingDestinationConfirmation: false })
          reject(new Error('Polling timed out'))
        }, POLLING_TIMEOUT_MS)
      }

      const fetchAPI = async () => {
        try {
          const response = await sdk.getTransferStatus(tx.hash)

          if (!response) {
            return
          }

          const bondTransactionHash = response[0]?.bondTransactionHash
          if (bondTransactionHash) {
            clearInterval(intervalRefs.current[tx.hash])
            clearTimeout(timeoutRefs.current[tx.hash])
            resolve(bondTransactionHash)
          }
        } catch (err) {
          console.error(err)
        }
      }

      const interval = setInterval(fetchAPI, POLLING_INTERVAL_MS)
      intervalRefs.current[tx.hash] = interval
    })
  }

  const listenForDestinationConfirmation = async (tx) => {

    const bondTransactionHash = await getBondedTxHash(tx)

    if (!bondTransactionHash) {
      listenerSet.current.delete(tx.hash)
      return
    }

    try {
      tx.destProvider.once(bondTransactionHash, transaction => {
        updateTransaction(tx, { pendingDestinationConfirmation: false })
      })
    } catch (err) {
      console.error('Error with destination transaction listener:', err)
      listenerSet.current.delete(tx.hash)
    }
  }

  useEffect(() => {
    if (!transactions) {
      return
    }

    transactions.forEach(tx => {
      if (!listenerSet.current.has(tx.hash)) {
        listenerSet.current.add(tx.hash)
      } else {
        return
      }

      if (tx.pending) {
        listenForOriginConfirmation(tx)
      } else if (tx.pendingDestinationConfirmation) {
        listenForDestinationConfirmation(tx)
      }
    })

    return () => {
      Object.keys(timeoutRefs.current).forEach(hash => {
        if (!listenerSet.current.has(hash)) {
          clearTimeout(timeoutRefs.current[hash] as ReturnType<typeof setTimeout>)
          delete timeoutRefs.current[hash]
        }
      })

      Object.keys(intervalRefs.current).forEach(hash => {
        if (!listenerSet.current.has(hash)) {
          clearInterval(intervalRefs.current[hash] as ReturnType<typeof setInterval>)
          delete intervalRefs.current[hash]
        }
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
