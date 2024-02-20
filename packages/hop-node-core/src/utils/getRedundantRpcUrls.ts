import { config as globalConfig } from 'src/config/index.js'

const getRedundantRpcUrls = (network: string): string[] => {
  return globalConfig.networks[network]?.redundantRpcUrls ?? []
}

export default getRedundantRpcUrls
