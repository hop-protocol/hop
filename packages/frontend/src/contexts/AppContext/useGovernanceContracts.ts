import { useMemo } from 'react'
import { Contract } from 'ethers'
import stakingRewardsFactoryArtifact from '@hop-exchange/contracts/artifacts/contracts/distribution/StakingRewardsFactory.sol/StakingRewardsFactory.json'
import stakingRewardsArtifact from '@hop-exchange/contracts/artifacts/contracts/distribution/StakingRewardsFactory.sol/StakingRewards.json'
import hopArtifact from '@hop-exchange/contracts/artifacts/contracts/governance/Hop.sol/Hop.json'
import governorAlphaArtifact from '@hop-exchange/contracts/artifacts/contracts/governance/GovernorAlpha.sol/GovernorAlpha.json'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'
import { L1_NETWORK } from 'src/constants'

export type GovernanceContracts = {
  l1Hop: Contract | undefined
  stakingRewardsFactory: Contract | undefined
  stakingRewards: Contract | undefined
  governorAlpha: Contract | undefined
}

const useGovernanceContracts = (networks: Network[]): GovernanceContracts => {
  const { provider, connectedNetworkId } = useWeb3Context()

  const l1Provider = useMemo(() => {
    const network = networks.find(
      (network: Network) => network.slug === L1_NETWORK
    )
    if (connectedNetworkId === network?.networkId) {
      return provider?.getSigner()
    }

    return network?.provider
  }, [networks, connectedNetworkId, provider])

  const l1Hop = useMemo(() => {
    return new Contract(addresses.governance.l1Hop, hopArtifact.abi, l1Provider)
  }, [l1Provider])

  const stakingRewardsFactory = useMemo(() => {
    return new Contract(
      addresses.governance.stakingRewardsFactory,
      stakingRewardsFactoryArtifact.abi,
      l1Provider
    )
  }, [l1Provider])

  const stakingRewards = useMemo(() => {
    return new Contract(
      addresses.governance.stakingRewards,
      stakingRewardsArtifact.abi,
      l1Provider
    )
  }, [l1Provider])

  const governorAlpha = useMemo(() => {
    return new Contract(
      addresses.governance.governorAlpha,
      governorAlphaArtifact.abi,
      l1Provider
    )
  }, [l1Provider])

  return {
    l1Hop,
    stakingRewardsFactory,
    stakingRewards,
    governorAlpha
  }
}

export default useGovernanceContracts
