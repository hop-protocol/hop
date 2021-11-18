import { L1_NETWORK } from 'src/constants'
import { networks } from 'src/config'

export const getRpcUrl = (network: string) => {
  return networks[network]?.rpcUrl
}

export function getRpcUrlByNetworkName(networkName: string) {
  let rpcUrl = ''
  if (networkName.startsWith('arbitrum')) {
    rpcUrl = getRpcUrl('arbitrum')
  } else if (networkName.startsWith('optimism')) {
    rpcUrl = getRpcUrl('optimism')
  } else if (networkName.startsWith('xdai')) {
    rpcUrl = getRpcUrl('xdai')
  } else if (networkName.startsWith('polygon')) {
    rpcUrl = getRpcUrl('polygon')
  } else {
    rpcUrl = getRpcUrl(L1_NETWORK)
  }
  return rpcUrl
}

export function getAllRpcUrls() {
  return {
    arbitrum: getRpcUrl('arbitrum'),
    optimism: getRpcUrl('optimism'),
    xdai: getRpcUrl('xdai'),
    polygon: getRpcUrl('polygon'),
    ethereum: getRpcUrl(L1_NETWORK),
  }
}

export default getRpcUrl
