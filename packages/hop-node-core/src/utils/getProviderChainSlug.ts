import { Chain } from 'src/constants/index.js'
import { URL } from 'node:url'
import { config as globalConfig } from 'src/config/index.js'

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
    const providerUrlObj = new URL(providerUrl)
    const configUrlObj = new URL(url)
    if (providerUrlObj.host === configUrlObj.host && providerUrlObj.pathname === configUrlObj.pathname) {
      cache[providerUrl] = chain
      return chain as Chain
    }
  }
}

export default getProviderChainSlug
