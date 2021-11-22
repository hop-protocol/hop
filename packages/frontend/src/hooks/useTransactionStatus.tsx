import { useState, useMemo, useEffect, useCallback } from 'react'
import { TChain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useInterval } from 'react-use'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'
import logger from 'src/logger'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import { getNetworkWaitConfirmations } from 'src/utils/networks'
import { getRecentTransactionsByFromAddress } from 'src/utils/blocks'
import { find } from 'lodash'

const useTransactionStatus = (transaction?: Transaction, chain?: TChain) => {
  const { transactions, updateTransaction, addTransaction } = useTxHistory()
  const [completed, setCompleted] = useState<boolean>(transaction?.pending === false)
  const [networkConfirmations, setNetworkConfirmations] = useState<number>()
  const [confirmations, setConfirmations] = useState<number>()
  const [destCompleted, setDestCompleted] = useState<boolean>(
    transaction?.pendingDestinationConfirmation === false
  )
  const [replaced, setReplaced] = useState<Transaction>()

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

    if (waitConfirmations && txResponse?.confirmations >= waitConfirmations) {
      setCompleted(true)
      updateTransaction(transaction, { pending: false })
    }
  }, [transactions, transaction, provider])

  const updateDestTxStatus = useCallback(async () => {
    if (
      transaction &&
      transaction.destNetworkName &&
      transaction.networkName !== transaction.destNetworkName &&
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
    replaced,
  }
}

export default useTransactionStatus
