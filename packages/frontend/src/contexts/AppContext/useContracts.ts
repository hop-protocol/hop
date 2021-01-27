import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import erc20Artifact from 'src/abi/ERC20.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'

import useGovernanceContracts, {
  GovernanceContracts
} from 'src/contexts/AppContext/useGovernanceContracts'
import useL1BridgeContract from 'src/contexts/AppContext/useL1BridgeContract'
import useNetworkSpecificContracts, {
  NetworkSpecificContracts
} from 'src/contexts/AppContext/useNetworkSpecificContracts'

export type Contracts = {
  l1Token: Contract | undefined
  l1Bridge: Contract | undefined
  governance: GovernanceContracts
  networks: {
    [key: string]: NetworkSpecificContracts
  }
  arbitrumProvider: providers.Provider | providers.JsonRpcSigner | undefined
  optimismProvider: providers.Provider | providers.JsonRpcSigner | undefined
  getContract: (
    address: string,
    abi: any[],
    provider: any
  ) => Contract | undefined
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

  const l2Network = useMemo(() => {
    return networks.find((network: Network) => network.slug === 'arbitrum')
  }, [networks]) as Network

  const arbitrumProvider = useMemo(() => {
    if (connectedNetworkId === l2Network?.networkId) {
      return provider?.getSigner()
    }

    return l2Network?.provider
  }, [l2Network, connectedNetworkId, provider])

  const l1Network = useMemo(() => {
    return networks.find((network: Network) => network.slug === 'kovan')
  }, [networks]) as Network

  const l1Provider = useMemo(() => {
    if (connectedNetworkId === l1Network?.networkId) {
      return provider?.getSigner()
    }

    return l1Network?.provider
  }, [l1Network, connectedNetworkId, provider])

  const l1Token = useMemo(() => {
    return new Contract(addresses.l1Token, erc20Artifact.abi, l1Provider)
  }, [l1Provider])

  const governanceContracts = useGovernanceContracts(networks)

  const l1Bridge = useL1BridgeContract(networks)

  const arbitrumContracts = useNetworkSpecificContracts(l1Network, l2Network)

  const l2NetworkOptimism = useMemo(() => {
    return networks.find((network: Network) => network.slug === 'optimism')
  }, [networks]) as Network

  const optimismProvider = useMemo(() => {
    if (connectedNetworkId === l2NetworkOptimism?.networkId) {
      return provider?.getSigner()
    }

    return l2NetworkOptimism?.provider
  }, [l2NetworkOptimism, connectedNetworkId, provider])

  const optimismContracts = useNetworkSpecificContracts(
    l1Network,
    l2NetworkOptimism
  )

  return {
    l1Token,
    l1Bridge,
    governance: governanceContracts,
    networks: {
      arbitrum: arbitrumContracts,
      optimism: optimismContracts
    },
    arbitrumProvider,
    optimismProvider,
    getContract,
    getErc20Contract
  }
}

export default useContracts
