import { L1_NETWORK, Chain } from 'src/utils'
import { networks } from 'src/config'

export const getRpcUrl = (network: string) => {
  const networkRpcUrl = networks[network]?.rpcUrl
  if (typeof networkRpcUrl !== 'string') {
    throw new Error(`rpcUrl could not be found for network: ${network}`)
  }

  return networkRpcUrl
}

export function getAllRpcUrls() {
  return {
    arbitrum: getRpcUrl(Chain.Arbitrum),
    optimism: getRpcUrl(Chain.Optimism),
    xdai: getRpcUrl(Chain.xDai),
    polygon: getRpcUrl(Chain.Polygon),
    ethereum: getRpcUrl(L1_NETWORK),
  }
}
