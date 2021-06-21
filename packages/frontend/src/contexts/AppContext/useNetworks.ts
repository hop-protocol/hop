import { useMemo } from 'react'
import Network from 'src/models/Network'
import { network, networks, metadata } from 'src/config'

const useNetworks = () => {
  // logger.debug('useNetworks render')
  return useMemo<Network[]>(() => {
    const nets: Network[] = []
    for (const key in networks) {
      const net = networks[key]
      let meta = metadata.networks[key]
      if (key === 'ethereum') {
        meta = metadata.networks[network]
      }
      nets.push(
        new Network({
          name: meta.name,
          slug: key,
          imageUrl: meta.image,
          rpcUrl: net.rpcUrls[0],
          networkId: net.networkId,
          nativeTokenSymbol: meta.nativeTokenSymbol,
          requiresGas: meta.requiresGas,
          isLayer1: meta.isLayer1,
          nativeBridgeUrl: net.nativeBridgeUrl
        })
      )
    }
    return nets
  }, [])
}

export default useNetworks
