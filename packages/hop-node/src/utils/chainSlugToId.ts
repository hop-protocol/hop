import { config as globalConfig } from 'src/config'

const chainSlugToId = (network: string): number => {
  const chainId = globalConfig.networks[network]?.networkId ?? globalConfig.networks[network]?.chainId
  if (!chainId) {
    throw new Error(`chain ID for ${network} not found`)
  }
  return chainId
}

export default chainSlugToId
