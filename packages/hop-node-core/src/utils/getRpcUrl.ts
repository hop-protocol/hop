import { config as globalConfig } from 'src/config/index.js'

const getRpcUrl = (network: string): string => {
  const url = globalConfig.networks[network]?.rpcUrl
  if (!url) {
    throw new Error(`getRpcUrl: rpc url not found for network ${network}`)
  }
  return url
}

export default getRpcUrl
