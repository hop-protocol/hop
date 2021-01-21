import * as ethers from 'ethers'
import debounce from 'debounce-promise'
import pThrottle from 'p-throttle'

export const getL2MessengerId = (L2Name: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L2Name))
}

export { debounce }
export const throttle = (fn: any, interval) => {
  const t = pThrottle({ limit: 1, interval })
  return t(fn)
}
