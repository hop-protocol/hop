import React from 'react'
import Box from '@material-ui/core/Box'
import { RewardsWidget } from './RewardsWidget'
import { configs } from './config'

export function Rewards() {
  return (
    <Box>
      {configs.map((config: any, i) => {
        return (
          <RewardsWidget
            key={i}
            requiredChainId={config.chainId}
            rewardsContractAddress={config.rewardsContractAddress}
            merkleBaseUrl={config.merkleBaseUrl}
            title="Optimism Onboarding Rewards"
          />
        )
      })}
    </Box>
  )
}
