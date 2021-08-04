import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import { erc20Abi, erc20MintableAbi } from '@hop-protocol/core/abi'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'
import Token from 'src/models/Token'

import useGovernanceContracts, {
  GovernanceContracts
} from 'src/contexts/AppContext/useGovernanceContracts'
import useL1BridgeContract from 'src/contexts/AppContext/useL1BridgeContract'
import useNetworkSpecificContracts from 'src/contexts/AppContext/useNetworkSpecificContracts'

type ABI = any
type Provider = providers.Provider | Signer | undefined
export type Contracts = {
  governance: GovernanceContracts
  tokens: TokenContracts
  providers: {
    [key: string]: Provider
  }
  getContract: (
    address: string,
    abi: ABI[],
    provider: Provider
  ) => Contract | undefined
  getErc20Contract: (address: string, provider: Provider) => Contract
}

type TokenContracts = {
  [key: string]: {
    [key: string]: {
      [key: string]: Contract
    }
  }
}

const useContracts = (networks: Network[], tokens: Token[]): Contracts => {
  // logger.debug('useContracts render')
  const { provider, connectedNetworkId } = useWeb3Context()

  const getContract = (
    address: string,
    abi: ABI[],
    provider: Provider
  ): Contract | undefined => {
    if (!provider) return
    return new Contract(address, abi, provider as providers.Provider)
  }

  const getErc20Contract = (address: string, provider: Provider): Contract => {
    return getContract(address, erc20MintableAbi, provider) as Contract
  }

  const l1Network = useMemo(() => {
    return networks.find((network: Network) => network.isLayer1)
  }, [networks]) as Network

  const providers = useMemo(() => {
    return networks.reduce((obj, network) => {
      obj[network.slug] = network.provider
      if (connectedNetworkId === network?.networkId) {
        obj[network.slug] = provider?.getSigner()
      }

      return obj
    }, {} as { [key: string]: Provider })
  }, [networks, connectedNetworkId, provider])

  const tokenContracts = tokens.reduce((obj, token) => {
    obj[token.symbol] = networks.reduce((networkMap, network) => {
      if (!addresses.tokens[token.symbol]) {
        return obj
      }
      const tokenConfig = addresses.tokens[token.symbol][network.slug]
      if (!tokenConfig) {
        return obj
      }
      if (network.isLayer1) {
        networkMap[network.slug] = {
          l1CanonicalToken: new Contract(
            tokenConfig.l1CanonicalToken,
            erc20MintableAbi,
            providers[network.slug] as providers.Provider
          ),
          l1Bridge: useL1BridgeContract(
            providers[network.slug] as providers.Provider,
            token
          )
        }
      } else if (tokenConfig) {
        networkMap[network.slug] = useNetworkSpecificContracts(
          l1Network,
          network,
          token
        )
      }
      return networkMap
    }, {} as { [key: string]: { [key: string]: any } })
    return obj
  }, {} as TokenContracts)
  const governanceContracts = useGovernanceContracts(networks)

  return {
    governance: governanceContracts,
    tokens: tokenContracts,
    providers,
    getContract,
    getErc20Contract
  }
}

export default useContracts
