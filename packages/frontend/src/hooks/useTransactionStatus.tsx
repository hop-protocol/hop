import { useState, useMemo, useEffect, useCallback } from 'react'
import { TChain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useInterval } from 'react-use'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'
import logger from 'src/logger'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import { getNetworkWaitConfirmations } from 'src/utils/networks'

const useTransactionStatus = (transaction?: Transaction, chain?: TChain) => {
  const { transactions, updateTransaction } = useTxHistory()
  const [completed, setCompleted] = useState<boolean>(transaction?.pending === false)
  const [networkConfirmations, setNetworkConfirmations] = useState<number>()
  const [confirmations, setConfirmations] = useState<number>()
  const [destCompleted, setDestCompleted] = useState<boolean>(
    transaction?.pendingDestinationConfirmation === false
  )

  const { sdk } = useApp()
  const provider = useMemo(() => {
    if (!chain) return
    const _chain = sdk.toChainModel(chain)
    return _chain.provider
  }, [chain])

  const updateTxStatus = useCallback(async () => {
    if (!provider || !transaction?.hash || !chain) {
      setCompleted(false)
      return
    }

    // Return quickly if already completed
    if (completed) {
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
        logger.warn(`Failed to save state: ${cacheKey}`, txHash)
      }
    }

    const waitConfirmations = getNetworkWaitConfirmations(chain as string)
    setNetworkConfirmations(waitConfirmations)

    const txResponse = await transaction.getTransaction()
    setConfirmations(txResponse?.confirmations)

    if (waitConfirmations && txResponse?.confirmations >= waitConfirmations) {
      setCompleted(true)
    }
  }, [transactions, transaction, provider])

  const updateDestTxStatus = useCallback(async () => {
    if (
      transaction &&
      (destCompleted === false ||
        !transaction.destTxHash ||
        transaction.pendingDestinationConfirmation)
    ) {
      const isSpent = await transaction?.checkIsTransferIdSpent(sdk)
      logger.debug(`tx ${transaction.hash.slice(0, 10)} isSpent:`, isSpent)
      if (isSpent) {
        setDestCompleted(true)
        updateTransaction(transaction, { pendingDestinationConfirmation: false })
      }
    }
  }, [transactions, transaction])

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

  useInterval(updateTxStatus, completed ? null : 10e3)
  useInterval(updateDestTxStatus, !completed || destCompleted ? null : 10e3)

  return {
    completed,
    destCompleted,
    confirmations,
    networkConfirmations,
  }
}

export default useTransactionStatus
