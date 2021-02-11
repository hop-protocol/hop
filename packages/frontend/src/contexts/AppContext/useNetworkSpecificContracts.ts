import { useMemo } from 'react'
import { Contract } from 'ethers'
import l2BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import l2OptimismBridgeArtifact from 'src/abi/L2OptimismBridge.json'
import l1ArbitrumMessengerArtifact from 'src/abi/GlobalInbox.json'
import l1OptimismTokenBridgeArtifact from 'src/abi/L1OptimismTokenBridge.json'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import uniswapFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Library.sol/Factory.json'
import arbErc20Artifact from 'src/abi/ArbERC20.json'
import uniswapV2PairArtifact from 'src/abi/UniswapV2Pair.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import logger from 'src/logger'

export type NetworkSpecificContracts = {
  l1CanonicalBridge: Contract | undefined
  l2CanonicalToken: Contract | undefined
  l2Bridge: Contract | undefined
  uniswapRouter: Contract | undefined
  uniswapFactory: Contract | undefined
  uniswapExchange: Contract | undefined
}

const useNetworkSpecificContracts = (
  l1Network: Network,
  l2Network: Network,
  token: Token
): NetworkSpecificContracts => {
  //logger.debug('useNetworkSpecificContracts render')
  const { provider, connectedNetworkId } = useWeb3Context()

  if (!l2Network?.slug) {
    return {
      l1CanonicalBridge: undefined,
      l2CanonicalToken: undefined,
      l2Bridge: undefined,
      uniswapRouter: undefined,
      uniswapFactory: undefined,
      uniswapExchange: undefined
    }
  }

  let l1CanonicalBridgeAddress: string =
    addresses.tokens[token.symbol][l2Network?.slug].l1CanonicalBridge
  let l2CanonicalTokenAddress: string =
    addresses.tokens[token.symbol][l2Network?.slug].l2CanonicalToken
  let l2BridgeAddress: string =
    addresses.tokens[token.symbol][l2Network?.slug].l2Bridge
  let uniswapRouterAddress: string =
    addresses.tokens[token.symbol][l2Network?.slug].uniswapRouter
  let uniswapFactoryAddress: string =
    addresses.tokens[token.symbol][l2Network?.slug].uniswapFactory
  let uniswapExchangeAddress: string =
    addresses.tokens[token.symbol][l2Network?.slug].uniswapExchange

  const l2Provider = useMemo(() => {
    if (connectedNetworkId === l2Network?.networkId) {
      return provider?.getSigner()
    }

    return l2Network?.provider
  }, [l2Network, connectedNetworkId, provider])
  const l1Provider = useMemo(() => {
    if (connectedNetworkId === l1Network?.networkId) {
      return provider?.getSigner()
    }

    return l1Network?.provider
  }, [l1Network, connectedNetworkId, provider])

  const l1CanonicalBridge = useMemo(() => {
    // Optimism Canonical Bridge is different than Arbitrum's Canonical Bridge contract
    if (
      l1CanonicalBridgeAddress ===
      addresses.tokens[token.symbol]?.optimism?.l1CanonicalBridge
    ) {
      return new Contract(
        l1CanonicalBridgeAddress,
        l1OptimismTokenBridgeArtifact.abi,
        l1Provider
      )
    }

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
    if (
      l2BridgeAddress === addresses.tokens[token.symbol]?.optimism?.l2Bridge
    ) {
      // Optimism L2 Bridge's ABI differs from Arbitrum's L2 Bridge ABI (contains indexed logs)
      return new Contract(
        l2BridgeAddress,
        l2OptimismBridgeArtifact.abi,
        l2Provider
      )
    }

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

  const uniswapExchange = useMemo(() => {
    return new Contract(
      uniswapExchangeAddress,
      uniswapV2PairArtifact.abi,
      l2Provider
    )
  }, [l2Provider])

  return {
    l1CanonicalBridge,
    l2CanonicalToken,
    l2Bridge,
    uniswapRouter,
    uniswapFactory,
    uniswapExchange
  }
}

export default useNetworkSpecificContracts
