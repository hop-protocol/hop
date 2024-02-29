import { config as globalConfig } from '#config/index.js'

export const chainSlugToId = (network: string): number => {
  const chainId = globalConfig.networks[network]?.networkId ?? globalConfig.networks[network]?.chainId
  if (!chainId) {
    throw new Error(`chain ID for ${network} not found`)
  }
  return chainId
}
