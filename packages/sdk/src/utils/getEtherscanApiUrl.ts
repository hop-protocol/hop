import { config } from '../config'

export function getEtherscanApiUrl (network: string, chain: string): string {
  const url = config[network]?.chains?.[chain]?.etherscanApiUrl
  if (!url) {
    throw new Error(`etherscan API url not found for chain ${chain}`)
  }

  return url
}
