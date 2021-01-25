import { useMemo } from 'react'
import { Contract } from 'ethers'
import l2BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import l1ArbitrumMessengerArtifact from 'src/abi/GlobalInbox.json'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import uniswapFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Library.sol/Factory.json'
import arbErc20Artifact from 'src/abi/ArbERC20.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'

export type NetworkSpecificContracts = {
  l1CanonicalBridge: Contract | undefined
  l2CanonicalToken: Contract | undefined
  l2Bridge: Contract | undefined
  uniswapRouter: Contract | undefined
  uniswapFactory: Contract | undefined
}

const useNetworkSpecificContracts = (networks: Network[]): NetworkSpecificContracts => {
  const { provider, connectedNetworkId } = useWeb3Context()
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

  const l1CanonicalBridge = useMemo(() => {
    return new Contract(
      addresses.l1Messenger,
      l1ArbitrumMessengerArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  const l2CanonicalToken = useMemo(() => {
    return new Contract(
      addresses.arbitrumDai,
      arbErc20Artifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  const l2Bridge = useMemo(() => {
    return new Contract(
      addresses.arbitrumBridge,
      l2BridgeArtifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  const uniswapRouter = useMemo(() => {
    return new Contract(
      addresses.arbitrumUniswapRouter,
      uniswapRouterArtifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  const uniswapFactory = useMemo(() => {
    return new Contract(
      addresses.arbitrumUniswapFactory,
      uniswapFactoryArtifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  return {
    l1CanonicalBridge,
    l2CanonicalToken,
    l2Bridge,
    uniswapRouter,
    uniswapFactory
  }
}

export default useNetworkSpecificContracts
