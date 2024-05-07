import { getExplorerUrl } from './getExplorerUrl.js'

export function getAddressExplorerUrl (network: string, chainId: string, address: string) {
  const baseUrl = getExplorerUrl(network, chainId)
  return `${baseUrl}/address/${address}`
}
