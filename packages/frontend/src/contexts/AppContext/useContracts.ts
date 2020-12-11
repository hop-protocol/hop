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
}

interface ContractsHook extends HopContracts {
  getErc20Contract: (address: string, provider: any) => Contract
}

const useContracts = (networks: Network[]): ContractsHook => {
  const { provider } = useWeb3Context()

  const getErc20Contract = (
    address: string,
    provider: Signer | providers.Provider
  ): Contract => {
    return new Contract(address, erc20Artifact.abi, provider)
  }

  const l1Hop = useMemo(() => {
    return provider
      ? new Contract(addresses.l1Hop, erc20Artifact.abi, provider.getSigner())
      : undefined
  }, [provider])

  const l1Dai = useMemo(() => {
    return provider
      ? new Contract(addresses.l1Dai, erc20Artifact.abi, provider.getSigner())
      : undefined
  }, [provider])

  const l1Bridge = useMemo(() => {
    return provider
      ? new Contract(
          addresses.l1Bridge,
          l1BridgeArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrumDai = useMemo(() => {
    return provider
      ? new Contract(
          addresses.arbitrumDai,
          arbErc20Artifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrumBridge = useMemo(() => {
    return provider
      ? new Contract(
          addresses.arbitrumBridge,
          l2BridgeArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrumL1Messenger = useMemo(() => {
    return provider
      ? new Contract(
          addresses.l1Messenger,
          l1ArbitrumMessengerArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrumUniswapRouter = useMemo(() => {
    return provider
      ? new Contract(
          addresses.arbitrumUniswapRouter,
          uniswapRouterArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const arbitrumUniswapFactory = useMemo(() => {
    return provider
      ? new Contract(
          addresses.arbitrumUniswapFactory,
          uniswapFactoryArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const stakingRewardsFactory = useMemo(() => {
    return provider
      ? new Contract(
          addresses.stakingRewardsFactory,
          stakingRewardsFactoryArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])

  const stakingRewards = useMemo(() => {
    return provider
      ? new Contract(
          addresses.stakingRewards,
          stakingRewardsArtifact.abi,
          provider.getSigner()
        )
      : undefined
  }, [provider])


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
    stakingRewards
  }
}

export default useContracts
