import { useMemo } from 'react'
import { Contract } from 'ethers'
import l2BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import l1ArbitrumMessengerArtifact from 'src/abi/GlobalInbox.json'
import l1OptimismTokenBridgeArtifact from 'src/abi/L1OptimismTokenBridge.json'
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

const useNetworkSpecificContracts = (
  l1Network: Network,
  l2Network: Network
): NetworkSpecificContracts => {
  const { provider, connectedNetworkId } = useWeb3Context()

  if (!l2Network?.slug) {
    return {
      l1CanonicalBridge: undefined,
      l2CanonicalToken: undefined,
      l2Bridge: undefined,
      uniswapRouter: undefined,
      uniswapFactory: undefined
    }
  }

  let l1CanonicalBridgeAddress: string =
    addresses.networks[l2Network?.slug].l1CanonicalBridge
  let l2CanonicalTokenAddress: string =
    addresses.networks[l2Network?.slug].l2CanonicalToken
  let l2BridgeAddress: string = addresses.networks[l2Network?.slug].l2Bridge
  let uniswapRouterAddress: string =
    addresses.networks[l2Network?.slug].uniswapRouter
  let uniswapFactoryAddress: string =
    addresses.networks[l2Network?.slug].uniswapFactory

  const l2Provider = useMemo(() => {
    console.log('connectedNetworkId: ', connectedNetworkId)
    console.log('l2Network?.networkId: ', l2Network?.networkId)
    if (connectedNetworkId === l2Network?.networkId) {
      return provider?.getSigner()
    }

    return l2Network?.provider
  }, [l2Network, connectedNetworkId, provider])
  console.log('l2Provider: ', l2Provider)
  const l1Provider = useMemo(() => {
    if (connectedNetworkId === l1Network?.networkId) {
      return provider?.getSigner()
    }

    return l1Network?.provider
  }, [l1Network, connectedNetworkId, provider])

  const l1CanonicalBridge = useMemo(() => {
    return new Contract(
      l1CanonicalBridgeAddress,
      l1ArbitrumMessengerArtifact.abi,
      l1Provider
    )
  }, [l1Provider])

  const l2CanonicalToken = useMemo(() => {
    return new Contract(
      l2CanonicalTokenAddress,
      arbErc20Artifact.abi,
      l2Provider
    )
  }, [l2Provider])

  const l2Bridge = useMemo(() => {
    return new Contract(l2BridgeAddress, l2BridgeArtifact.abi, l2Provider)
  }, [l2Provider])

  const uniswapRouter = useMemo(() => {
    return new Contract(
      uniswapRouterAddress,
      uniswapRouterArtifact.abi,
      l2Provider
    )
  }, [l2Provider])

  const uniswapFactory = useMemo(() => {
    return new Contract(
      uniswapFactoryAddress,
      uniswapFactoryArtifact.abi,
      l2Provider
    )
  }, [l2Provider])

  return {
    l1CanonicalBridge,
    l2CanonicalToken,
    l2Bridge,
    uniswapRouter,
    uniswapFactory
  }
}

export default useNetworkSpecificContracts
