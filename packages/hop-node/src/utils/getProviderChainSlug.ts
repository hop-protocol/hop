import { Chain } from 'src/constants'
import { URL } from 'url'
import { config as globalConfig } from 'src/config'

const cache: Record<string, any> = {}

const getProviderChainSlug = (provider: any): Chain | undefined => {
  const providerUrl = provider?.connection?.url || provider?.providerConfigs?.[0]?.provider?.connection?.url
  if (!providerUrl) {
    return
  }
  if (cache[providerUrl]) {
    return cache[providerUrl]
  }
  for (const chain in globalConfig.networks) {
    const url = globalConfig.networks[chain].rpcUrl
    if (new URL(providerUrl).host === new URL(url).host) {
      cache[providerUrl] = chain
      return chain as Chain
    }
  }
}

export default getProviderChainSlug
