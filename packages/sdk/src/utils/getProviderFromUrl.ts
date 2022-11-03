import { providers } from 'ethers'

export function getProviderFromUrl (rpcUrl: string): providers.Provider {
  const timeoutMs = 2 * 60 * 1000
  const provider = new providers.StaticJsonRpcProvider({
    url: rpcUrl,
    timeout: timeoutMs,
    throttleLimit: 1
  })

  return provider
}
