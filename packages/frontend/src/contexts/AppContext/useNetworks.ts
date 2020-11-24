import { useMemo } from 'react'

import { OFFCHAIN_LABS_LOGO_URL as offchainLabsLogoUrl } from '../../config/constants'
// import { OPTIMISM_LOGO_URL as optimismLogoUrl } from '../../config/constants'
import { MAINNET_LOGO_URL as mainnetLogoUrl } from '../../config/constants'
import Network from '../../models/Network'

const useNetworks = () => {
  const networks = useMemo<Network[]>(() => [
    new Network({
      name: 'kovan',
      imageUrl: mainnetLogoUrl,
      rpcUrl: 'https://kovan.rpc.authereum.com'
    }),
    new Network({
      name: 'arbitrum',
      imageUrl: offchainLabsLogoUrl,
      rpcUrl: 'https://kovan2.arbitrum.io/rpc'
    })
    // new Network({
    //   name: 'optimism',
    //   imageUrl: optimismLogoUrl,
    //   rpcUrl: ''
    // })
  ], [])

  return networks
}

export default useNetworks
