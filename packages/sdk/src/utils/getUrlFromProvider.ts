import type { providers } from 'ethers'

type Provider = providers.Provider & {
  connection?: {
    url: string
  }
  providers?: Provider[]
}

export function getUrlFromProvider (providerOrUrl: Provider | string): string {
  if (typeof providerOrUrl === 'string') {
    return providerOrUrl
  }

  const rpcUrl = providerOrUrl?.connection?.url ?? providerOrUrl.providers?.[0]?.connection?.url ?? ''
  return rpcUrl
}
