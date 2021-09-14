import { config as globalConfig } from 'src/config'

const chainSlugToId = (network: string): number | undefined => {
  return (
    globalConfig.networks[network]?.networkId || globalConfig.networks[network]?.chainId
  )
}

export default chainSlugToId
