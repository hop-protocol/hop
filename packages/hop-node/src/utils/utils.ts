import debounce from 'debounce-promise'
import pThrottle from 'p-throttle'
import { BigNumber, providers, utils } from 'ethers'
import { Chain } from 'src/constants'
import { config as globalConfig } from 'src/config'

export const getL2MessengerId = (l2Name: string): string => {
  return utils.keccak256(utils.toUtf8Bytes(l2Name))
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
  return globalConfig.networks[network]?.rpcUrls.slice(0, 3) // max of 3 endpoints
}

export const getRpcProvider = (network: string): providers.Provider => {
  const rpcUrls = getRpcUrls(network)
  if (!rpcUrls.length) {
    return null
  }
  return getRpcProviderFromUrl(rpcUrls)
}

export const getProviderChainSlug = (provider: any): string | undefined => {
  const providerUrl = provider?.connection?.url || provider?.providerConfigs?.[0]?.provider?.connection?.url
  if (!providerUrl) {
    return
  }
  for (const chain in globalConfig.networks) {
    for (const url of globalConfig.networks[chain].rpcUrls) {
      if (new URL(providerUrl).host === new URL(url).host) {
        return chain
      }
    }
  }
}

export const getRpcProviderFromUrl = (
  rpcUrls: string | string[]
): providers.Provider => {
  const _providers: providers.StaticJsonRpcProvider[] = []
  if (!Array.isArray(rpcUrls)) {
    rpcUrls = [rpcUrls]
  }
  for (const rpcUrl of rpcUrls) {
    const provider = new providers.StaticJsonRpcProvider(rpcUrl)
    if (rpcUrls.length === 1) {
      return provider
    }
    _providers.push(provider)
  }
  const fallbackProvider = new providers.FallbackProvider(_providers, 1)
  return fallbackProvider
}

export const chainSlugToId = (network: string): number | undefined => {
  return (
    globalConfig.networks[network]?.networkId || globalConfig.networks[network]?.chainId
  )
}

export const chainIdToSlug = (chainId: string | number): string | undefined => {
  if (!globalConfig.networks) {
    throw new Error('networks not found')
  }
  for (const k in globalConfig.networks) {
    const v = globalConfig.networks[k]
    if (!v) {
      continue
    }
    if (
      v?.networkId?.toString() === chainId.toString() ||
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

export const xor = (a: number, b: number) => {
  return (a || b) && !(a && b)
}

export const getTransferRootId = (rootHash: string, totalAmount: BigNumber) => {
  return utils.solidityKeccak256(
    ['bytes32', 'uint256'],
    [rootHash, totalAmount]
  )
}

export const getBumpedGasPrice = (gasPrice: BigNumber, multiplier: number) => {
  return gasPrice.mul(BigNumber.from(multiplier * 100)).div(BigNumber.from(100))
}
