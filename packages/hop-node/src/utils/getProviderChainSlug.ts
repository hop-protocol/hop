import { URL } from 'node:url'
import { config as globalConfig } from '#config/index.js'
import type { ChainSlug } from '@hop-protocol/sdk'

const cache: Record<string, any> = {}

export const getProviderChainSlug = (provider: any): ChainSlug | undefined => {
  const providerUrl = provider?.connection?.url || provider?.providerConfigs?.[0]?.provider?.connection?.url
  if (!providerUrl) {
    return
  }
  if (cache[providerUrl]) {
    return cache[providerUrl]
  }
  for (const chain in globalConfig.networks) {
    const url = (globalConfig as any).networks[chain].rpcUrl
    const providerUrlObj = new URL(providerUrl)
    const configUrlObj = new URL(url)
    if (providerUrlObj.host === configUrlObj.host && providerUrlObj.pathname === configUrlObj.pathname) {
      cache[providerUrl] = chain
      return chain as ChainSlug
    }
  }
}
