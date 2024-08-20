import { getExplorerUrl } from './getExplorerUrl.js'

export function getTokenExplorerUrl (network: string, chainId: string, address: string) {
  const baseUrl = getExplorerUrl(network, chainId)
  return `${baseUrl}/token/${address}`
}
