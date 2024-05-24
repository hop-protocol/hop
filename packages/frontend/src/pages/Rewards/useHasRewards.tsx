import { configs } from '#pages/Rewards/config.js'
import { useRewards } from '#pages/Rewards/useRewards.js'

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
