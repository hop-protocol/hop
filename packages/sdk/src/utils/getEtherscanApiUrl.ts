import { etherscanApiUrls } from '../config'

export function getEtherscanApiUrl (network: string, chain: string): string {
  const url = etherscanApiUrls?.[chain]
  if (!url) {
    throw new Error(`etherscan API url not found for chain ${chain}`)
  }

  return url
}
