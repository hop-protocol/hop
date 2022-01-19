import { useMemo } from 'react'
import Network from 'src/models/Network'
import { network, networks, metadata } from 'src/config'

const useNetworks = () => {
  // logger.debug('useNetworks render')
  const allNetworks = useMemo<Network[]>(() => {
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
          rpcUrl: net.rpcUrl,
          networkId: net.networkId,
          nativeTokenSymbol: meta.nativeTokenSymbol,
          isLayer1: meta.isLayer1,
          nativeBridgeUrl: net.nativeBridgeUrl,
          waitConfirmations: net.waitConfirmations,
        })
      )
    }
    return nets
  }, [])

  const l2Networks = allNetworks.filter((network: Network) => !network.isLayer1)

  return {
    networks: allNetworks,
    l2Networks,
    defaultL2Network: l2Networks[2],
  }
}

export default useNetworks
