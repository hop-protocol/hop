import React, { useState, useMemo, useEffect } from 'react'
import { providers } from 'ethers'
import { TChain, Chain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import useInterval from 'src/hooks/useInterval'
import useAsyncMemo from 'src/hooks/useAsyncMemo'

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

    let tx
    const txString = localStorage.getItem(cacheKey)
    if (txString) {
      tx = JSON.parse(txString)
    } else {
      tx = await provider.getTransactionReceipt(txHash)
      if (tx) {
        localStorage.setItem(cacheKey, JSON.stringify(tx))
      }
    }

    setCompleted(!!tx)
  }

  useEffect(() => {
    updateTxStatus()
  }, [txHash, chain])

  useInterval(updateTxStatus, 15e3)

  return {
    completed
  }
}

export default useTransactionStatus
