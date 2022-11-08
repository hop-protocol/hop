import { Provider } from '../provider'
import { providers } from 'ethers'
import { rpcTimeoutSeconds } from '../config'

export function getProviderFromUrl (rpcUrl: string): providers.Provider {
  const timeoutMs = rpcTimeoutSeconds * 1000
  const provider = new Provider({
    url: rpcUrl,
    timeout: timeoutMs,
    throttleLimit: 1
  })

  return provider
}
