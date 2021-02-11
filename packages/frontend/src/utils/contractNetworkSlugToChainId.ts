import { ARBITRUM, OPTIMISM } from 'src/config/constants'
import { arbitrumNetworkId, optimismNetworkId } from 'src/config'

const contractNetworkSlugToChainId = (slug: string) => {
  switch (slug) {
    case ARBITRUM:
      return arbitrumNetworkId
    case OPTIMISM:
      return optimismNetworkId
  }
}

export default contractNetworkSlugToChainId
