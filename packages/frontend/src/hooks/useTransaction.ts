import { useState, useMemo, useEffect, useCallback } from 'react'
import { TChain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useInterval } from 'react-use'
import Transaction from 'src/models/Transaction'
import { loadState, saveState } from 'src/utils/localStorage'
import logger from 'src/logger'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import { getNetworkWaitConfirmations } from 'src/utils/networks'
import {
  fetchTransferFromL1Completeds,
  fetchWithdrawalBondedsByTransferId,
  findTransferFromL1CompletedLog,
  formatError,
  getTransferSentDetailsFromLogs,
  L1Transfer,
  fetchTransferSents,
  L2Transfer,
  getLastLog,
  formatLogArgs,
} from 'src/utils'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { find } from 'lodash'
import { formatEther } from '@ethersproject/units'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const methodToSigHashes = {
  // L1_Bridge
  sendToL2: '0xdeace8f5', // L1 -> L2
  // L2_Bridge
  swapAndSend: '0xeea0d7b2', // L2 -> L2 / L2 -> L1
  // L1_Bridge / L2_Bridge
  withdraw: '0x0f7aadb7', // L2 -> L2 / L2 -> L1 (bonder offline)
}

export const sigHashes = {
  // L1_Bridge
  '0xdeace8f5': 'sendToL2', // L1 -> L2
  // L2_Bridge
  '0xeea0d7b2': 'swapAndSend', // L2 -> L2 / L2 -> L1
  // L1_Bridge / L2_Bridge
  '0x0f7aadb7': 'withdraw', // L2 -> L2 / L2 -> L1 (bonder offline)
}

enum TxType {
  approve = 'approve',
  sendL1ToL2 = 'sendL1ToL2',
  sendL2ToL2 = 'sendL2ToL2',
  sendL2ToL1 = 'sendL2ToL1',
  convert = 'convert',
  wrap = 'wrap',
  unwrap = 'unwrap',
  addLiquidity = 'addLiquidity',
  removeLiquidity = 'removeLiquidity',
  stake = 'stake',
  unstake = 'unstake',
}

interface TxObj {
  type: TxType
  model: Transaction
  response: TransactionResponse
  receipt: TransactionReceipt
  gasCost: string
  timestamp?: string
  methodName?: string
  params?: any[]
  eventValues?: any
}

const useTransaction = (txHash?: string, slug?: string) => {
  const { sdk, contracts } = useApp()
  const { updateTransaction } = useTxHistory()

  const [tx, setTx] = useState<Transaction | null>(null)
  const [completed, setCompleted] = useState<boolean>(tx?.pending === false)
  const [networkConfirmations, setNetworkConfirmations] = useState<number>()
  const [confirmations, setConfirmations] = useState<number>()
  const [destCompleted, setDestCompleted] = useState<boolean>(
    tx?.pendingDestinationConfirmation === false
  )
  const [loading, setLoading] = useState(false)

  const [txObj, setTxObj] = useState<TxObj>()

  const provider = useMemo(() => {
    if (!slug) return
    const _chain = sdk.toChainModel(slug)
    console.log(`_chain:`, _chain)
    return _chain.provider
  }, [slug])

  const initState = useCallback(async (srcHash: string, slug: string) => {
    setLoading(true)
    if (srcHash && slug) {
      const txModel = new Transaction({
        hash: srcHash,
        networkName: slug,
      })

      setTx(txModel)

      const response = await txModel.getTransaction()
      const receipt = await txModel.receipt()
      console.log(`response:`, response)
      console.log(`receipt:`, receipt)

      const { data, gasPrice } = response
      const { gasUsed } = receipt
      const gasCost = formatEther(gasUsed.mul(gasPrice!))

      const funcSig = data.slice(0, 10)
      const methodName = sigHashes[funcSig]

      const date = new Date(txModel.timestamp)
      const relTime = dayjs(date).toNow()
      console.log(`relTime:`, relTime)

      setLoading(false)

      setTxObj({
        type: TxType.sendL2ToL2,
        model: txModel,
        response,
        receipt,
        methodName,
        gasCost,
      })

      let params: any = []
      let eventValues: any

      if (methodName === 'swapAndSend') {
        const transferSents = await fetchTransferSents(slug, response.from, srcHash)
        if (transferSents?.length) {
          const lastTransfer: L2Transfer = getLastLog(transferSents)
          console.log(`lastTransfer:`, lastTransfer)
          const { amount, deadline, timestamp, token, transferId } = lastTransfer
          eventValues = formatLogArgs(lastTransfer)
          console.log(`eventValues:`, eventValues)
          const b = sdk.bridge(token)
          const ammWrapper = await b.getAmmWrapper(slug, provider || undefined)

          const frag = find(ammWrapper.interface.functions, ['name', 'swapAndSend'])

          if (frag) {
            params = ammWrapper.interface.decodeFunctionData(frag, response.data)
            console.log(`params:`, params)
          }
        }
      }
      const waitConfirmations = getNetworkWaitConfirmations(slug as string)
      setNetworkConfirmations(waitConfirmations)
      setConfirmations(response.confirmations)

      if (waitConfirmations && response.confirmations >= waitConfirmations) {
        setCompleted(true)
        txModel.pending = false
      }

      const ts = new Date(txModel.timestamp * 1000).toString()

      setTxObj({
        type: TxType.sendL2ToL2,
        model: txModel,
        response,
        receipt,
        methodName,
        params,
        gasCost,
        timestamp: ts,
        eventValues,
      })
    }
  }, [])

  const updateTxStatus = useCallback(async () => {
    if (tx) {
      const waitConfirmations = getNetworkWaitConfirmations(slug as string)
      setNetworkConfirmations(waitConfirmations)

      const txResponse = await tx.getTransaction()
      setConfirmations(txResponse?.confirmations)

      if (waitConfirmations && txResponse?.confirmations >= waitConfirmations) {
        setCompleted(true)
        tx.pending = false
        setTx(tx)
      }
    }
  }, [tx])

  const updateDestTxStatus = useCallback(async () => {
    if (
      tx &&
      tx.destNetworkName &&
      tx.networkName !== tx.destNetworkName &&
      (destCompleted === false || !tx.destTxHash || tx.pendingDestinationConfirmation)
    ) {
      const isSpent = await tx?.checkIsTransferIdSpent(sdk)
      logger.debug(`tx ${tx.hash.slice(0, 10)} isSpent:`, isSpent)
      if (isSpent) {
        setDestCompleted(true)
        tx.pendingDestinationConfirmation = false
        setTx(tx)
      }
    }
  }, [tx])

  async function getTransactionDetails(transaction: Transaction) {
    try {
      const receipt = await transaction.receipt()
      // Get the event data (topics)
      const tsDetails = getTransferSentDetailsFromLogs(receipt.logs)
      console.log(`tsDetails:`, tsDetails)

      if (transaction.token && transaction.destNetworkName) {
        const bridge = sdk.bridge(transaction.token.symbol)

        // No transferId because L1 -> L2
        if (tsDetails && !tsDetails.transferId) {
          const l1Bridge = await bridge.getL1Bridge(transaction.provider)
          // Get the rest of the event data
          const decodedData = l1Bridge.interface.decodeEventLog(
            tsDetails?.eventName!,
            tsDetails?.log.data
          )
          console.log(`decodedData:`, decodedData)

          if ('amount' in decodedData) {
            const { amount, deadline } = decodedData
            // Query Graph Protocol for TransferFromL1Completed events
            const transferFromL1Completeds = await fetchTransferFromL1Completeds(
              transaction.destNetworkName,
              tsDetails.recipient,
              amount,
              deadline
            )

            if (transferFromL1Completeds?.length) {
              const lastTransfer: L1Transfer =
                transferFromL1Completeds[transferFromL1Completeds.length - 1]

              transaction.destTxHash = lastTransfer.transactionHash
              transaction.pendingDestinationConfirmation = false
              return true
            }

            // If TheGraph is not working...
            const destL2Bridge = await bridge.getL2Bridge(transaction.destNetworkName)
            const bln = await destL2Bridge.provider.getBlockNumber()
            const evs = await destL2Bridge.queryFilter(
              destL2Bridge.filters.TransferFromL1Completed(),
              bln - 9999,
              bln
            )

            if (evs?.length) {
              // Find the matching amount
              const tfl1Completed = findTransferFromL1CompletedLog(
                evs,
                tsDetails.recipient,
                amount,
                deadline
              )
              if (tfl1Completed) {
                transaction.destTxHash = tfl1Completed.transactionHash
                transaction.pendingDestinationConfirmation = false
                return true
              }
            }

            logger.debug(`tx ${tsDetails.txHash.slice(0, 10)} isSpent:`, false)
          }
        }

        // transferId found in event: TransferSent
        if (tsDetails?.transferId) {
          transaction.transferId = tsDetails.transferId
        }

        // Transfer from L2
        // transferId found in event: TransferSent
        if (transaction.transferId && transaction.destNetworkName) {
          // Query Graph Protocol for WithdrawalBonded events
          const withdrawalBondeds = await fetchWithdrawalBondedsByTransferId(
            transaction.destNetworkName,
            transaction.transferId
          )
          if (withdrawalBondeds?.length) {
            const lastEvent = withdrawalBondeds[withdrawalBondeds.length - 1]
            transaction.destTxHash = lastEvent.transactionHash
          }

          // L2 -> L1
          if (transaction.destNetworkName === 'ethereum') {
            const destL1Bridge = await bridge.getL1Bridge(transaction.provider)
            const isSpent = await destL1Bridge.isTransferIdSpent(transaction.transferId)
            if (isSpent) {
              transaction.pendingDestinationConfirmation = false
            }
            logger.debug(`isSpent(${transaction.transferId.slice(0, 10)}: transferId):`, isSpent)
            return isSpent
          }

          // L2 -> L2
          const destL2Bridge = await bridge.getL2Bridge(transaction.destNetworkName)
          const isSpent = await destL2Bridge.isTransferIdSpent(transaction.transferId)
          if (isSpent) {
            transaction.pendingDestinationConfirmation = false
          }
          logger.debug(`isSpent(${transaction.transferId.slice(0, 10)}: transferId):`, isSpent)
        }
      }
    } catch (error) {
      logger.error(formatError(error))
    }

    setTx(transaction)

    return transaction
  }

  return {
    tx,
    txObj,
    loading,
    setTx,
    initState,
    completed,
    destCompleted,
    confirmations,
    networkConfirmations,
    updateTxStatus,
    updateDestTxStatus,
    getTransactionDetails,
  }
}

export default useTransaction
