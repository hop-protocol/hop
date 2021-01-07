import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import erc20Artifact from '@hop-exchange/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import l1BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L1_Bridge.sol/L1_Bridge.json'
import l2BridgeArtifact from '@hop-exchange/contracts/artifacts/contracts/bridges/L2_Bridge.sol/L2_Bridge.json'
import l1ArbitrumMessengerArtifact from '@hop-exchange/contracts/artifacts/contracts/test/arbitrum/inbox/GlobalInbox.sol/GlobalInbox.json'
import arbErc20Artifact from 'src/abi/ArbERC20.json'
import uniswapRouterArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Router02.sol/UniswapV2Router02.json'
import uniswapFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/uniswap/UniswapV2Library.sol/Factory.json'
import stakingRewardsFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/distribution/StakingRewardsFactory.sol/StakingRewardsFactory.json'
import stakingRewardsArtifact from '@hop-exchange/contracts/artifacts/contracts/distribution/StakingRewardsFactory.sol/StakingRewards.json'
import hopArtifact from '@hop-exchange/contracts/artifacts/contracts/governance/Hop.sol/Hop.json'
import governorAlphaArtifact from '@hop-exchange/contracts/artifacts/contracts/governance/GovernorAlpha.sol/GovernorAlpha.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'

export type HopContracts = {
  l1Hop: Contract | undefined
  l1Dai: Contract | undefined
  l1Bridge: Contract | undefined
  arbitrumDai: Contract | undefined
  arbitrumBridge: Contract | undefined
  arbitrumL1Messenger: Contract | undefined
  arbitrumUniswapRouter: Contract | undefined
  arbitrumUniswapFactory: Contract | undefined
  stakingRewardsFactory: Contract | undefined
  stakingRewards: Contract | undefined
  governorAlpha: Contract | undefined
}

export interface Contracts extends HopContracts {
  getErc20Contract: (address: string, provider: any) => Contract
}

const useContracts = (networks: Network[]): Contracts => {
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

  const l1Hop = useMemo(() => {
    return getContract(addresses.l1Hop, hopArtifact.abi, kovanProvider)
  }, [kovanProvider])

  const l1Dai = useMemo(() => {
    return getContract(addresses.l1Dai, erc20Artifact.abi, kovanProvider)
  }, [kovanProvider])

  const l1Bridge = useMemo(() => {
    return getContract(addresses.l1Bridge, l1BridgeArtifact.abi, kovanProvider)
  }, [kovanProvider])

  const arbitrumDai = useMemo(() => {
    return getContract(
      addresses.arbitrumDai,
      arbErc20Artifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  const arbitrumBridge = useMemo(() => {
    return getContract(
      addresses.arbitrumBridge,
      l2BridgeArtifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  const arbitrumL1Messenger = useMemo(() => {
    return getContract(
      addresses.l1Messenger,
      l1ArbitrumMessengerArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  const arbitrumUniswapRouter = useMemo(() => {
    return getContract(
      addresses.arbitrumUniswapRouter,
      uniswapRouterArtifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  const arbitrumUniswapFactory = useMemo(() => {
    return getContract(
      addresses.arbitrumUniswapFactory,
      uniswapFactoryArtifact.abi,
      arbitrumProvider
    )
  }, [arbitrumProvider])

  const stakingRewardsFactory = useMemo(() => {
    return getContract(
      addresses.stakingRewardsFactory,
      stakingRewardsFactoryArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  const stakingRewards = useMemo(() => {
    return getContract(
      addresses.stakingRewards,
      stakingRewardsArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  const governorAlpha = useMemo(() => {
    return getContract(
      addresses.governorAlpha,
      governorAlphaArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  return {
    l1Hop,
    l1Dai,
    l1Bridge,
    arbitrumDai,
    arbitrumBridge,
    arbitrumL1Messenger,
    arbitrumUniswapRouter,
    arbitrumUniswapFactory,
    getErc20Contract,
    stakingRewardsFactory,
    stakingRewards,
    governorAlpha
  }
}

export default useContracts
