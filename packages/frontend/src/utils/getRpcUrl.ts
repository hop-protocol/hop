import { L1_NETWORK, Chain } from 'src/utils'
import { networks } from 'src/config'

export const getRpcUrl = (network: string) => {
  return networks[network]?.rpcUrl || networks[Chain.Ethereum].rpcUrl
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
