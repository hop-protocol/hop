import { useEffect, useCallback, Dispatch, SetStateAction, useRef } from 'react'
import { useQuery } from 'react-query'
import { useLocalStorage } from 'react-use'
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


const useTxHistory = (defaultTxs: Transaction[] = []): TxHistory => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[] | undefined>(
    cacheKey,
    defaultTxs,
    localStorageSerializationOptions
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
      for (const key in updateOpts) {
        tx[key] = updateOpts[key]
      }
      filterSortAndSetTransactions(tx, transactions, matchingHash || tx.hash)
    }, [transactions]
  )

  // stores hashes for either pending origin or destination confirmation to prevent redundant listeners
  const listenerSet = useRef(new Set())

  const listenForOriginConfirmation = async (tx) => {
    console.log("pending originConfirmation", tx.hash)
    try {
      tx.provider.once(tx.hash, transaction => {
        updateTransaction(tx, { pending: false })
        console.log("updated pending for:", tx.hash)
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

  const POLLING_INTERVAL = 15000
  const POLLING_TIMEOUT = 3600000

  const getBondedTxHash = (tx) => {
    return new Promise((resolve, reject) => {
      const network = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_NETWORK) ? process.env.REACT_APP_NETWORK : 'goerli'
      const explorerAPIUrl = `https://${network === 'goerli' && 'goerli-'}explorer-api.hop.exchange/v1/transfers?transferId=${tx.hash}`

      console.log("explorerAPIUrl", explorerAPIUrl)

      if (!pollingRefs.current[tx.hash]) {
        pollingRefs.current[tx.hash] = setTimeout(() => {
          clearInterval(intervalRefs.current[tx.hash])
          updateTransaction(tx, { pendingDestinationConfirmation: false })
          reject(new Error('Polling timed out'))
        }, POLLING_TIMEOUT)
      }

      const fetchAPI = async () => {
        try {
          console.log("fetching")
          const response = await fetch(explorerAPIUrl)
          if (!response.ok) throw new Error('API request failed')

          const responseJSON = await response.json()
          if (!responseJSON.data || !responseJSON.data[0]) {
            return
          }

          const bondTransactionHash = responseJSON.data[0].bondTransactionHash
          if (bondTransactionHash) {
            clearTimeout(pollingRefs.current[tx.hash])
            clearInterval(intervalRefs.current[tx.hash])
            resolve(bondTransactionHash)
          }
        } catch (e) {
          console.error(e)
        }
      }

      // const interval = setInterval(fetchAPI, POLLING_INTERVAL)
      const fetchAPIWrapper = async () => {
        await fetchAPI()
        intervalRefs.current[tx.hash] = setTimeout(fetchAPIWrapper, POLLING_INTERVAL)
      }
      fetchAPIWrapper()
    })
  }

  const listenForDestinationConfirmation = async (tx) => {
    console.log("pending destinationConfirmation", tx.hash)

    const bondTransactionHash = await getBondedTxHash(tx)

    console.log("got hash", bondTransactionHash, "for", tx.hash)

    if (!bondTransactionHash) {
      listenerSet.current.delete(tx.hash)
      console.log("deleting listener")
      return
    }

    try {
      tx.destProvider.once(bondTransactionHash, transaction => {
        updateTransaction(tx, { pendingDestinationConfirmation: false })
        console.log("updated destination pending for", tx.hash)
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
      Object.values(pollingRefs.current).forEach(value => clearTimeout(value as ReturnType<typeof setTimeout>))
      Object.values(intervalRefs.current).forEach(value => clearInterval(value as ReturnType<typeof setInterval>))
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
