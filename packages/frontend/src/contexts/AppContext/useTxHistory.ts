import { useEffect, useCallback, Dispatch, SetStateAction, useRef } from 'react'
import { useQuery } from 'react-query'
import { useLocalStorage } from 'usehooks-ts'
import Transaction from 'src/models/Transaction'
import find from 'lodash/find'
import { filterByHash, sortByRecentTimestamp } from 'src/utils'

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

const cacheKey = 'recentTransactions:v000'

const useTxHistory = (defaultTxs: Transaction[] = []): TxHistory => {

  const [transactions, setTransactions] = useLocalStorage<Transaction[] | undefined>(
    cacheKey,
    defaultTxs
  )

  function clear() {
    try {
      localStorage.removeItem(cacheKey)
    } catch (error) {
      console.error(error)
    }
  }

  function filterSortAndSetTransactions(tx: Transaction, txs?: Transaction[], hashFilter?: string) {
    setTransactions(prevTransactions => {
      const currentTxs = txs ?? prevTransactions ?? []
      const filtered = filterByHash(currentTxs, hashFilter)
      return sortByRecentTimestamp([...filtered, tx]).slice(0, 4)
    })
  }

  function addTransaction(tx: Transaction) {
    const match = find(transactions, ['hash', tx.replaced])
    filterSortAndSetTransactions(tx, transactions, match?.hash)
  }

  const removeTransaction = useCallback(
    (tx: Transaction) => {
      setTransactions(prevTransactions => {
        if (!prevTransactions) return []
        const filtered = filterByHash(prevTransactions, tx.hash)
        return sortByRecentTimestamp(filtered).slice(0, 4)
      })
    }, []
  )

  const updateTransaction = useCallback(
    (tx: Transaction, updateOpts: UpdateTransactionOptions, matchingHash?: string) => {
      const newTransactions = [...(transactions ?? [])] // Create a new array
      const txIndex = newTransactions.findIndex(t => t.hash === (matchingHash || tx.hash))
      if (txIndex === -1) return // No transaction found to update
      
      // Create a new transaction object instead of mutating
      const newTx = { ...newTransactions[txIndex], ...updateOpts }
      newTransactions[txIndex] = newTx as Transaction
      
      setTransactions(newTransactions)
    }, [transactions]
  )

  const debounce = (func, delay = 15000) => {
    let inDebounce: ReturnType<typeof setTimeout>
    return function(this: any, ...args: any[]) {
      const context = this
      clearTimeout(inDebounce)
      inDebounce = setTimeout(() => func.apply(context, args), delay)
    }
  }

  // stores hashes for either pending origin or destination confirmation to prevent redundant listeners
  const listenerSet = useRef(new Set())

  const listenForOriginConfirmation = async (tx) => {
    console.dir(tx.hash, tx.provider)
    try {
      tx.provider.once(tx.hash, transaction => {
        updateTransaction(tx, { pending: false })
        listenForDestinationConfirmation(tx)
      })
    } catch (e) {
      console.error('Error with origin transaction listener:', e)
      listenerSet.current.delete(tx.hash)
    }
  }

  // stores setInterval IDs -- may be cleared to stop polling
  const intervalRefs = useRef({})
  // stores setTimeouts to limit polling to one hour
  const pollingRefs = useRef({})
  // use a different debounced fetch for each transaction
  const fetchRef = useRef({})

  const getBondedTxHash = (tx) => {
    return new Promise((resolve, reject) => {
      const explorerAPIUrl = `https://${process.env.REACT_APP_NETWORK === 'goerli' && "goerli-"}explorer-api.hop.exchange/v1/transfers?transferId=${tx.hash}`

      if (!fetchRef.current[tx.hash]) {
        fetchRef.current[tx.hash] = debounce(() => fetch(explorerAPIUrl), 15000)
      }

      if (!pollingRefs.current[tx.hash]) {
        pollingRefs.current[tx.hash] = setTimeout(() => {
          clearInterval(intervalRefs.current[tx.hash])
          updateTransaction(tx, { pendingDestinationConfirmation: false })
          delete fetchRef.current[tx.hash]
          reject(new Error('Polling timed out'))
        }, 3600000)
      }

      const interval = setInterval(async () => {
        const response = await fetchRef.current[tx.hash](explorerAPIUrl)
        if (response) {
          const data = await response.json()
          const bondTransactionHash = data[0]?.bondTransactionHash
          if (bondTransactionHash) {
            clearTimeout(pollingRefs.current[tx.hash])
            clearInterval(intervalRefs.current[tx.hash])
            delete fetchRef.current[tx.hash]
            resolve(bondTransactionHash)
          }
        }
      }, 15000)

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
      tx.destProvider.once(tx.hash, transaction => {
        updateTransaction(tx, { pendingDestinationConfirmation: false })
        // updateTransaction(tx, { destTxHash: bondTransactionHash })
      })
    } catch (e) {
      console.error('Error with destination transaction listener:', e)
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
        console.log("not found in listener set:", tx.hash)
      } else {
        console.log("found in listener set:", tx.hash)
        return
      }

      if (tx.pending) {
        console.log("pending originConfirmation", tx.hash)
        listenForOriginConfirmation(tx)
      } else if (tx.pendingDestinationConfirmation) {
        console.log("pending destinationConfirmation", tx.hash)
        listenForDestinationConfirmation(tx)
      }
    })

    return () => {
      listenerSet.current = new Set()
      Object.values(pollingRefs.current).forEach(value => clearTimeout(value as ReturnType<typeof setTimeout>))
      Object.values(intervalRefs.current).forEach(value => clearInterval(value as ReturnType<typeof setInterval>))
      fetchRef.current = {}
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
