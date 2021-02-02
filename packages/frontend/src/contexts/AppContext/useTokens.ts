import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import erc20Artifact from 'src/abi/ERC20.json'

import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { addresses } from 'src/config'

const useTokens = (networks: Network[]) => {
  const getErc20Contract = (
    address: string,
    provider: Signer | providers.Provider
  ): Contract => {
    return new Contract(address, erc20Artifact.abi, provider) as Contract
  }

  const l1Hop = useMemo(() => {
    const network = networks.find(network => network.slug === 'kovan')
    if (!network) throw new Error('Kovan network not found')
    return getErc20Contract(addresses.l1Token, network.provider)
  }, [networks, getErc20Contract])

  const l1Dai = useMemo(() => {
    const network = networks.find(network => network.slug === 'kovan')
    if (!network) throw new Error('Kovan network not found')
    return getErc20Contract(addresses.l1Token, network.provider)
  }, [networks, getErc20Contract])

  const arbitrumDai = useMemo(() => {
    const network = networks.find(network => network.slug === 'arbitrum')
    if (!network) throw new Error('Arbitrum network not found')
    return getErc20Contract(
      addresses.networks.arbitrum.l2CanonicalToken,
      network.provider
    )
  }, [networks, getErc20Contract])

  const arbitrumBridgeDai = useMemo(() => {
    const network = networks.find(network => network.slug === 'arbitrum')
    if (!network) throw new Error('Arbitrum network not found')
    return getErc20Contract(
      addresses.networks.arbitrum.l2Bridge,
      network.provider
    )
  }, [networks, getErc20Contract])

  const optimismDai = useMemo(() => {
    const network = networks.find(network => network.slug === 'optimism')
    if (!network) throw new Error('Optimism network not found')
    return getErc20Contract(
      addresses.networks.optimism.l2CanonicalToken,
      network.provider
    )
  }, [networks, getErc20Contract])

  const optimismBridgeDai = useMemo(() => {
    const network = networks.find(network => network.slug === 'optimism')
    if (!network) throw new Error('Optimism network not found')
    return getErc20Contract(
      addresses.networks.optimism.l2Bridge,
      network.provider
    )
  }, [networks, getErc20Contract])

  const tokens = useMemo<Token[]>(() => {
    return [
      // new Token({
      //   symbol: 'ETH',
      //   tokenName: 'Ether',
      //   contracts: {},
      // }),
      new Token({
        symbol: 'DAI',
        tokenName: 'DAI Stablecoin',
        contracts: {
          kovan: l1Dai,
          arbitrum: arbitrumDai,
          arbitrumHopBridge: arbitrumBridgeDai,
          optimism: optimismDai,
          optimismHopBridge: optimismBridgeDai
        }
      }),
      new Token({
        symbol: 'HOP',
        tokenName: 'Hop',
        contracts: {
          kovan: l1Hop
        }
      })
    ]
  }, [
    l1Dai,
    l1Hop,
    optimismDai,
    arbitrumDai,
    arbitrumBridgeDai,
    optimismBridgeDai
  ])

  return tokens
}

export default useTokens
