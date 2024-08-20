import { getExplorerUrl } from './getExplorerUrl.js'

export function getTxHashExplorerUrl (network: string, chainId: string, txHash: string) {
  const baseUrl = getExplorerUrl(network, chainId)
  return `${baseUrl}/tx/${txHash}`
}
