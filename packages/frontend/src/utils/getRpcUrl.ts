import { L1_NETWORK } from 'src/utils'
import { networks } from 'src/config'
import { ChainSlugs } from '@hop-protocol/sdk'

export const getRpcUrl = (network: string) => {
  const networkRpcUrl = networks[network]?.rpcUrl
  if (typeof networkRpcUrl !== 'string') {
    throw new Error(`rpcUrl could not be found for network: ${network}`)
  }

  return networkRpcUrl
}

export function getAllRpcUrls() {
  return {
    arbitrum: getRpcUrl(ChainSlugs.Arbitrum),
    optimism: getRpcUrl(ChainSlugs.Optimism),
    gnosis: getRpcUrl(ChainSlugs.Gnosis),
    polygon: getRpcUrl(ChainSlugs.Polygon),
    ethereum: getRpcUrl(L1_NETWORK),
  }
}
