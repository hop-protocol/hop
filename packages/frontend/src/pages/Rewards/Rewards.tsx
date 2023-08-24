import React from 'react'
import Box from '@mui/material/Box'
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
            description="These rewards are refunds for bridging into Optimism. The refund includes a percentage of the source transaction cost + bonder fee + AMM LP fee"
          />
        )
      })}
    </Box>
  )
}
