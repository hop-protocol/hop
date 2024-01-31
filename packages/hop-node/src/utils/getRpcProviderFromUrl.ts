import { ConnectionInfo } from "@ethersproject/web"
import { Provider } from '../provider'
import { providers } from 'ethers'

const cache: any = {}

const getRpcProviderFromUrl = (
  rpcUrl: string
): providers.Provider => {
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
