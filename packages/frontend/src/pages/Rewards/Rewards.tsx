import React from 'react'
import { RewardsWidget } from './RewardsWidget'
import { config } from './config'

export function Rewards() {
  return (
    <RewardsWidget
      requiredChainId={config.chainId}
      rewardsContractAddress={config.rewardsContractAddress}
      merkleBaseUrl={config.merkleBaseUrl}
      token={{
        symbol: 'OP',
        decimals: 18
      }}
      title="Optimism Fee Refund"
    />
  )
}
