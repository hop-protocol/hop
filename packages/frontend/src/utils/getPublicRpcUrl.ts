import { networks } from 'src/config'
import getRpcUrl from 'src/utils/getRpcUrl'

export const getPublicRpcUrl = (network: string) => {
  return networks[network].publicRpcUrl || getRpcUrl(network)
}

export default getPublicRpcUrl
