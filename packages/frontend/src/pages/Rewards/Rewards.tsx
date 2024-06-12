import Box from '@mui/material/Box'
import React from 'react'
import { RewardsWidget } from '#pages/Rewards/RewardsWidget.js'
import { configs } from '#pages/Rewards/config.js'
import { getChainName } from '#utils/getChainName.js'

export function Rewards() {
  return (
    <Box>
      {configs.map((config: any) => {
        const chainName = getChainName(config.chainId)

        return (
          <RewardsWidget
            key={config.chainId}
            requiredChainId={config.chainId}
            rewardsContractAddress={config.rewardsContractAddress}
            merkleBaseUrl={config.merkleBaseUrl}
            title={`${chainName} Onboarding Rewards`}
            description={`These rewards are refunds for bridging into ${chainName}. The refund includes a percentage of the source transaction cost + bonder fee + AMM LP fee`}
          />
        )
      })}
    </Box>
  )
}
