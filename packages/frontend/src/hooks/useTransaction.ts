import { useState, useEffect, useReducer } from 'react'
import { findNetworkBySlug, getNetworkWaitConfirmations } from 'src/utils/networks'
import {
  fetchTransferFromL1Completeds,
  fetchWithdrawalBondedsByTransferId,
  L1Transfer,
  getLastLog,
  formatLogArgs,
  networkIdToSlug,
} from 'src/utils'
import {
  createDispatchAction,
  TxActionType,
  TxState,
  txReducer,
  MethodNames,
  TxType,
  TxDetails,
  getTxDetails,
} from 'src/utils/transactions'
import { BigNumber, providers, utils } from 'ethers'
import { getAllProviders } from 'src/utils/getProvider'
import { getExplorerTxUrl } from 'src/utils/getExplorerUrl'
import { useApp } from 'src/contexts/AppContext'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { getTokenByAddress } from 'src/utils/tokens'
import { TToken, TokenSymbol } from '@hop-protocol/sdk'

// TODO: use typechain
export const methodToSigHashes = {
  // HopBridgeToken
  approve: '0x095ea7b3',
  // L1Bridge
  sendToL2: '0xdeace8f5', // L1 -> L2
  // L2AmmWrapper
  swapAndSend: '0xeea0d7b2', // L2 -> L2 / L2 -> L1
  // L1Bridge / L2AmmWrapper
  withdraw: '0x0f7aadb7', // L2 -> L2 / L2 -> L1 (bonder offline)
  bondWithdrawalAndDistribute: '0x3d12a85a',
  distribute: '0xcc29a306',
}

export const sigHashes = {
  '0x095ea7b3': 'approve',
  // L1_Bridge
  '0xdeace8f5': 'sendToL2', // L1 -> L2
  // L2_Bridge
  '0xeea0d7b2': 'swapAndSend', // L2 -> L2 / L2 -> L1
  // L1_Bridge / L2_Bridge
  '0x0f7aadb7': 'withdraw', // L2 -> L2 / L2 -> L1 (bonder offline)
  '0x3d12a85a': 'bondWithdrawalAndDistribute',
  '0xcc29a306': 'distribute',
}

const initialState: TxState = {
  networkName: '',
  txHash: '',
}

const useTransaction = (txHash?: string) => {
  const [tx, dispatch] = useReducer(txReducer, initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>()
  const { sdk } = useApp()

  function dispatchAction(type: TxActionType, payload: TxState) {
    dispatch(createDispatchAction(type, payload))
  }

  useEffect(() => {
    async function initState() {
      if (txHash) {
        setError(false)
        setLoading(true)
        try {
          let provider: providers.WebSocketProvider | providers.StaticJsonRpcProvider | undefined
          let response: TransactionResponse | undefined
          let networkName: string | undefined

          const allProviders = getAllProviders()
          for (const networkKey in allProviders) {
            try {
              if (!response) {
                response = await allProviders[networkKey].getTransaction(txHash)
                networkName = networkKey
                provider = allProviders[networkKey]
              }
            } catch (error) {
              // continue / ignore errors
            }
          }

          if (!(response && provider && networkName)) {
            throw new Error(`Could not get tx on any network: ${txHash}`)
          }

          const receipt = await provider.getTransactionReceipt(txHash)

          // TODO: add util to get token symbol by address
          const txDetails = getTxDetails(response, receipt)
          const { methodName, params, eventValues, txType } = txDetails
          const tokenSymbol = getTokenByAddress(networkName, response.to!)

          setLoading(false)

          const gasUsed = receipt?.gasUsed || BigNumber.from(0)
          const gasCost = utils.formatEther(gasUsed.mul(response.gasPrice!))

          let completed = false
          const waitConfirmations = getNetworkWaitConfirmations(networkName as string)
          if (waitConfirmations && response.confirmations >= waitConfirmations) {
            completed = true
          }

          dispatchAction(TxActionType.setTxState, {
            networkName,
            network: findNetworkBySlug(networkName),
            txHash,
            response,
            receipt,
            confirmations: response.confirmations,
            networkConfirmations: waitConfirmations,
            completed,
            methodName,
            gasCost,
            params,
            eventValues,
            txType,
            tokenSymbol,
            ...(tokenSymbol && { token: sdk.toTokenModel(tokenSymbol as TToken) }),
          })

          switch (methodName) {
            case MethodNames.sendToL2: {
              return handleSendToL2(txDetails)
            }
            case MethodNames.swapAndSend: {
              return handleSwapAndSend(txDetails)
            }

            default: {
              return {
                methodName,
                params,
                eventValues,
              }
            }
          }
        } catch (error) {
          setLoading(false)
          setError(error)
          console.log(`error:`, error)
        }
      }
    }

    initState()
  }, [txHash])

  async function handleSendToL2(txDetails: TxDetails) {
    const { params, eventValues } = txDetails
    const { amount, deadline, chainId, recipient } = params
    const destNetworkName = networkIdToSlug(chainId)

    dispatchAction(TxActionType.setTx, {
      params,
      txType: TxType.sendL1ToL2,
      destTx: {
        networkName: destNetworkName,
      },
      ...(eventValues && { eventValues: formatLogArgs(eventValues) }),
    })

    const transferFromL1Completeds = await fetchTransferFromL1Completeds(
      destNetworkName,
      recipient,
      amount,
      deadline
    )

    if (transferFromL1Completeds?.length) {
      const tfl1: L1Transfer = getLastLog(transferFromL1Completeds)
      console.log(`tfl1:`, tfl1)
      const { token, transactionHash, timestamp } = tfl1

      dispatchAction(TxActionType.setTx, {
        tokenSymbol: token as TokenSymbol,
        token: sdk.toTokenModel(token as TToken),
        destTx: {
          networkName: destNetworkName,
          txHash: transactionHash,
          eventValues: tfl1,
          completed: true,
          datetime: new Date(parseInt(timestamp || '0') * 1000).toString(),
          explorerLink: getExplorerTxUrl(destNetworkName, transactionHash),
        },
      })
    }
  }

  async function handleSwapAndSend(txDetails: TxDetails) {
    const { params, eventValues } = txDetails
    const destNetworkName = networkIdToSlug(params.chainId)

    dispatchAction(TxActionType.setTx, {
      params,
      txType: TxType.sendL2ToL2,
      destTx: {
        networkName: destNetworkName,
      },
      ...(eventValues && { eventValues: formatLogArgs(eventValues) }),
    })

    if (eventValues?.transferId) {
      const withdrawalBondeds = await fetchWithdrawalBondedsByTransferId(
        destNetworkName,
        eventValues.transferId
      )
      if (withdrawalBondeds?.length) {
        const wbDetails = getLastLog(withdrawalBondeds)
        console.log(`wbDetails:`, wbDetails)
        const { transactionHash, token, timestamp } = wbDetails

        dispatchAction(TxActionType.setTx, {
          tokenSymbol: token,
          token: sdk.toTokenModel(token),
          destTx: {
            networkName: destNetworkName,
            txHash: transactionHash,
            eventValues: wbDetails,
            completed: true,
            datetime: new Date(parseInt(timestamp || '0') * 1000).toString(),
            explorerLink: getExplorerTxUrl(destNetworkName, transactionHash),
          },
        })
      }
    }
  }

  return {
    tx,
    loading,
    error,
  }
}

export default useTransaction
