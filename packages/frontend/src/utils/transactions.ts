import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import Transaction from 'src/models/Transaction'
import { sigHashes } from 'src/hooks/useTransaction'
import {
  contractInterfaces,
  hopBridgeTokenInterface,
  l1BridgeInterface,
  l2AmmWrapperInterface,
} from './contracts'
import { findTransferSentLog, findTransferSentToL2Log, formatLogArgs } from '.'
import { EventNames } from 'src/utils/constants'
import { utils, BigNumber, providers } from 'ethers'
import { Interface, LogDescription } from '@ethersproject/abi'
import Network from 'src/models/Network'
import { TokenSymbol, TokenModel } from '@hop-protocol/sdk'
import range from 'lodash/range'

export function getTruncatedHash(hash): string {
  return `${hash.substring(0, 6)}…${hash.substring(62, 66)}`
}

export const sortByRecentTimestamp = (txs: Transaction[]) => {
  return txs.sort((a, b) => b.timestampMs - a.timestampMs)
}

export function filterByHash(txs: Transaction[] = [], hash: string = '') {
  return txs.filter(tx => tx.hash !== hash)
}

export function getBlockTagChunks(toBlock: number, numBlocks = 9999, step = 1000) {
  const fromBlocks = range(toBlock - numBlocks, toBlock, step)
  const blockTags = fromBlocks.map(fromBlock => [fromBlock, fromBlock + step - 1])
  return blockTags
}

export async function queryFilterTransferFromL1CompletedEvents(bridge, networkName) {
  const destL2Bridge = await bridge.getL2Bridge(networkName)
  const filter = destL2Bridge.filters.TransferFromL1Completed()

  const blockNumber = await destL2Bridge.provider.getBlockNumber()
  const blockTags = getBlockTagChunks(blockNumber)

  const evs = await Promise.all(
    blockTags.map(([fromBlock, toBlock]) => destL2Bridge.queryFilter(filter, fromBlock, toBlock))
  )
  return evs
}

export enum MethodNames {
  approve = 'approve',
  sendToL2 = 'sendToL2',
  swapAndSend = 'swapAndSend',
  bondWithdrawalAndDistribute = 'bondWithdrawalAndDistribute',
  distribute = 'distribute',
  execTransaction = 'execTransaction',
}

export enum TxType {
  approve = 'approval',
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
  bondWithdrawalAndDistribute = 'bondWithdrawalAndDistribute',
  distribute = 'distribute',
  unknown = 'unknown',
}

export interface Tx {
  networkName?: string
  network?: Network
  txHash?: string

  methodName?: string
  params?: any[]
  completed?: boolean

  response?: TransactionResponse
  receipt?: TransactionReceipt

  confirmations?: number
  networkConfirmations?: number
  explorerLink?: string

  eventName?: string
  eventValues?: any
  datetime?: string
}

export type TxState = Tx & {
  txType?: TxType
  tokenSymbol?: TokenSymbol
  token?: TokenModel
  gasCost?: string
  destTx?: Tx
}

export enum TxActionType {
  setTx = 'setTx',
  setDestTx = 'setDestTx',
  setTxState = 'setTxState',
}

interface TxReducerAction {
  type: TxActionType
  payload: TxState
}

export function createDispatchAction(type: TxActionType, payload: TxState): TxReducerAction {
  return {
    type,
    payload,
  }
}

export function txReducer(state: TxState, action: TxReducerAction) {
  switch (action.type) {
    case TxActionType.setTx: {
      return {
        ...state,
        ...action.payload,
      }
    }

    case TxActionType.setDestTx: {
      return {
        ...state,
        destTx: action.payload.destTx,
      }
    }

    case TxActionType.setTxState: {
      return action.payload
    }
  }
}

export interface TxDetails {
  methodName: string
  params: any
  log?: providers.Log
  eventValues?: any
  txType?: TxType
}

const getHopTxInfo = (response: TransactionResponse): {methodSig: string, data: string} => {
  const txMethodSig = response.data.slice(0, 10);
  const methodName = sigHashes[txMethodSig];

  // execTransaction is the method executed when the TX was sent from a GnosisSafe.
  if (methodName === "execTransaction") {
    const iface = contractInterfaces.gnosisSafeExecTransactionInterface
    const res = iface.decodeFunctionData(MethodNames.execTransaction, response.data);
    // return original tx data
    return { methodSig: res[2].slice(0, 10), data: res[2] };
  } else {
    return { methodSig: txMethodSig, data: response.data };
  }
};

export function getTxDetails(txResponse: TransactionResponse, receipt: TransactionReceipt): TxDetails {
  const hopTxInfo = getHopTxInfo(txResponse);

  // WIP: generalizing the interfaces to find a matching function signature
  const theOne: any = Object.keys(contractInterfaces).reduce((acc, key) => {
    const iface: Interface = contractInterfaces[key]
    try {
      const func = iface.getFunction(hopTxInfo.methodSig)
      const sigHash = iface.getSighash(func.name)
      return {
        func,
        iface,
        sigHash,
      }
    } catch (error) {
      return acc
    }
  }, {})

  const methodName = sigHashes[hopTxInfo.methodSig] ?? theOne?.func?.name

  switch (methodName) {
    case MethodNames.approve: {
      const decodedData = hopBridgeTokenInterface.decodeFunctionData(
        MethodNames.approve,
        hopTxInfo.data
      )
      const params = formatLogArgs(decodedData)
      return {
        txType: TxType.approve,
        methodName,
        params,
      }
    }

    case MethodNames.swapAndSend: {
      const decodedData = l2AmmWrapperInterface.decodeFunctionData(
        MethodNames.swapAndSend,
        hopTxInfo.data
      )

      const params = formatLogArgs(decodedData)
      const sentLog: any = findTransferSentLog(receipt?.logs)
      const [topic, transferId, chainId, recipient] = sentLog?.topics || []

      return {
        methodName,
        params,
        log: sentLog,
        eventValues: {
          eventName: EventNames.TransferSent,
          topic,
          transferId,
          chainId: chainId ? BigNumber.from(chainId).toString() : '',
          recipient: recipient ? utils.hexStripZeros(recipient) : '',
          txHash: sentLog?.transactionHash,
        },
      }
    }

    case MethodNames.sendToL2: {
      const decodedData = l1BridgeInterface.decodeFunctionData(MethodNames.sendToL2, hopTxInfo.data)

      const params = formatLogArgs(decodedData)
      const sentToL2Log: any = findTransferSentToL2Log(receipt?.logs)
      const [topic, chainId, recipient, relayer] = sentToL2Log?.topics || []

      return {
        methodName,
        params,
        log: sentToL2Log,
        eventValues: {
          eventName: EventNames.TransferSentToL2,
          topic,
          chainId: chainId ? BigNumber.from(chainId).toString() : '',
          recipient: recipient ? utils.hexStripZeros(recipient) : '',
          relayer,
          txHash: sentToL2Log?.transactionHash,
        },
      }
    }

    // This works with bondWithdrawalAndDistribute() as well as distribute() !!!
    default: {
      if (!theOne.iface) {
        return {
          methodName,
          params: {},
        }
      }

      const decodedData = theOne.iface.decodeFunctionData(hopTxInfo, hopTxInfo.data)
      const params = formatLogArgs(decodedData)
      let evs = {}
      const eventWithValues: any = receipt.logs.reduce((acc, log) => {
        try {
          const parsedLog: LogDescription = theOne.iface.parseLog(log)
          evs = formatLogArgs(parsedLog.args)
          return parsedLog
        } catch (error) {
          return acc
        }
      }, {})

      return {
        txType: TxType[sigHashes[hopTxInfo.methodSig] || 'unknown'],
        methodName,
        params,
        eventValues: {
          eventName: eventWithValues?.name,
          topic: eventWithValues?.topic,
          ...evs,
        },
      }
    }

    // default: {
    //   return {
    //     methodName: `unknown method name (${funcSig})`,
    //     params: {},
    //   }
    // }
  }
}
