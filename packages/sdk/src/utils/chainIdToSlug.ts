import * as allNetworks from '@hop-protocol/core/networks'

export function chainIdToSlug (network: string, chainId: number | string) {
  if (chainId === undefined) {
    return ''
  }

  if (typeof chainId === 'number') {
    chainId = chainId.toString()
  }

  const networks = (allNetworks as any)[network] as any
  for (const key in networks) {
    const v = networks[key]
    if (v.networkId.toString() === chainId) {
      return key
    }
  }

  return { 1: 'ethereum', 5: 'goerli', 11155111: 'sepolia' }[chainId] || ''
}
