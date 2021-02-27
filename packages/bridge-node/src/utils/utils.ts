import * as ethers from 'ethers'
import debounce from 'debounce-promise'
import pThrottle from 'p-throttle'
import { rpcUrls, networkIds } from 'src/config'

export const getL2MessengerId = (l2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(l2Name))
}

export { debounce }
export const throttle = (fn: any, interval) => {
  const t = pThrottle({ limit: 1, interval })
  return t(fn)
}

export const wait = async (t: number) => {
  return new Promise(resolve => setTimeout(() => resolve(), t))
}

export const getRpcUrl = (network: string): string | undefined => {
  return rpcUrls[network]
}

export const networkSlugToId = (network: string): string | undefined => {
  return networkIds[network]
}

export const networkIdToSlug = (
  networkId: string | number
): string | undefined => {
  for (let k in networkIds) {
    let v = networkIds[k]
    if (v == networkId) {
      return k
    }
  }
}

export const isL1 = (network: string) => {
  return network === 'kovan'
}

export const isL2 = (network: string) => {
  return network !== 'kovan'
}
