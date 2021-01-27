import { useMemo } from 'react'
import { parseUnits } from 'ethers/lib/utils'

import Token from 'src/models/Token'
import Network from 'src/models/Network'
import { addresses } from 'src/config'
import useContracts from 'src/contexts/AppContext/useContracts'

const useTokens = (networks: Network[]) => {
  const { getErc20Contract } = useContracts([])

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
    return getErc20Contract(addresses.networks.arbitrum.l2CanonicalToken, network.provider)
  }, [networks, getErc20Contract])

  const arbitrumBridgeDai = useMemo(() => {
    const network = networks.find(network => network.slug === 'arbitrum')
    if (!network) throw new Error('Arbitrum network not found')
    return getErc20Contract(addresses.networks.arbitrum.l2Bridge, network.provider)
  }, [networks, getErc20Contract])

  const optimismDai = useMemo(() => {
    const network = networks.find(network => network.slug === 'optimism')
    if (!network) throw new Error('Optimism network not found')
    return getErc20Contract(addresses.networks.optimism.l2CanonicalToken, network.provider)
  }, [networks, getErc20Contract])

  const optimismBridgeDai = useMemo(() => {
    const network = networks.find(network => network.slug === 'optimism')
    if (!network) throw new Error('Optimism network not found')
    return getErc20Contract(addresses.networks.optimism.l2Bridge, network.provider)
  }, [networks, getErc20Contract])

  const tokens = useMemo<Token[]>(
    () => [
      // new Token({
      //   symbol: 'ETH',
      //   tokenName: 'Ether',
      //   contracts: {},
      //   rates: {
      //     kovan: parseUnits('1', 18),
      //     arbitrum: parseUnits('0.998125000000000000', 18),
      //     optimism: parseUnits('0.977777000000000000', 18)
      //   }
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
        },
        rates: {
          kovan: parseUnits('1', 18),
          arbitrum: parseUnits('0.958125000000000000', 18),
          arbitrumHopBridge: parseUnits('0.958125000000000000', 18),
          optimism: parseUnits('0.967777000000000000', 18)
        }
      }),
      new Token({
        symbol: 'HOP',
        tokenName: 'Hop',
        contracts: {
          kovan: l1Hop
        },
        rates: {
          kovan: parseUnits('1', 18)
        }
      })
    ],
    [l1Dai, l1Hop, arbitrumDai, arbitrumBridgeDai]
  )

  return tokens
}

export default useTokens
