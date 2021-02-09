import { ARBITRUM, OPTIMISM, ARBITRUM_MESSENGER_ID } from 'src/config/constants'
import { arbitrumNetworkId, optimismNetworkId } from 'src/config'

const contractNetworkSlugToChainId = (slug: string) => {
  switch (slug) {
    case ARBITRUM:
      return ARBITRUM_MESSENGER_ID
    case OPTIMISM:
      return optimismNetworkId
  }
}

export default contractNetworkSlugToChainId
