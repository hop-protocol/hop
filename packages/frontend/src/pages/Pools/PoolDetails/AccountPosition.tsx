import React from 'react'
import Box from '@mui/material/Box'
import { InfoTooltip } from 'src/components/InfoTooltip'
import Typography from '@mui/material/Typography'
import { StakingRewardsClaim } from 'src/pages/Pools/PoolDetails/StakingRewardsClaim'

type Props = {
  chainSlug: string
  stakingContractAddress: string
  token0DepositedFormatted: string
  token0Symbol: string
  token1DepositedFormatted: string
  token1Symbol: string
  tokenSymbol: string
  userPoolBalanceFormatted: string
  userPoolBalanceUsdFormatted: string
  userPoolTokenPercentageFormatted: string
}

export function AccountPosition(props: Props) {
  const {
    chainSlug,
    stakingContractAddress,
    token0DepositedFormatted,
    token0Symbol,
    token1DepositedFormatted,
    token1Symbol,
    tokenSymbol,
    userPoolBalanceFormatted,
    userPoolBalanceUsdFormatted,
    userPoolTokenPercentageFormatted,
  } = props

  return (
    <Box>
      <Box mb={4}>
        <Box mb={1}>
          <Typography variant="subtitle1" color="secondary">
            <Box display="flex" alignItems="center">
              Balance <InfoTooltip title="USD value of current position in this pool" />
            </Box>
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="h4">
            {userPoolBalanceUsdFormatted}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="secondary">
            {token0DepositedFormatted} {token0Symbol} + {token1DepositedFormatted} {token1Symbol}
          </Typography>
        </Box>
      </Box>
      <Box maxWidth="300px">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Box mb={1}>
              <Typography variant="subtitle1" color="secondary">
                <Box display="flex" alignItems="center">
                  LP Balance <InfoTooltip title="Liquidity provider (LP) tokens this account has for depositing into pool" />
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {userPoolBalanceFormatted}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box mb={1}>
              <Typography variant="subtitle1" color="secondary">
                <Box display="flex" alignItems="center">
                  Share of Pool <InfoTooltip title="Share of pool percentage for account" />
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {userPoolTokenPercentageFormatted}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {!!stakingContractAddress && (
        <Box mt={8}>
          <StakingRewardsClaim
            chainSlug={chainSlug}
            stakingContractAddress={stakingContractAddress}
            tokenSymbol={tokenSymbol}
          />
        </Box>
      )}
    </Box>
  )
}
