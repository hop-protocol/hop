import { networks } from '#common/networks.js'

export function getExplorerUrl (network: string, chainId: number) {
  const url : string = (networks as any)[network]?.[chainId]?.explorerUrls?.[0]

  if (!url) {
    throw new Error(`Invalid network ${network} or chainId: ${chainId}, explorer url not found`)
  }

  return url
}
