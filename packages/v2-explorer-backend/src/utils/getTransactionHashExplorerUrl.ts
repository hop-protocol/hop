import { network } from '#config/index.js'
import { getTxHashExplorerUrl } from '@hop-protocol/v2-sdk'

export function getTransactionHashExplorerUrl (transactionHash: string, chainId: number) {
  return getTxHashExplorerUrl(network, chainId, transactionHash)
}
