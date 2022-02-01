import { Contract } from 'ethers'
import { toPercentDisplay, toTokenDisplay } from 'src/utils'

const TOTAL_AMOUNTS_DECIMALS = 18

export function formatStakingValues(
  stakingToken,
  rewardsToken,
  stakeBalance,
  earned,
  totalStaked,
  totalRewardsPerDay,
  userRewardsPerDay,
  apr,
  stakedPosition,
  rewardsExpired
) {
  const formattedStakeBalance = toTokenDisplay(stakeBalance, stakingToken?.decimals)
  const formattedEarned = toTokenDisplay(earned, rewardsToken?.decimals, rewardsToken?.symbol)
  const totalStakedFormatted = toTokenDisplay(
    totalStaked,
    stakingToken?.decimals,
    stakingToken?.symbol
  )
  const totalRewardsPerDayFormatted = toTokenDisplay(
    totalRewardsPerDay,
    rewardsToken?.decimals,
    rewardsToken?.symbol
  )
  const userRewardsPerDayFormatted = toTokenDisplay(
    userRewardsPerDay,
    rewardsToken?.decimals,
    rewardsToken?.symbol
  )
  const aprFormatted = `${toPercentDisplay(apr, TOTAL_AMOUNTS_DECIMALS)} ${
    rewardsExpired ? '(rewards ended)' : ''
  }`
  const stakedPositionFormatted = stakedPosition
    ? `$${toTokenDisplay(stakedPosition, stakingToken?.decimals)}`
    : ''

  return {
    formattedStakeBalance,
    formattedEarned,
    totalStakedFormatted,
    totalRewardsPerDayFormatted,
    userRewardsPerDayFormatted,
    aprFormatted,
    stakedPositionFormatted,
  }
}

export async function isRewardsExpired(stakingRewards: Contract) {
  const timestamp = await stakingRewards.periodFinish()
  const expirationDate = Number(timestamp.toString())
  const now = (Date.now() / 1000) | 0
  return now > expirationDate
}
