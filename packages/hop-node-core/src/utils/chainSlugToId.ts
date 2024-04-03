import { config as globalConfig } from '#config/index.js'

export const chainSlugToId = (network: string): number => {
  const chainId = (globalConfig as any).networks[network]?.networkId ?? (globalConfig as any).networks[network]?.chainId
  if (!chainId) {
    throw new Error(`chain ID for ${network} not found`)
  }
  return chainId
}
