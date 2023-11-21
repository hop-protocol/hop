import { networks } from 'src/config'
import { reactAppNetwork } from '../config'

export const getRpcUrlOrThrow = (network: string) => {
  if (!network) {
    throw new Error('expected argument: network')
  }

  let networkRpcUrl = networks?.[network]?.rpcUrl
  // make goerli rpc available when react app network is mainnet, this is for testing certain features on staging mainnet environment
  if (!networkRpcUrl && (network === 'goerli' || (network === 'ethereum' && reactAppNetwork === 'goerli'))) {
    networkRpcUrl = 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213' // infura id is from ethers
  }
  if (typeof networkRpcUrl !== 'string') {
    throw new Error(`rpcUrl could not be found for network: ${network}`)
  }

  return networkRpcUrl
}

export const getRpcUrl = (network: string) => {
  try {
    return getRpcUrlOrThrow(network)
  } catch (err) {
    return ''
  }
}

export const getRpcUrls = (network: string) => {
  const rpcUrl = getRpcUrlOrThrow(network)
  const fallbackRpcUrls = networks?.[network]?.fallbackRpcUrls ?? []
  return [rpcUrl, ...fallbackRpcUrls]
}
