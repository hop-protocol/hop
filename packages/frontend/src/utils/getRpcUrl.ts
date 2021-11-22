import { L1_NETWORK } from 'src/constants'
import { networks } from 'src/config'
import { Chain } from './constants'

export const getRpcUrl = (network: string) => {
  return networks[network]?.rpcUrl
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

export default getRpcUrl
