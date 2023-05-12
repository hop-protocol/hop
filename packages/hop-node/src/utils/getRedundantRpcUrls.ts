import { config as globalConfig } from 'src/config'

const getRedundantRpcUrls = (network: string): string[] | undefined => {
  return globalConfig.networks[network]?.redundantRpcUrls
}

export default getRedundantRpcUrls
