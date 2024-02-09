import { ConnectionInfo } from 'ethers'
import { Provider } from '../provider'
import { Provider } from 'ethers'
// TODO FIX THIS

const cache: any = {}

const getRpcProviderFromUrl = (
  rpcUrl: string
): Provider => {
  const cacheKey = rpcUrl
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }
  const options: ConnectionInfo = {
    url: rpcUrl,
    timeout: 60 * 1000,
    throttleLimit: 1,
    allowGzip: true
  }
  const provider = new Provider(options)
  cache[cacheKey] = provider
  return provider
}

export default getRpcProviderFromUrl
