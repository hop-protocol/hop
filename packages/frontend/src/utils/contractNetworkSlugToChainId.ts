import { ARBITRUM, OPTIMISM, XDAI } from 'src/config/constants'
import { arbitrumNetworkId, optimismNetworkId, xDaiNetworkId } from 'src/config'

const contractNetworkSlugToChainId = (slug: string) => {
  switch (slug) {
    case ARBITRUM:
      return arbitrumNetworkId
    case OPTIMISM:
      return optimismNetworkId
    case XDAI:
      return xDaiNetworkId
  }
}

export default contractNetworkSlugToChainId
