import { useMemo } from 'react'

import {
  OFFCHAIN_LABS_LOGO_URL as offchainLabsLogoUrl,
  MAINNET_LOGO_URL as mainnetLogoUrl
} from 'src/config/constants'
import {
  l1NetworkId,
  l1RpcUrl,
  arbitrumNetworkId,
  arbitrumRpcUrl
} from 'src/config'
import Network from 'src/models/Network'

const useNetworks = () => {
  const networks = useMemo<Network[]>(
    () => [
      new Network({
        name: 'Kovan',
        slug: 'kovan',
        imageUrl: mainnetLogoUrl,
        rpcUrl: l1RpcUrl,
        isLayer1: true,
        networkId: l1NetworkId
      }),
      new Network({
        name: 'Arbitrum',
        slug: 'arbitrum',
        imageUrl: offchainLabsLogoUrl,
        rpcUrl: arbitrumRpcUrl,
        networkId: arbitrumNetworkId
      })
      // new Network({
      //   name: 'Optimism',
      //   slug: 'optimism',
      //   imageUrl: optimismLogoUrl,
      //   rpcUrl: optimismRpcUrl,
      //   networkId: optimismNetworkId
      // })
    ],
    []
  )

  return networks
}

export default useNetworks
