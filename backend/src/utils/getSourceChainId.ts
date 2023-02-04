import { isGoerli } from '../config'

// TODO: move to config
export function getSourceChainId (chain: string) {
  if (chain === 'ethereum') {
    if (isGoerli) {
      return 5
    }
    return 1
  }
  if (chain === 'gnosis') {
    return 100
  }
  if (chain === 'polygon') {
    if (isGoerli) {
      return 80001
    }
    return 137
  }
  if (chain === 'optimism') {
    if (isGoerli) {
      return 420
    }
    return 10
  }
  if (chain === 'arbitrum') {
    if (isGoerli) {
      return 421613
    }
    return 42161
  }
  if (chain === 'nova') {
    return 42170
  }
  throw new Error(`unsupported chain "${chain}"`)
}
