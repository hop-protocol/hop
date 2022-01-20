import { useMemo } from 'react'
import { Contract } from 'ethers'
import {
  ArbERC20__factory,
  ArbitrumGlobalInbox__factory,
  HopBridgeToken__factory,
  HopBridgeToken,
  L1Bridge__factory,
  L1Bridge,
  L1OptimismTokenBridge__factory,
  L1XDaiForeignOmniBridge__factory,
  L2Bridge__factory,
  L2Bridge,
  L2OptimismTokenBridge__factory,
  L2XDaiToken__factory,
} from '@hop-protocol/core/contracts'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'
import Token from 'src/models/Token'

export type NetworkSpecificContracts = {
  l1Bridge: L1Bridge | undefined
  l1CanonicalBridge: Contract | undefined
  l2CanonicalBridge: Contract | undefined
  l2CanonicalToken: Contract | undefined
  l2Bridge: L2Bridge | undefined
  l2HopBridgeToken: HopBridgeToken | undefined
}

const useNetworkSpecificContracts = (
  l1Network: Network,
  l2Network: Network,
  token: Token
): NetworkSpecificContracts => {
  // logger.debug('useNetworkSpecificContracts render')
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
    if (connectedNetworkId === l2Network?.networkId && provider) {
      return provider.getSigner()
    }

    return l2Network.provider
  }, [l2Network, connectedNetworkId, provider])
  const l1Provider = useMemo(() => {
    if (connectedNetworkId === l1Network.networkId && provider) {
      return provider.getSigner()
    }

    return l1Network.provider
  }, [l1Network, connectedNetworkId, provider])
  const l1Bridge = useMemo(() => {
    if (!l1BridgeAddress || !l1Provider) {
      return undefined
    }

    return L1Bridge__factory.connect(l1BridgeAddress, l1Provider)
  }, [l1Provider])
  const l1CanonicalBridge = useMemo(() => {
    if (l1CanonicalBridgeAddress === addresses.tokens[token.symbol]?.optimism?.l1CanonicalBridge) {
      return L1OptimismTokenBridge__factory.connect(l1CanonicalBridgeAddress, l1Provider)
    }

    if (l1CanonicalBridgeAddress === addresses.tokens[token.symbol]?.gnosis?.l1CanonicalBridge) {
      return L1XDaiForeignOmniBridge__factory.connect(l1CanonicalBridgeAddress, l1Provider)
    }

    if (l1CanonicalBridgeAddress === addresses.tokens[token.symbol]?.arbitrum?.l1CanonicalBridge) {
      return ArbitrumGlobalInbox__factory.connect(l1CanonicalBridgeAddress, l1Provider)
    }
  }, [l1Provider])
  const l2CanonicalBridge = useMemo(() => {
    if (l2CanonicalBridgeAddress === addresses.tokens[token.symbol]?.optimism?.l2CanonicalBridge) {
      return L2OptimismTokenBridge__factory.connect(l2CanonicalBridgeAddress, l2Provider)
    }
    if (l2CanonicalBridgeAddress === addresses.tokens[token.symbol]?.gnosis?.l2CanonicalBridge) {
      return L1XDaiForeignOmniBridge__factory.connect(l2CanonicalBridgeAddress, l2Provider)
    }
  }, [l2Provider])
  const l2CanonicalToken = useMemo(() => {
    if (l2CanonicalTokenAddress === addresses.tokens[token.symbol]?.gnosis?.l2CanonicalToken) {
      return L2XDaiToken__factory.connect(l2CanonicalTokenAddress, l2Provider)
    }

    return ArbERC20__factory.connect(l2CanonicalTokenAddress, l2Provider)
  }, [l2Provider])
  const l2Bridge = useMemo(() => {
    return L2Bridge__factory.connect(l2BridgeAddress, l2Provider)
  }, [l2Provider])
  const l2HopBridgeToken = useMemo(() => {
    return HopBridgeToken__factory.connect(l2HopBridgeTokenAddress, l2Provider)
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
