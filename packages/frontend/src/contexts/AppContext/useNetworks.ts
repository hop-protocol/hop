import { useMemo } from 'react'
import MainnetLogo from 'src/assets/logos/mainnet.svg'
import ArbitrumLogo from 'src/assets/logos/arbitrum.svg'
import OptimismLogo from 'src/assets/logos/optimism.svg'
import {
  l1NetworkId,
  l1RpcUrl,
  arbitrumNetworkId,
  arbitrumRpcUrl,
  optimismNetworkId,
  optimismRpcUrl
} from 'src/config'
import Network from 'src/models/Network'
import logger from 'src/logger'

const useNetworks = () => {
  //logger.debug('useNetworks render')
  const networks = useMemo<Network[]>(
    () => [
      new Network({
        name: 'Kovan',
        slug: 'kovan',
        imageUrl: MainnetLogo,
        rpcUrl: l1RpcUrl,
        isLayer1: true,
        networkId: l1NetworkId
      }),
      new Network({
        name: 'Arbitrum',
        slug: 'arbitrum',
        imageUrl: ArbitrumLogo,
        rpcUrl: arbitrumRpcUrl,
        networkId: arbitrumNetworkId
      }),
      new Network({
        name: 'Optimism',
        slug: 'optimism',
        imageUrl: OptimismLogo,
        rpcUrl: optimismRpcUrl,
        networkId: optimismNetworkId
      })
    ],
    []
  )

  return networks
}

export default useNetworks
