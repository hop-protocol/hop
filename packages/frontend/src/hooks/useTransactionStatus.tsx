import Transaction from '#models/Transaction.js'
import find from 'lodash/find'
import logger from '#logger/index.js'
import { TChain } from '@hop-protocol/sdk'
import { getIsTxFinalized } from '#utils/getIsTxFinalized.js'
import { getNetworkWaitConfirmations } from '#utils/networks.js'
import { getRecentTransactionsByFromAddress } from '#utils/blocks.js'
import { loadState, saveState } from '#utils/localStorage.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInterval } from 'usehooks-ts'
import { enableLifi, enableSocket } from '#config/index.js'

const useTransactionStatus = (transaction?: Transaction, chain?: TChain) => {
  const { sdk, txHistory } = useApp()
  const { transactions, updateTransaction } = txHistory
  const [completed, setCompleted] = useState<boolean>(transaction?.pending === false)
  const [networkConfirmations, setNetworkConfirmations] = useState<number>()
  const [confirmations, setConfirmations] = useState<number>()
  const [destCompleted, setDestCompleted] = useState<boolean>(
    transaction?.pendingDestinationConfirmation === false
  )
  const [replaced, setReplaced] = useState<Transaction>()

  const provider = useMemo(() => {
    if (!chain) return
    const _provider = sdk.getChainProvider(chain)
    return _provider
  }, [chain])

  const checkSocketStatus = useCallback(async () => {
    if (!enableSocket || !transaction?.token?.symbol || !(transaction.token.symbol === 'ETH' || transaction.token.symbol === 'WETH')) {
      return false
    }

    try {
      const status = await sdk.bridge(transaction.token.symbol).getTransactionStatusSocket(transaction.hash)
      console.log('status', status)
      if (status.status === 'COMPLETED') {
        setCompleted(true)
        setDestCompleted(true)
        updateTransaction(transaction, { 
          pending: false,
          pendingDestinationConfirmation: false 
        })
        return true
      }
    } catch (err) {
      logger.error('Error checking Socket transaction status:', err)
    }
    return false
  }, [transaction, sdk])

  const checkLifiStatus = useCallback(async () => {
    if (!enableLifi || !transaction?.token?.symbol || !(transaction.token.symbol === 'ETH' || transaction.token.symbol === 'WETH')) {
      return false
    }

    try {
      const status = await sdk.bridge(transaction.token.symbol).getTransactionStatusLifi(transaction.hash)
      console.log('status', status)
      if (status.status === 'COMPLETED') {
        setCompleted(true)
        setDestCompleted(true)
        updateTransaction(transaction, { 
          pending: false,
          pendingDestinationConfirmation: false 
        })
        return true
      }
    } catch (err) {
      logger.error('Error checking Socket transaction status:', err)
    }
    return false
  }, [transaction, sdk])

  const updateTxStatus = useCallback(async () => {
    if (!provider || !transaction?.hash || !chain) {
      setCompleted(false)
      return
    }

    // Return quickly if already completed
    if (completed) {
      return
    }

    // Check Socket status first
    const isSocketCompleted = await checkSocketStatus()
    if (isSocketCompleted) {
      return
    }

    // Check Lifi status next
    const isLifiCompleted = await checkLifiStatus()
    if (isLifiCompleted) {
      return
    }

    const txHash = transaction.hash
    const cacheKey = `txReceipt:${txHash}`

    // Load local storage
    let tx: any = loadState(cacheKey)

    if (!tx) {
      tx = await provider.getTransactionReceipt(txHash)

      if (tx) {
        saveState(cacheKey, tx)
      } else {
        logger.warn(`Could not get tx receipt: ${txHash}`)
      }
    }

    const waitConfirmations = getNetworkWaitConfirmations(chain as string)
    setNetworkConfirmations(waitConfirmations)

    const txResponse = await transaction.getTransaction()
    if (!txResponse && transaction.from) {
      const txCount = await provider.getTransactionCount(transaction.from)
      if (transaction.nonce && txCount > transaction.nonce) {
        const matchingTxs = await getRecentTransactionsByFromAddress(provider, transaction.from)
        if (matchingTxs.length) {
          const match = find(matchingTxs, ['nonce', transaction.nonce])
          if (match) {
            return updateTransaction(transaction, {
              hash: match.hash,
              pendingDestinationConfirmation: true,
              replaced: transaction.hash,
            })
          }
        }
        return setReplaced(transaction)
      }
    }

    setConfirmations(txResponse?.confirmations)

    const isFinalized = await getIsTxFinalized(txResponse?.blockNumber, chain as string)
    if (isFinalized) {
      setCompleted(true)
      updateTransaction(transaction, { pending: false })
    }
  }, [transactions, transaction, provider, checkSocketStatus])

  const updateDestTxStatus = useCallback(async () => {
    if (
      transaction &&
      transaction.destNetworkName &&
      transaction.networkName !== transaction.destNetworkName &&
      (destCompleted === false ||
        !transaction.destTxHash ||
        transaction.pendingDestinationConfirmation)
    ) {
      // Check Socket status first
      const isSocketCompleted = await checkSocketStatus()
      if (isSocketCompleted) {
        return
      }

      const isSpent = await transaction?.checkIsTransferIdSpent(sdk)
      if (isSpent) {
        setDestCompleted(true)
        updateTransaction(transaction, { pendingDestinationConfirmation: false })
      }
    }
  }, [transactions, transaction, checkSocketStatus])

  useEffect(() => {
    if (!completed) {
      updateTxStatus()
    }
  }, [transactions, transaction?.hash, chain])

  useEffect(() => {
    if (completed && !destCompleted) {
      updateDestTxStatus()
    }
  }, [transactions, transaction])

  useInterval(updateTxStatus, completed ? null : 10 * 1000)
  useInterval(updateDestTxStatus, !completed || destCompleted ? null : 10 * 1000)

  return {
    completed,
    destCompleted,
    confirmations,
    networkConfirmations,
    replaced,
  }
}

export default useTransactionStatus
