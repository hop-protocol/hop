import { useMemo } from 'react'
import { Contract } from 'ethers'
import {
  governorAlphaAbi,
  stakingRewardsFactoryAbi,
  stakingRewardsAbi,
  hopAbi
} from '@hop-protocol/core/abi'

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
    if (!addresses.governance.l1Hop) {
      return
    }
    return new Contract(addresses.governance.l1Hop, hopAbi, l1Provider)
  }, [l1Provider])

  const stakingRewardsFactory = useMemo(() => {
    if (!addresses.governance.stakingRewardsFactory) {
      return
    }
    return new Contract(
      addresses.governance.stakingRewardsFactory,
      stakingRewardsFactoryAbi,
      l1Provider
    )
  }, [l1Provider])

  const stakingRewards = useMemo(() => {
    if (!addresses.governance.stakingRewards) {
      return
    }
    return new Contract(
      addresses.governance.stakingRewards,
      stakingRewardsAbi,
      l1Provider
    )
  }, [l1Provider])

  const governorAlpha = useMemo(() => {
    if (!addresses.governance.governorAlpha) {
      return
    }
    return new Contract(
      addresses.governance.governorAlpha,
      governorAlphaAbi,
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
