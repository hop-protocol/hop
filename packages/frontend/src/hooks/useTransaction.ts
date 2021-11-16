import { useState, useMemo, useCallback } from 'react'
import { useApp } from 'src/contexts/AppContext'
import useTxHistory from 'src/contexts/AppContext/useTxHistory'
import { getNetworkWaitConfirmations } from 'src/utils/networks'
import {
  fetchTransferFromL1Completeds,
  fetchWithdrawalBondedsByTransferId,
  getTransferSentDetailsFromLogs,
  L1Transfer,
  fetchTransferSents,
  L2Transfer,
  getLastLog,
  formatLogArgs,
  networkIdToSlug,
} from 'src/utils'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { getProviderByNetworkName } from 'src/utils/getProvider'
import { Interface, Result } from '@ethersproject/abi'
import { getExplorerTxUrl } from 'src/utils/getExplorerUrl'

export const methodToSigHashes = {
  // L1_Bridge
  sendToL2: '0xdeace8f5', // L1 -> L2
  // L2_Bridge
  swapAndSend: '0xeea0d7b2', // L2 -> L2 / L2 -> L1
  // L1_Bridge / L2_Bridge
  withdraw: '0x0f7aadb7', // L2 -> L2 / L2 -> L1 (bonder offline)
}

export const sigHashes = {
  '0x095ea7b3': 'approve',
  // L1_Bridge
  '0xdeace8f5': 'sendToL2', // L1 -> L2
  // L2_Bridge
  '0xeea0d7b2': 'swapAndSend', // L2 -> L2 / L2 -> L1
  // L1_Bridge / L2_Bridge
  '0x0f7aadb7': 'withdraw', // L2 -> L2 / L2 -> L1 (bonder offline)
}

enum TxType {
  approve = 'approve',
  sendL1ToL2 = 'L1 to L2',
  sendL2ToL2 = 'L2 to L2',
  sendL2ToL1 = 'L2 to L1',
  convert = 'convert',
  wrap = 'wrap',
  unwrap = 'unwrap',
  addLiquidity = 'addLiquidity',
  removeLiquidity = 'removeLiquidity',
  stake = 'stake',
  unstake = 'unstake',
}

interface TxObj {
  type?: TxType
  response: TransactionResponse
  receipt: TransactionReceipt
  gasCost: string
  datetime?: string
  methodName?: string
  tokenSymbol?: string
  params?: any[]
  eventValues?: any
  destNetworkName?: string
  destTxHash?: string
  destExplorerLink?: string
}

const useTransaction = (txHash?: string, slug?: string) => {
  const [tx, setTx] = useState<any>()
  const [completed, setCompleted] = useState<boolean>(tx?.pending === false)
  const [networkConfirmations, setNetworkConfirmations] = useState<number>()
  const [confirmations, setConfirmations] = useState<number>()
  const [destCompleted, setDestCompleted] = useState<boolean>(
    tx?.pendingDestinationConfirmation === false
  )
  const [loading, setLoading] = useState(false)

  const [txObj, setTxObj] = useState<TxObj>()

  const { sdk, contracts } = useApp()

  const provider = useMemo(() => {
    if (!slug) return
    const _chain = sdk.toChainModel(slug)
    console.log(`_chain:`, _chain)
    return _chain.provider
  }, [slug])

  const initState = useCallback(async (srcHash: string, slug: string) => {
    setLoading(true)
    if (srcHash && slug) {
      const provider = getProviderByNetworkName(slug)
      const response = await provider.getTransaction(srcHash)
      const receipt = await provider.getTransactionReceipt(srcHash)

      const { data, gasPrice } = response
      const { gasUsed } = receipt
      const gasCost = formatEther(gasUsed.mul(gasPrice!))

      const funcSig = data.slice(0, 10)
      const methodName = sigHashes[funcSig]

      setLoading(false)

      setTxObj({
        response,
        receipt,
        methodName,
        gasCost,
      })

      let params: any = []
      let eventValues: any
      let txType
      let tokenSymbol
      let destNetworkName
      let destTxHash
      let destExplorerLink
      let ts

      console.log(`methodName:`, methodName)
      console.log(`contracts:`, contracts)

      if (methodName === 'sendToL2' && contracts) {
        txType = TxType.sendL1ToL2
        const l1BridgeInterface: Interface = contracts.l1BridgeInterface
        const decodedData: Result = l1BridgeInterface?.decodeFunctionData(methodName, response.data)

        if (decodedData) {
          const { amount, deadline, chainId, recipient } = decodedData
          destNetworkName = networkIdToSlug(chainId)

          const transferFromL1Completeds = await fetchTransferFromL1Completeds(
            destNetworkName,
            recipient,
            amount,
            deadline
          )

          eventValues = {}
          if (transferFromL1Completeds?.length) {
            const lastTransfer: L1Transfer = getLastLog(transferFromL1Completeds)
            const { token, transactionHash, timestamp } = lastTransfer
            ts = timestamp
            tokenSymbol = token
            destTxHash = transactionHash
            destExplorerLink = getExplorerTxUrl(destNetworkName, transactionHash)
          }
        }

        const inputs = l1BridgeInterface.getFunction(methodName).inputs
        const decodedArgs = inputs.reduce((acc, input) => {
          return {
            ...acc,
            [input.name]: decodedData[input.name],
          }
        }, {})
        params = formatLogArgs(decodedArgs)
      }

      // if (tsDetails && !tsDetails.transferId) {
      //   const { chainId, recipient, log } = tsDetails

      // const l1Bridge = await bridge.getL1Bridge(this.provider)
      // // Get the rest of the event data
      // const decodedData = l1Bridge.interface.decodeEventLog(
      //   tsDetails?.eventName!,
      //   tsDetails?.log.data
      // )
      // }

      // const b = sdk.bridge()

      if (methodName === 'swapAndSend') {
        txType = TxType.sendL2ToL2
        const tsDetails = getTransferSentDetailsFromLogs(receipt.logs)
        console.log(`tsDetails:`, tsDetails)
        const { chainId, transferId } = tsDetails!
        destNetworkName = networkIdToSlug(chainId)

        const transferSents = await fetchTransferSents(slug, response.from, srcHash)
        if (transferSents?.length) {
          const lastTransfer: L2Transfer = getLastLog(transferSents)
          console.log(`lastTransfer:`, lastTransfer)
          eventValues = lastTransfer
          const { token, destinationChainId, timestamp, transferId } = lastTransfer
          const b = sdk.bridge(token)
          const ammWrapper = await b.getAmmWrapper(slug, provider || undefined)

          ts = timestamp
          tokenSymbol = token
          destNetworkName = networkIdToSlug(destinationChainId)
          params = formatLogArgs(ammWrapper.interface.decodeFunctionData(methodName, response.data))
        }

        const withdrawalBondeds = await fetchWithdrawalBondedsByTransferId(
          destNetworkName,
          transferId!
        )
        if (withdrawalBondeds?.length) {
          const lt = getLastLog(withdrawalBondeds)
          console.log(`lt:`, lt)
          const { transactionHash, timestamp } = lt
          destTxHash = transactionHash
          destExplorerLink = getExplorerTxUrl(destNetworkName, transactionHash)
        }
      }

      const waitConfirmations = getNetworkWaitConfirmations(slug as string)
      setNetworkConfirmations(waitConfirmations)
      setConfirmations(response.confirmations)

      if (waitConfirmations && response.confirmations >= waitConfirmations) {
        setCompleted(true)
      }

      setTxObj({
        type: txType,
        response,
        receipt,
        methodName,
        params,
        gasCost,
        datetime: new Date(ts * 1000).toString(),
        tokenSymbol,
        eventValues,
        destNetworkName,
        destTxHash,
        destExplorerLink,
      })
    }
  }, [])

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
  }
}

export default useTransaction
