import { FallbackProvider, RetryProvider } from '#provider/index.js'

export function getProviderWithFallbacks (rpcUrls: string[]): any {
  const timeout = 60 * 1000
  const throttleLimit = 1
  const rpcProviders: any[] = []

  // see this discussion as to why ethers fallback provider doesn't work as expected:
  // https://github.com/ethers-io/ethers.js/discussions/3500

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
