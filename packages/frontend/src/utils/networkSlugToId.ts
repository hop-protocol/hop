import { networks } from 'src/config'

const networkSlugToId = (network: string) => {
  return networks[network]?.networkId
}

export default networkSlugToId
