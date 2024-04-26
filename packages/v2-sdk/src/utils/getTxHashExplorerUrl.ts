import { getExplorerUrl } from './getExplorerUrl.js'

export function getTxHashExplorerUrl (network: string, chainId: number, txHash: string) {
  const baseUrl = getExplorerUrl(network, chainId)
  return `${baseUrl}/tx/${txHash}`
}
