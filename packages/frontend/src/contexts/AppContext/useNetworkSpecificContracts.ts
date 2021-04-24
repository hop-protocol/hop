import { useMemo } from 'react'
import { Contract } from 'ethers'
import erc20Artifact from 'src/abi/ERC20.json'
import l1BridgeArtifact from 'src/abi/L1_Bridge.json'
import l2BridgeArtifact from 'src/abi/L2_Bridge.json'
import l2OptimismTokenBridgeArtifact from 'src/abi/L2_OptimismTokenBridge.json'
import l2xDaiTokenArtifact from 'src/abi/L2_xDaiToken.json'
import l1ArbitrumMessengerArtifact from 'src/abi/GlobalInbox.json'
import l1OptimismTokenBridgeArtifact from 'src/abi/L1_OptimismTokenBridge.json'
import l1xDaiForeignOmnibridge from 'src/abi/L1_xDaiForeignOmnibridge.json'
import arbErc20Artifact from 'src/abi/ArbERC20.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'
import Token from 'src/models/Token'

export type NetworkSpecificContracts = {
  l1Bridge: Contract | undefined
  l1CanonicalBridge: Contract | undefined
  l2CanonicalBridge: Contract | undefined
  l2CanonicalToken: Contract | undefined
  l2Bridge: Contract | undefined
  l2HopBridgeToken: Contract | undefined
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
      l1Bridge: undefined,
      l1CanonicalBridge: undefined,
      l2CanonicalBridge: undefined,
      l2CanonicalToken: undefined,
      l2Bridge: undefined,
      l2HopBridgeToken: undefined,
    }
  }

  const tokenConfig = addresses.tokens[token.symbol][l2Network?.slug]
  const l1BridgeAddress: string = tokenConfig.l1Bridge
  const l1CanonicalBridgeAddress: string = tokenConfig.l1CanonicalBridge
  const l2CanonicalBridgeAddress: string = tokenConfig.l2CanonicalBridge
  const l2CanonicalTokenAddress: string = tokenConfig.l2CanonicalToken
  const l2BridgeAddress: string = tokenConfig.l2Bridge
  const l2HopBridgeTokenAddress: string = tokenConfig.l2HopBridgeToken

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
  const l1Bridge = useMemo(() => {
    if (!l1BridgeAddress) {
      return undefined
    }

    return new Contract(l1BridgeAddress, l1BridgeArtifact.abi, l1Provider)
  }, [l1Provider])
  const l1CanonicalBridge = useMemo(() => {
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

    if (
      l1CanonicalBridgeAddress ===
      addresses.tokens[token.symbol]?.xdai?.l1CanonicalBridge
    ) {
      return new Contract(
        l1CanonicalBridgeAddress,
        l1xDaiForeignOmnibridge.abi,
        l1Provider
      )
    }

    if (
      l1CanonicalBridgeAddress ===
      addresses.tokens[token.symbol]?.arbitrum?.l1CanonicalBridge
    ) {
      return new Contract(
        l1CanonicalBridgeAddress,
        l1ArbitrumMessengerArtifact.abi,
        l1Provider
      )
    }
  }, [l1Provider])
  const l2CanonicalBridge = useMemo(() => {
    if (
      l2CanonicalBridgeAddress ===
      addresses.tokens[token.symbol]?.optimism?.l2CanonicalBridge
    ) {
      return new Contract(
        l2CanonicalBridgeAddress,
        l2OptimismTokenBridgeArtifact.abi,
        l2Provider
      )
    }
    if (
      l2CanonicalBridgeAddress ===
      addresses.tokens[token.symbol]?.xdai?.l2CanonicalBridge
    ) {
      return new Contract(
        l2CanonicalBridgeAddress,
        l1xDaiForeignOmnibridge.abi,
        l2Provider
      )
    }
  }, [l2Provider])
  const l2CanonicalToken = useMemo(() => {
    if (
      l2CanonicalTokenAddress ===
      addresses.tokens[token.symbol]?.xdai?.l2CanonicalToken
    ) {
      return new Contract(
        l2CanonicalTokenAddress,
        l2xDaiTokenArtifact.abi,
        l2Provider
      )
    }

    return new Contract(
      l2CanonicalTokenAddress,
      arbErc20Artifact.abi,
      l2Provider
    )
  }, [l2Provider])
  const l2Bridge = useMemo(() => {
    return new Contract(l2BridgeAddress, l2BridgeArtifact.abi, l2Provider)
  }, [l2Provider])
  const l2HopBridgeToken = useMemo(() => {
    return new Contract(l2HopBridgeTokenAddress, erc20Artifact.abi, l2Provider)
  }, [l2Provider])

  return {
    l1Bridge,
    l1CanonicalBridge,
    l2CanonicalBridge,
    l2CanonicalToken,
    l2Bridge,
    l2HopBridgeToken,
  }
}

export default useNetworkSpecificContracts
