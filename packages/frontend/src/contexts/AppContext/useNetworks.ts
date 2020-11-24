import { useMemo } from 'react'

import { OFFCHAIN_LABS_LOGO_URL as offchainLabsLogoUrl } from 'src/config/constants'
// import { OPTIMISM_LOGO_URL as optimismLogoUrl } from 'src/config/constants'
import { MAINNET_LOGO_URL as mainnetLogoUrl } from 'src/config/constants'
import Network from 'src/models/Network'

const useNetworks = () => {
  const networks = useMemo<Network[]>(
    () => [
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
    ],
    []
  )

  return networks
}

export default useNetworks
