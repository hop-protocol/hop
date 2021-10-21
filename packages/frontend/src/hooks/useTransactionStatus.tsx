import { useState, useMemo, useEffect } from 'react'
import { TChain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import useInterval from 'src/hooks/useInterval'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'
import logger from 'src/logger'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'

const useTransactionStatus = (transaction?: Transaction, chain?: TChain) => {
  const { updateTransaction } = useTxHistory()
  const [completed, setCompleted] = useState<boolean>()
  const [confirmations, setConfirmations] = useState<number>()
  const [destConfirmations, setDestConfirmations] = useState<number>()
  const [destCompleted, setDestCompleted] = useState<boolean>(
    !transaction?.pendingDestinationConfirmation
  )

  useEffect(() => {
    async function getConfirmations() {
      if (transaction) {
        const tx = await transaction.getTransaction()
        setConfirmations(tx.confirmations)
      }
    }
    getConfirmations()
  }, [transaction])

  useEffect(() => {
    async function getConfirmations() {
      if (transaction) {
        const destTx = await transaction.getDestTransaction()
        if (destTx) {
          setDestConfirmations(destTx.confirmations)
        }
      }
    }
    getConfirmations()
  }, [transaction, destCompleted])

  const { sdk } = useApp()
  const provider = useMemo(() => {
    if (!chain) return
    const _chain = sdk.toChainModel(chain)
    return _chain.provider
  }, [chain])

  async function updateDestTxStatus() {
    if (
      transaction &&
      (destCompleted === false || !transaction.destTxHash) &&
      transaction.pendingDestinationConfirmation
    ) {
      const isSpent = await transaction?.checkIsTransferIdSpent(sdk)
      logger.debug(`${transaction.hash} isSpent:`, isSpent)
      if (isSpent) {
        setDestCompleted(true)
        updateTransaction(transaction)
      }
    }
  }

  const updateTxStatus = async () => {
    if (!provider || !transaction?.hash) {
      setCompleted(undefined)
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

    setCompleted(!!tx)
  }

  useEffect(() => {
    updateTxStatus()
  }, [transaction?.hash, chain])

  useEffect(() => {
    updateDestTxStatus()
  }, [transaction])

  useInterval(updateTxStatus, 15e3)
  useInterval(updateDestTxStatus, 15e3)

  return {
    completed,
    destCompleted,
    confirmations,
    destConfirmations,
  }
}

export default useTransactionStatus
