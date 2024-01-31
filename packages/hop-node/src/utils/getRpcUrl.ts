import { config as globalConfig } from 'src/config'

const getRpcUrl = (network: string): string => {
  const url = globalConfig.networks[network]?.rpcUrl
  if (!url) {
    throw new Error(`rpc url not found for network ${network}`)
  }
  return url
}

export default getRpcUrl
