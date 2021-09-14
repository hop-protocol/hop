import { config as globalConfig } from 'src/config'

const getRpcUrls = (network: string): string | undefined => {
  return globalConfig.networks[network]?.rpcUrls.slice(0, 3) // max of 3 endpoints
}

export default getRpcUrls
