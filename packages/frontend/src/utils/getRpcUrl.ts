import { L1_NETWORK } from 'src/constants'
import { networks } from 'src/config'
import { Chain } from './constants'

export const getRpcUrl = (network: string) => {
  return networks[network]?.rpcUrl
}

export function getRpcUrlByNetworkName(networkName: string) {
  let rpcUrl = ''
  if (networkName === Chain.Arbitrum) {
    rpcUrl = getRpcUrl(Chain.Arbitrum)
  } else if (networkName === Chain.Optimism) {
    rpcUrl = getRpcUrl(Chain.Optimism)
  } else if (networkName === Chain.xDai) {
    rpcUrl = getRpcUrl(Chain.xDai)
  } else if (networkName === Chain.Polygon) {
    rpcUrl = getRpcUrl(Chain.Polygon)
  } else {
    rpcUrl = getRpcUrl(L1_NETWORK)
  }
  return rpcUrl
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
