import { useEffect, useCallback, Dispatch, SetStateAction, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocalStorage } from 'react-use'
import Transaction from 'src/models/Transaction'
import find from 'lodash/find'
import { filterByHash, sortByRecentTimestamp } from 'src/utils'
import _ from 'lodash'

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
  const [transactions, setTransactions] = useState<Transaction[] | undefined>(defaultTxs)

  // const [transactions, setTransactions] = useLocalStorage<Transaction[] | undefined>(
  //   cacheKey,
  //   defaultTxs,
  //   localStorageSerializationOptions
  // )

  useEffect(() => {
    // On mount, load from local storage
    const storedTxs = localStorage.getItem(cacheKey)
    if (storedTxs) {
      setTransactions(localStorageSerializationOptions.deserializer(storedTxs))
    }
  }, [])

  useEffect(() => {
    // On transactions change, save to local storage
    if (transactions) {
      localStorage.setItem(cacheKey, localStorageSerializationOptions.serializer(transactions))
    }
  }, [transactions])

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

  function removeTransaction(tx: Transaction) {
    setTransactions(prevTransactions => {
      if (!prevTransactions) return []
      const filtered = filterByHash(prevTransactions, tx.hash)
      return sortByRecentTimestamp(filtered).slice(0, 4)
    })
  }

  // function updateTransaction(tx: Transaction, updateOpts: UpdateTransactionOptions, matchingHash?: string) {
  //   const updatedTx = { ...tx, ...updateOpts }
  //   filterSortAndSetTransactions(tx, transactions, matchingHash || tx.hash)
  // }

  function updateTransaction(tx: Transaction, updateOpts: UpdateTransactionOptions, matchingHash?: string) {
    setTransactions(prevTransactions => {
      console.log("trying to update")
      if (!prevTransactions) return []
      
      // Deep clone to avoid mutating state directly.
      // const clonedTxs = JSON.parse(JSON.stringify(prevTransactions))
      const customizer = (value) => {
        if (_.isFunction(value)) {
          return value
        }
      }

      const clonedTxs = _.cloneDeepWith(prevTransactions, customizer)

      console.dir({ clonedTxs })
      
      const targetTx = find(clonedTxs, ['hash', matchingHash || tx.hash])

      if (targetTx) {
        for (const key in updateOpts) {
          targetTx[key] = updateOpts[key]
        }
      }

      console.dir({ targetTx })
      
      return sortByRecentTimestamp(clonedTxs).slice(0, 4)
    })
  }

  // stores hashes for either pending origin or destination confirmation to prevent redundant listeners
  const listenerSet = useRef(new Set())

  const listenForOriginConfirmation = async (tx) => {
    console.log("pending originConfirmation", tx.hash)
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
  const timeoutRefs = useRef({})

  const POLLING_INTERVAL = 15000
  const POLLING_TIMEOUT = 3600000

  const getBondedTxHash = (tx) => {
    return new Promise((resolve, reject) => {
      const network = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_NETWORK) ? process.env.REACT_APP_NETWORK : 'goerli'
      const explorerAPIUrl = `https://${network === 'goerli' && 'goerli-'}explorer-api.hop.exchange/v1/transfers?transferId=${tx.hash}`

      console.log("explorerAPIUrl", explorerAPIUrl)

      if (!timeoutRefs.current[tx.hash]) {
        timeoutRefs.current[tx.hash] = setTimeout(() => {
          clearInterval(intervalRefs.current[tx.hash])
          updateTransaction(tx, { pendingDestinationConfirmation: false })
          reject(new Error('Polling timed out'))
        }, POLLING_TIMEOUT)
      }

      const fetchAPI = async () => {
        try {
          console.log("fetching from", explorerAPIUrl, "for", tx.hash)
          console.dir({ intervalRefs, timeoutRefs })

          const response = await fetch(explorerAPIUrl)
          if (!response.ok) throw new Error('API request failed')

          const responseJSON = await response.json()

          console.dir(tx.hash, responseJSON)
          if (!responseJSON.data || !responseJSON.data[0]) {
            console.log("bond hash not yet available for", tx.hash)
            return
          }

          const bondTransactionHash = responseJSON.data[0].bondTransactionHash
          if (bondTransactionHash) {
            console.log("found bondTransactionHash", bondTransactionHash, "resolving...")
            clearInterval(intervalRefs.current[tx.hash])
            clearTimeout(timeoutRefs.current[tx.hash])
            resolve(bondTransactionHash)
          }
        } catch (e) {
          console.error(e)
        }
      }

      const interval = setInterval(fetchAPI, POLLING_INTERVAL)
      console.log(intervalRefs.current)
      intervalRefs.current[tx.hash] = interval
      console.log(intervalRefs.current)
    })
  }

  const listenForDestinationConfirmation = async (tx) => {
    console.log("pending destinationConfirmation", tx.hash)

    const bondTransactionHash = await getBondedTxHash(tx)

    console.log("got hash", bondTransactionHash, "for", tx.hash)

    if (!bondTransactionHash) {
      listenerSet.current.delete(tx.hash)
      console.log("deleting listener for", tx.hash)
      return
    }

    console.log({ transactions })

    try {
      tx.destProvider.once(bondTransactionHash, transaction => {
        // console.dir("updating tx", tx)
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

      // updateTransaction(tx, { pendingDestinationConfirmation: true })
      // console.log({ transactions })
      console.log("hook called")

      if (tx.pending) {
        listenForOriginConfirmation(tx)
      } else if (tx.pendingDestinationConfirmation) {
        console.log("getting dest")
        listenForDestinationConfirmation(tx)
      }
    })

    return () => {
      Object.values(timeoutRefs.current).forEach(value => clearTimeout(value as ReturnType<typeof setTimeout>))
      Object.values(intervalRefs.current).forEach(value => clearInterval(value as ReturnType<typeof setInterval>))
    }
  }, [transactions])

  // useEffect(() => {
  //   function clearAllTimeoutsAndIntervals() {
  //     Object.values(timeoutRefs.current).forEach(id => clearTimeout(id))
  //     Object.values(intervalRefs.current).forEach(id => clearInterval(id))

  //     // Reset references
  //     timeoutRefs.current = {}
  //     intervalRefs.current = {}
  //   }

  //   clearAllTimeoutsAndIntervals()
  // }, [])

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
