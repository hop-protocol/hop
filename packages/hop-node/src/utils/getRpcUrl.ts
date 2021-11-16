import { config as globalConfig } from 'src/config'

const getRpcUrl = (network: string): string | undefined => {
  return globalConfig.networks[network]?.rpcUrl
}

export default getRpcUrl
