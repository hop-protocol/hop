import { useEffect, useCallback, Dispatch, SetStateAction, useRef } from 'react'
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

  const isFirstRender = useRef(true)

  // on page load or any time a new transaction is created
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!transactions) {
      return
    }

    // helper function using destTxHash get destination confirmation
    const listenForDestinationConfirmation = async (tx) => {
      if (tx.destTxHash === "") {
        const stopPolling = setTimeout(() => {
          clearInterval(interval)
        }, 3600000)  // stop after an hour

        const interval = setInterval(async () => {
          // repeatedly poll explorer with timeout to get destTxHash (bondTransactionHash)
          const explorerAPIUrl = `https://${process.env.REACT_APP_NETWORK === 'goerli' && "goerli-"}explorer-api.hop.exchange/v1/transfers?transferId=${tx.hash}`
          console.log({ explorerAPIUrl })

          const response = await fetch(explorerAPIUrl)
          console.dir({ response })

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
        }, 15000) // poll every 15 seconds
      }
    }


    // main function scanning through each transaction in localStorage
    transactions.forEach(tx => {
      // only create listeners for transactions that are pending
      if (tx.pending) {
        const listenForOriginConfirmation = async () => {
          try {
            tx.provider.once(tx.hash, (transaction) => {
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
