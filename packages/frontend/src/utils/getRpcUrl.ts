import { networks } from 'src/config'

export const getRpcUrl = (network: string) => {
  return networks[network]?.rpcUrls[0]
}

export default getRpcUrl
