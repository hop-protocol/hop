import React from 'react'
import { configs } from 'src/pages/Rewards/config'
import { useRewards } from 'src/pages/Rewards/useRewards'

export const useHasRewards = () => {
  let _hasRewards = false
  for (const config of configs) {
    const { hasRewards } = useRewards({
      requiredChainId: config.chainId,
      rewardsContractAddress: config.rewardsContractAddress,
      merkleBaseUrl: config.merkleBaseUrl
    })
    if (hasRewards) {
      _hasRewards = true
      break
    }
  }

  return {
    hasRewards: _hasRewards
  }
}
