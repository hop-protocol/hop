import { config as globalConfig } from '#config/index.js'

export const getRpcUrl = (network: string): string => {
  const url = (globalConfig as any).networks[network]?.rpcUrl
  if (!url) {
    throw new Error(`getRpcUrl: rpc url not found for network ${network}`)
  }
  return url
}
