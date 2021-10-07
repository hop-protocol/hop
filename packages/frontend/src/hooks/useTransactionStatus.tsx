import { useState, useMemo, useEffect } from 'react'
import { TChain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import useInterval from 'src/hooks/useInterval'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'
import logger from 'src/logger'

const useTransactionStatus = (transaction?: Transaction, chain?: TChain) => {
  const [completed, setCompleted] = useState<boolean>()
  const [destCompleted, setDestCompleted] = useState<boolean>(
    !transaction?.pendingDestinationConfirmation || false
  )

  const { sdk } = useApp()
  const provider = useMemo(() => {
    if (!chain) return
    const _chain = sdk.toChainModel(chain)
    return _chain.provider
  }, [chain])

  async function updateDestTxStatus() {
    if (!destCompleted) {
      const isSpent = await transaction?.checkIsTransferIdSpent(sdk)
      logger.debug(`isSpent:`, isSpent)
      if (isSpent) {
        setDestCompleted(true)
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
  }
}

export default useTransactionStatus
