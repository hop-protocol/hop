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
        networkId: l1NetworkId,
        isLayer1: true
      }),
      new Network({
        name: 'Arbitrum',
        slug: 'arbitrum',
        imageUrl: ArbitrumLogo,
        rpcUrl: arbitrumRpcUrl,
        networkId: arbitrumNetworkId,
        isLayer1: false
      }),
      new Network({
        name: 'Optimism',
        slug: 'optimism',
        imageUrl: OptimismLogo,
        rpcUrl: optimismRpcUrl,
        networkId: optimismNetworkId,
        isLayer1: false
      })
    ],
    []
  )

  return networks
}

export default useNetworks
