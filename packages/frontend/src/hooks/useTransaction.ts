import { useState, useEffect } from 'react'
import { getNetworkWaitConfirmations } from 'src/utils/networks'
import {
  fetchTransferFromL1Completeds,
  fetchWithdrawalBondedsByTransferId,
  getTransferSentDetailsFromLogs,
  L1Transfer,
  getLastLog,
  formatLogArgs,
  networkIdToSlug,
} from 'src/utils'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { getProviderByNetworkName } from 'src/utils/getProvider'
import { Interface, Result } from '@ethersproject/abi'
import { getExplorerTxUrl } from 'src/utils/getExplorerUrl'
import { hopBridgeTokenAbi, l1BridgeAbi, l2AmmWrapperAbi } from '@hop-protocol/core/abi'

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
  const [error, setError] = useState<any>()
  const [txObj, setTxObj] = useState<TxObj>()

  useEffect(() => {
    async function initState() {
      if (txHash && slug) {
        setError(false)
        setLoading(true)
        try {
          const provider = getProviderByNetworkName(slug)
          const response = await provider.getTransaction(txHash)
          const receipt = await provider.getTransactionReceipt(txHash)

          if (!response) {
            throw new Error(`Could not get tx on network: ${slug}`)
          }

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

          if (methodName === 'approve') {
            txType = TxType.approve
            const tokenInterface = new Interface(hopBridgeTokenAbi)
            console.log(`tokenInterface:`, tokenInterface)
            const decodedData = tokenInterface.decodeFunctionData(methodName, response.data)
            if (decodedData) {
              params = formatLogArgs(decodedData)
            }
          }

          if (methodName === 'sendToL2') {
            txType = TxType.sendL1ToL2
            const l1BridgeInterface = new Interface(l1BridgeAbi)
            const decodedData: Result = l1BridgeInterface?.decodeFunctionData(
              methodName,
              response.data
            )

            if (decodedData) {
              params = formatLogArgs(decodedData)

              const { amount, deadline, chainId, recipient } = decodedData
              destNetworkName = networkIdToSlug(chainId)

              const transferFromL1Completeds = await fetchTransferFromL1Completeds(
                destNetworkName,
                recipient,
                amount,
                deadline
              )

              if (transferFromL1Completeds?.length) {
                const lastTransfer: L1Transfer = getLastLog(transferFromL1Completeds)
                const { token, transactionHash, timestamp } = lastTransfer
                ts = timestamp
                tokenSymbol = token
                destTxHash = transactionHash
                destExplorerLink = getExplorerTxUrl(destNetworkName, transactionHash)
                eventValues = lastTransfer
              }
            }
          }

          if (methodName === 'swapAndSend') {
            txType = TxType.sendL2ToL2
            const ammWrapperInterface = new Interface(l2AmmWrapperAbi)
            const decodedData = ammWrapperInterface.decodeFunctionData(methodName, response.data)
            if (decodedData) {
              params = formatLogArgs(decodedData)
              destNetworkName = networkIdToSlug(params.chainId)

              const tsDetails = getTransferSentDetailsFromLogs(receipt.logs)
              const { chainId, transferId } = tsDetails!
              destNetworkName = networkIdToSlug(chainId)

              const withdrawalBondeds = await fetchWithdrawalBondedsByTransferId(
                destNetworkName,
                transferId!
              )
              if (withdrawalBondeds?.length) {
                const wbDetails = getLastLog(withdrawalBondeds)
                console.log(`wbDetails:`, wbDetails)
                const { transactionHash, token, timestamp } = wbDetails
                ts = timestamp
                tokenSymbol = token
                destTxHash = transactionHash
                destExplorerLink = getExplorerTxUrl(destNetworkName, transactionHash)
                eventValues = wbDetails
              }
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
        } catch (error) {
          setLoading(false)
          setError(error)
          console.log(`error:`, error)
        }
      }
    }

    initState()
  }, [txHash, slug])

  return {
    tx,
    txObj,
    loading,
    error,
    setTx,
    completed,
    destCompleted,
    confirmations,
    networkConfirmations,
  }
}

export default useTransaction
