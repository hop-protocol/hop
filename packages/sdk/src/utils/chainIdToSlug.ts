import * as allNetworks from '@hop-protocol/core/networks'

export function chainIdToSlug (network: string, chainId: number | string) {
  if (chainId === undefined) {
    return ''
  }

  if (typeof chainId === 'number') {
    chainId = chainId.toString()
  }

  for (const _network in allNetworks) {
    const chains = (allNetworks as any)[_network]
    for (const chainSlug in chains) {
      const chainObj = chains[chainSlug]
      if (chainObj.networkId.toString() === chainId) {
        return chainSlug
      }
    }
  }

  return ''
}
