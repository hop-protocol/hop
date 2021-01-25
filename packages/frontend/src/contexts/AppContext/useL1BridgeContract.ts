import { useMemo } from 'react'
import { Contract } from 'ethers'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'

const useL1BridgeContracts = (networks: Network[]): Contract | undefined => {
  const { provider, connectedNetworkId } = useWeb3Context()

  const kovanProvider = useMemo(() => {
    const kovanNetwork = networks.find(
      (network: Network) => network.slug === 'kovan'
    )
    if (connectedNetworkId === kovanNetwork?.networkId) {
      return provider?.getSigner()
    }

    return kovanNetwork?.provider
  }, [networks, connectedNetworkId, provider])

  const l1Bridge = useMemo(() => {
    return new Contract(addresses.l1Bridge, l1BridgeArtifact.abi, kovanProvider)
  }, [kovanProvider])

  return l1Bridge
}

export default useL1BridgeContracts
