import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import erc20Artifact from 'src/abi/ERC20.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'

import useGovernanceContracts, { GovernanceContracts } from 'src/contexts/AppContext/useGovernanceContracts'
import useL1BridgeContract from 'src/contexts/AppContext/useL1BridgeContract'
import useNetworkSpecificContracts, { NetworkSpecificContracts } from 'src/contexts/AppContext/useNetworkSpecificContracts'

export type Contracts = {
  l1Token: Contract | undefined
  l1Bridge: Contract | undefined
  governance: GovernanceContracts
  networks: {
    [key: string]: NetworkSpecificContracts
  }
  arbitrumProvider: providers.Provider | providers.JsonRpcSigner | undefined
  getContract: (address: string, abi: any[], provider: any) => Contract | undefined
  getErc20Contract: (address: string, provider: any) => Contract
}

const useContracts = (networks: Network[]): Contracts => {
  const { provider, connectedNetworkId } = useWeb3Context()

  const getContract = (
    address: string,
    abi: any[],
    provider: Signer | providers.Provider | undefined
  ): Contract | undefined => {
    if (!provider) return
    return new Contract(address, abi, provider)
  }

  const getErc20Contract = (
    address: string,
    provider: Signer | providers.Provider
  ): Contract => {
    return getContract(address, erc20Artifact.abi, provider) as Contract
  }

  const arbitrumProvider = useMemo(() => {
    const arbitrumNetwork = networks.find(
      (network: Network) => network.slug === 'arbitrum'
    )
    if (connectedNetworkId === arbitrumNetwork?.networkId) {
      return provider?.getSigner()
    }

    return arbitrumNetwork?.provider
  }, [networks, connectedNetworkId, provider])
  const kovanProvider = useMemo(() => {
    const kovanNetwork = networks.find(
      (network: Network) => network.slug === 'kovan'
    )
    if (connectedNetworkId === kovanNetwork?.networkId) {
      return provider?.getSigner()
    }

    return kovanNetwork?.provider
  }, [networks, connectedNetworkId, provider])

  const l1Token = useMemo(() => {
    return new Contract(addresses.l1Dai, erc20Artifact.abi, kovanProvider)
  }, [kovanProvider])

  const governanceContracts = useGovernanceContracts(networks)

  const l1Bridge = useL1BridgeContract(networks)

  const arbitrumContracts = useNetworkSpecificContracts(networks)

  return {
    l1Token,
    l1Bridge,
    governance: governanceContracts,
    networks: {
      arbitrum: arbitrumContracts
    },
    arbitrumProvider,
    getContract,
    getErc20Contract
  }
}

export default useContracts
