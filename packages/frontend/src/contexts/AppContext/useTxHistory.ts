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

  const listenerSet = useRef(new Set())
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    
    if (!transactions) {
      return
    }

    let lastCalled = 0
    const debounce = async (func, delay = 15000) => {
      const now = new Date().getTime()
      if (now - lastCalled < delay) {
        return
      }
      lastCalled = now
      return await func()
    }

    const listenForDestinationConfirmation = async (tx) => {
      if (tx.destTxHash === "" && !listenerSet.current.has(tx.hash)) {
        listenerSet.current.add(tx.hash)
        const stopPolling = setTimeout(() => {
          clearInterval(interval)
        }, 3600000) // stop after an hour

        const interval = setInterval(async () => {
          const explorerAPIUrl = `https://${process.env.REACT_APP_NETWORK === 'goerli' && "goerli-"}explorer-api.hop.exchange/v1/transfers?transferId=${tx.hash}`
          const response = await debounce(() => fetch(explorerAPIUrl))

          if (response) {
            const data = await response.json()
            const bondTransactionHash = data[0]?.bondTransactionHash

            if (bondTransactionHash) {
              clearTimeout(stopPolling)
              clearInterval(interval)

              try {
                tx.destProvider.once(tx.hash, transaction => {
                  updateTransaction(tx, { destTxHash: bondTransactionHash })
                  updateTransaction(tx, { pendingDestinationConfirmation: false })
                })
              } catch (e) {
                console.error('Error transaction listener:', e)
              }
            }
          }
        }, 15000) // poll every 15 seconds
      }
    }

    // main function scanning through each transaction in localStorage
    transactions.forEach(tx => {
      if (tx.pending && !listenerSet.current.has(tx.hash)) {
        listenerSet.current.add(tx.hash)
        const listenForOriginConfirmation = async () => {
          try {
            tx.provider.once(tx.hash, transaction => {
              updateTransaction(tx, { pending: false })
              listenForDestinationConfirmation(tx)
            })
          } catch (e) {
            console.error('Error transaction listener:', e)
          }
        }
        
        listenForOriginConfirmation()
      } else if (tx.pendingDestinationConfirmation) {
        listenForDestinationConfirmation(tx)
      }
    })
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
