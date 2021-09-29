import React, { useState, useMemo, useEffect } from 'react'
import { providers } from 'ethers'
import { TChain, Chain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import useInterval from 'src/hooks/useInterval'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { loadState, saveState } from 'src/utils/localStorage'
import logger from 'src/logger'

const useTransactionStatus = (txHash?: string, chain?: TChain) => {
  const [completed, setCompleted] = useState<boolean>()

  const { sdk } = useApp()
  const provider = useMemo(() => {
    if (!chain) return
    const _chain = sdk.toChainModel(chain)
    return _chain.provider
  }, [chain])

  const updateTxStatus = async () => {
    if (!provider || !txHash) {
      setCompleted(undefined)
      return
    }

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
  }, [txHash, chain])

  useInterval(updateTxStatus, 15e3)

  return {
    completed,
  }
}

export default useTransactionStatus
