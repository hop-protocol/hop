import { useMemo } from 'react'
import { Contract } from 'ethers'
import {
  erc20Abi,
  l1BridgeAbi,
  l2BridgeAbi,
  l2OptimismTokenBridgeAbi,
  l2xDaiTokenAbi,
  arbitrumGlobalInboxAbi,
  l1OptimismTokenBridgeAbi,
  l1xDaiForeignOmniBridgeAbi,
  arbErc20Abi,
} from '@hop-protocol/core/abi'

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
    if (connectedNetworkId === l2Network?.networkId) {
      return provider?.getSigner()
    }

    return l2Network?.provider
  }, [l2Network, connectedNetworkId, provider])
  const l1Provider = useMemo(() => {
    if (connectedNetworkId === l1Network.networkId) {
      return provider?.getSigner()
    }

    return l1Network.provider
  }, [l1Network, connectedNetworkId, provider])
  const l1Bridge = useMemo(() => {
    if (!l1BridgeAddress) {
      return undefined
    }

    return new Contract(l1BridgeAddress, l1BridgeAbi, l1Provider)
  }, [l1Provider])
  const l1CanonicalBridge = useMemo(() => {
    if (l1CanonicalBridgeAddress === addresses.tokens[token.symbol]?.optimism?.l1CanonicalBridge) {
      return new Contract(l1CanonicalBridgeAddress, l1OptimismTokenBridgeAbi, l1Provider)
    }

    if (l1CanonicalBridgeAddress === addresses.tokens[token.symbol]?.gnosis?.l1CanonicalBridge) {
      return new Contract(l1CanonicalBridgeAddress, l1xDaiForeignOmniBridgeAbi, l1Provider)
    }

    if (l1CanonicalBridgeAddress === addresses.tokens[token.symbol]?.arbitrum?.l1CanonicalBridge) {
      return new Contract(l1CanonicalBridgeAddress, arbitrumGlobalInboxAbi, l1Provider)
    }
  }, [l1Provider])
  const l2CanonicalBridge = useMemo(() => {
    if (l2CanonicalBridgeAddress === addresses.tokens[token.symbol]?.optimism?.l2CanonicalBridge) {
      return new Contract(l2CanonicalBridgeAddress, l2OptimismTokenBridgeAbi, l2Provider)
    }
    if (l2CanonicalBridgeAddress === addresses.tokens[token.symbol]?.gnosis?.l2CanonicalBridge) {
      return new Contract(l2CanonicalBridgeAddress, l1xDaiForeignOmniBridgeAbi, l2Provider)
    }
  }, [l2Provider])
  const l2CanonicalToken = useMemo(() => {
    if (l2CanonicalTokenAddress === addresses.tokens[token.symbol]?.gnosis?.l2CanonicalToken) {
      return new Contract(l2CanonicalTokenAddress, l2xDaiTokenAbi, l2Provider)
    }

    return new Contract(l2CanonicalTokenAddress, arbErc20Abi, l2Provider)
  }, [l2Provider])
  const l2Bridge = useMemo(() => {
    return new Contract(l2BridgeAddress, l2BridgeAbi, l2Provider)
  }, [l2Provider])
  const l2HopBridgeToken = useMemo(() => {
    return new Contract(l2HopBridgeTokenAddress, erc20Abi, l2Provider)
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
