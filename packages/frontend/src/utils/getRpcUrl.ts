import { L1_NETWORK } from 'src/utils'
import { networks } from 'src/config'
import { ChainSlug } from '@hop-protocol/sdk'

export const getRpcUrl = (network: string) => {
  const networkRpcUrl = networks[network]?.rpcUrl
  if (typeof networkRpcUrl !== 'string') {
    throw new Error(`rpcUrl could not be found for network: ${network}`)
  }

  return networkRpcUrl
}

export function getAllRpcUrls() {
  return {
    arbitrum: getRpcUrl(ChainSlug.Arbitrum),
    optimism: getRpcUrl(ChainSlug.Optimism),
    gnosis: getRpcUrl(ChainSlug.Gnosis),
    polygon: getRpcUrl(ChainSlug.Polygon),
    ethereum: getRpcUrl(L1_NETWORK),
  }
}
