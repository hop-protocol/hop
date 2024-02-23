import { FallbackProvider, RetryProvider } from '#provider/index.js'
import { providers } from 'ethers'
import { rpcTimeoutSeconds } from '#config/index.js'

export function getProviderWithFallbacks (rpcUrls: string[]) : any {
  const timeout = rpcTimeoutSeconds * 1000
  const throttleLimit = 1
  const rpcProviders :any[] = []

  // see this discussion as to why ethers fallback provider doesn't work as expected:
  // https://github.com/ethers-io/ethers.js/discussions/3500
  /*
  const stallTimeout = 2 * 1000
  const weight = 1
  const rpcProviders :any[] = []
  let priority = rpcUrls.length
  for (const url of rpcUrls) {
    const provider = new RetryProvider({
      url,
      timeout,
      throttleLimit,
      allowGzip: true
    })
    rpcProviders.push({
      provider,
      priority,
      weight,
      stallTimeout
    })
    priority--
  }

  const quorum = 1
  const provider = new providers.FallbackProvider(rpcProviders, quorum)
  */

  for (const url of rpcUrls) {
    const provider = () => new RetryProvider({
      url,
      timeout,
      throttleLimit,
      allowGzip: true
    })
    rpcProviders.push(provider)
  }

  const provider = new FallbackProvider(rpcProviders)
  return provider
}

export function getProviderFromUrl (rpcUrl: string | string[]): providers.Provider {
  const rpcUrls = Array.isArray(rpcUrl) ? rpcUrl : [rpcUrl]
  return getProviderWithFallbacks(rpcUrls)

  /*
  const timeout = rpcTimeoutSeconds * 1000
  const throttleLimit = 1
  const provider = new providers.StaticJsonRpcProvider({
    url: rpcUrls[0],
    timeout,
    throttleLimit,
    allowGzip: true
  })
  return provider
  */
}
