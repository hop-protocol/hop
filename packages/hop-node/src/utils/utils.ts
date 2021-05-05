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

export const getRpcUrl = (network: string): string | undefined => {
  return config.networks[network]?.rpcUrl
}

export const networkSlugToId = (network: string): string | undefined => {
  return config.networks[network]?.networkId
}

export const networkIdToSlug = (
  networkId: string | number
): string | undefined => {
  for (let k in config.networks) {
    let v = config.networks[k].networkId
    if (v == networkId) {
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

export const isL1NetworkId = (networkId: number | string) => {
  networkId = networkId.toString()
  return networkId === '42' || networkId === '5' || networkId === '1'
}
