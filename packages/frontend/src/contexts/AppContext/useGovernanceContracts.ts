import { useMemo } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { addresses } from 'src/config'
import Network from 'src/models/Network'
import { L1_NETWORK } from 'src/utils/constants'
import {
  GovernorAlpha,
  GovernorAlpha__factory,
  Hop,
  Hop__factory,
  StakingRewards,
  StakingRewardsFactory,
  StakingRewardsFactory__factory,
  StakingRewards__factory,
} from '@hop-protocol/core/contracts'

export type GovernanceContracts = {
  l1Hop?: Hop
  stakingRewardsFactory?: StakingRewardsFactory
  stakingRewards?: StakingRewards
  governorAlpha?: GovernorAlpha
}

const useGovernanceContracts = (networks: Network[]): GovernanceContracts => {
  const { provider, connectedNetworkId } = useWeb3Context()

  const l1Provider = useMemo(() => {
    const network = networks.find((network: Network) => network.slug === L1_NETWORK)
    if (connectedNetworkId === network?.networkId) {
      return provider?.getSigner()
    }

    return network?.provider
  }, [networks, connectedNetworkId, provider])

  const l1Hop = useMemo(() => {
    if (!addresses.governance.l1Hop || !l1Provider) {
      return
    }
    return Hop__factory.connect(addresses.governance.l1Hop, l1Provider)
  }, [l1Provider])

  const stakingRewardsFactory = useMemo(() => {
    if (!addresses.governance.stakingRewardsFactory || !l1Provider) {
      return
    }
    return StakingRewardsFactory__factory.connect(
      addresses.governance.stakingRewardsFactory,
      l1Provider
    )
  }, [l1Provider])

  const stakingRewards = useMemo(() => {
    if (!addresses.governance.stakingRewards || !l1Provider) {
      return
    }
    return StakingRewards__factory.connect(addresses.governance.stakingRewards, l1Provider)
  }, [l1Provider])

  const governorAlpha = useMemo(() => {
    if (!addresses.governance.governorAlpha || !l1Provider) {
      return
    }
    return GovernorAlpha__factory.connect(addresses.governance.governorAlpha, l1Provider)
  }, [l1Provider])

  return {
    l1Hop,
    stakingRewardsFactory,
    stakingRewards,
    governorAlpha,
  }
}

export default useGovernanceContracts
