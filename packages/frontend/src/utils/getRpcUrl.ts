import { networks } from 'src/config'

export const getRpcUrl = (network: string) => {
  return networks[network]?.rpcUrl
}

export default getRpcUrl
