import { Chain } from 'src/constants'
import { config as globalConfig } from 'src/config'

const getProviderChainSlug = (provider: any): Chain | undefined => {
  const providerUrl = provider?.connection?.url || provider?.providerConfigs?.[0]?.provider?.connection?.url
  if (!providerUrl) {
    return
  }
  for (const chain in globalConfig.networks) {
    for (const url of globalConfig.networks[chain].rpcUrls) {
      if (new URL(providerUrl).host === new URL(url).host) {
        return chain as Chain
      }
    }
  }
}

export default getProviderChainSlug
