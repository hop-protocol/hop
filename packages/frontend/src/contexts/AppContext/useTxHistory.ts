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

  const debounce = async (func, lastCalled, delay = 15000) => {
    const now = new Date().getTime()
    if (now - lastCalled.value < delay) {
      return
    }
    lastCalled.value = now
    return await func()
  }

  const listenerSet = useRef(new Set())
  const intervalRefs = useRef({})
  const stopPollingRefs = useRef({})

  useEffect(() => {    
    if (!transactions) {
      return
    }

    const listenForOriginConfirmation = async (tx) => {
      try {
        tx.provider.once(tx.hash, transaction => {
          updateTransaction(tx, { pending: false })
          listenForDestinationConfirmation(tx)
        })
      } catch (e) {
        console.error('Error transaction listener:', e)
      }
    }

    const listenForDestinationConfirmation = async (tx) => {
      if (!listenerSet.current.has(tx.hash)) {
        listenerSet.current.add(tx.hash)
      }

      let retryCounter = 0 // initialize retry counter
      
      // stop polling after an hour
      if (!stopPollingRefs.current[tx.hash]) {
        stopPollingRefs.current[tx.hash] = setTimeout(() => {
          clearInterval(intervalRefs.current[tx.hash])
        }, 3600000)
      }

      // debouncer interval reset
      const lastCalledForTx = { value: 0 }
      const interval = setInterval(async () => {
        const explorerAPIUrl = `https://${process.env.REACT_APP_NETWORK === 'goerli' && "goerli-"}explorer-api.hop.exchange/v1/transfers?transferId=${tx.hash}`
        const response = await debounce((lastCalled) => fetch(explorerAPIUrl), lastCalledForTx) // only call API every 15 seconds

        if (response) {
          const data = await response.json()
          const bondTransactionHash = data[0]?.bondTransactionHash

          if (bondTransactionHash) {
            clearTimeout(stopPollingRefs.current[tx.hash])
            clearInterval(interval)

            try {
              tx.destProvider.once(tx.hash, transaction => {
                updateTransaction(tx, { destTxHash: bondTransactionHash })
                updateTransaction(tx, { pendingDestinationConfirmation: false })
              })
            } catch (e) {
              console.error('Error with transaction listener:', e)
              listenerSet.current.delete(tx.hash)
            }
          }
        } else {
          retryCounter++
          if (retryCounter >= 3) {
            console.error('Max retries reached for:', tx.hash)
            listenerSet.current.delete(tx.hash)
            clearInterval(interval)
            updateTransaction(tx, { pendingDestinationConfirmation: false })
          }
        }
      }, 15000) // poll every 15 seconds

      intervalRefs.current[tx.hash] = interval
    }

    // main function scanning through each transaction in localStorage
    transactions.forEach(tx => {
      if (tx.pending && !listenerSet.current.has(tx.hash)) {
        listenerSet.current.add(tx.hash)
        listenForOriginConfirmation(tx)
      } else if (tx.pendingDestinationConfirmation && !listenerSet.current.has(tx.hash)) {
        listenForDestinationConfirmation(tx)
      }
    })

    return () => {
      listenerSet.current = new Set()
      Object.values(stopPollingRefs.current).forEach(clearTimeout)
      Object.values(intervalRefs.current).forEach(clearInterval)
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
