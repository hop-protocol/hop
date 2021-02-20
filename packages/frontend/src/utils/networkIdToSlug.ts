import { KOVAN, ARBITRUM, OPTIMISM, XDAI } from 'src/config/constants'
import {
  l1NetworkId,
  arbitrumNetworkId,
  optimismNetworkId,
  xDaiNetworkId
} from 'src/config'

export const networkIdToSlug: { [key: string]: string } = {
  [l1NetworkId]: KOVAN,
  [arbitrumNetworkId]: ARBITRUM,
  [optimismNetworkId]: OPTIMISM,
  [xDaiNetworkId]: XDAI
}

export default networkIdToSlug
