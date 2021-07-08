import * as ethers from 'ethers'
import debounce from 'debounce-promise'
import pThrottle from 'p-throttle'
import { Chain } from 'src/constants'
import { config } from 'src/config'

export const getL2MessengerId = (l2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(l2Name))
}

export { debounce }
export const throttle = (fn: any, interval: number) => {
  const t = pThrottle({ limit: 1, interval })
  return t(fn)
}

export const wait = async (t: number) => {
  return new Promise(resolve => setTimeout(() => resolve(null), t))
}

export const getRpcUrls = (network: string): string | undefined => {
  return config.networks[network]?.rpcUrls.slice(0, 3) // max of 3 endpoints
}

export const getRpcProvider = (network: string): ethers.providers.Provider => {
  const rpcUrls = getRpcUrls(network)
  if (!rpcUrls.length) {
    return null
  }
  return getRpcProviderFromUrl(rpcUrls)
}

export const getRpcProviderFromUrl = (
  rpcUrls: string | string[]
): ethers.providers.Provider => {
  let providers: ethers.providers.StaticJsonRpcProvider[] = []
  if (!Array.isArray(rpcUrls)) {
    rpcUrls = [rpcUrls]
  }
  for (let rpcUrl of rpcUrls) {
    const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
    if (rpcUrls.length === 1) {
      return provider
    }
    providers.push(provider)
  }
  const fallbackProvider = new ethers.providers.FallbackProvider(providers, 1)
  return fallbackProvider
}

export const chainSlugToId = (network: string): string | undefined => {
  return (
    config.networks[network]?.networkId || config.networks[network]?.chainId
  )
}

export const chainIdToSlug = (chainId: string | number): string | undefined => {
  if (!config.networks) {
    throw new Error('networks not found')
  }
  for (let k in config.networks) {
    let v = config.networks[k]
    if (!v) {
      continue
    }
    if (
      v?.networkId?.toString() == chainId.toString() ||
      v?.chainId?.toString() === chainId.toString()
    ) {
      return k
    }
  }
}

export const isL1 = (network: string) => {
  return network === Chain.Ethereum
}

export const isL2 = (network: string) => {
  return network !== Chain.Ethereum
}

export const isL1ChainId = (chainId: number | string) => {
  return ['1', '5', '42'].includes(chainId.toString())
}

export const getSafeWaitConfirmations = (chainSlug: string) => {
  return config.networks?.[chainSlug]?.waitConfirmations || 0
}

export const xor = (a: number, b: number) => {
  return (a || b) && !(a && b)
}
