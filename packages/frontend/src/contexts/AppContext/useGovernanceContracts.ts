import { useMemo } from 'react'
import { Contract, Signer, providers } from 'ethers'
import stakingRewardsFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/distribution/StakingRewardsFactory.sol/StakingRewardsFactory.json'
import stakingRewardsArtifact from '@hop-exchange/contracts/artifacts/contracts/distribution/StakingRewardsFactory.sol/StakingRewards.json'
import hopArtifact from '@hop-exchange/contracts/artifacts/contracts/governance/Hop.sol/Hop.json'
import governorAlphaArtifact from '@hop-exchange/contracts/artifacts/contracts/governance/GovernorAlpha.sol/GovernorAlpha.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'

export type GovernanceContracts = {
  l1Hop: Contract | undefined
  stakingRewardsFactory: Contract | undefined
  stakingRewards: Contract | undefined
  governorAlpha: Contract | undefined
}

const useGovernanceContracts = (networks: Network[]): GovernanceContracts => {
  const { provider, connectedNetworkId } = useWeb3Context()

  const kovanProvider = useMemo(() => {
    const kovanNetwork = networks.find(
      (network: Network) => network.slug === 'kovan'
    )
    if (connectedNetworkId === kovanNetwork?.networkId) {
      return provider?.getSigner()
    }

    return kovanNetwork?.provider
  }, [networks, connectedNetworkId, provider])

  const l1Hop = useMemo(() => {
    return new Contract(addresses.l1Hop, hopArtifact.abi, kovanProvider)
  }, [kovanProvider])

  const stakingRewardsFactory = useMemo(() => {
    return new Contract(
      addresses.stakingRewardsFactory,
      stakingRewardsFactoryArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  const stakingRewards = useMemo(() => {
    return new Contract(
      addresses.stakingRewards,
      stakingRewardsArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  const governorAlpha = useMemo(() => {
    return new Contract(
      addresses.governorAlpha,
      governorAlphaArtifact.abi,
      kovanProvider
    )
  }, [kovanProvider])

  return {
    l1Hop,
    stakingRewardsFactory,
    stakingRewards,
    governorAlpha
  }
}

export default useGovernanceContracts
