import { FallbackProvider, RetryProvider } from '../provider'
import { providers } from 'ethers'
import { rpcTimeoutSeconds } from '../config'

function getProviderWithFallbacks (rpcUrls: string[]) : any {
  const timeout = rpcTimeoutSeconds * 1000
  const throttleLimit = 1
  const stallTimeout = 2 * 1000
  const weight = 1
  const rpcProviders :any[] = []
  let priority = rpcUrls.length
  for (const url of rpcUrls) {
    const provider = new RetryProvider({
      url,
      timeout,
      throttleLimit
    })
    rpcProviders.push({
      provider,
      priority,
      weight,
      stallTimeout
    })
    priority--
  }

  const provider = new FallbackProvider(rpcProviders.map((x: any) => x.provider))
  return provider
}

export function getProviderFromUrl (rpcUrl: string | string[]): providers.Provider {
  const rpcUrls = Array.isArray(rpcUrl) ? rpcUrl : [rpcUrl]
  return getProviderWithFallbacks(rpcUrls)
}
