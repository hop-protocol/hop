import { networks } from 'src/config'

export const networkSlugToId = (network: string) => {
  return networks[network]?.networkId
}
