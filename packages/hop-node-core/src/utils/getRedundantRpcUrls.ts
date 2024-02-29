import { config as globalConfig } from '#config/index.js'

export const getRedundantRpcUrls = (network: string): string[] => {
  return globalConfig.networks[network]?.redundantRpcUrls ?? []
}
