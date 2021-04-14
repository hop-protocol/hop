import { useMemo } from 'react'
import Network from 'src/models/Network'
import { networks, metadata } from 'src/config'

const useNetworks = () => {
  //logger.debug('useNetworks render')
  return useMemo<Network[]>(() => {
    const nets: Network[] = []
    for (let key in networks) {
      const net = networks[key]
      const meta = metadata.networks[key]
      nets.push(
        new Network({
          name: meta.name,
          slug: key,
          imageUrl: meta.image,
          rpcUrl: net.rpcUrl,
          networkId: net.networkId,
          isLayer1: meta.isLayer1
        })
      )
    }
    return nets
  }, [])
}

export default useNetworks
