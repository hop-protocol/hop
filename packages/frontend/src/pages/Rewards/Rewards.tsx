import Box from '@mui/material/Box'
import React from 'react'
import { RewardsWidget } from '#pages/Rewards/RewardsWidget.js'
import { configs } from '#pages/Rewards/config.js'

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
