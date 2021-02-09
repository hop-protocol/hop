import { l1NetworkId, arbitrumNetworkId, optimismNetworkId } from 'src/config'

export const networkIdToSlug: { [key: string]: string } = {
  [l1NetworkId]: 'kovan',
  [arbitrumNetworkId]: 'arbitrum',
  [optimismNetworkId]: 'optimism'
}

export default networkIdToSlug
