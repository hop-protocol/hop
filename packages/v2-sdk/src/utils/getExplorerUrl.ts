import { networks } from '#common/networks.js'

export function getExplorerUrl (network: string, chainId: string) {
  const url : string = networks[network]?.[chainId]?.explorerUrls?.[0] ?? ''

  if (!url) {
    console.warn(`hopV2Sdk: Invalid network ${network} or chainId: ${chainId}, explorer url not found.`)
  }

  return url
}
