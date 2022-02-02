import { BigNumber } from 'ethers'
import { toPercentDisplay, toTokenDisplay } from 'src/utils'
import { amountToBN } from './format'
import { shiftBNDecimals } from './shiftBNDecimals'

const TOTAL_AMOUNTS_DECIMALS = 18
const oneYearDays = 365

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

export async function isRewardsExpired(timestamp: BigNumber) {
  const expirationDate = Number(timestamp.toString())
  const now = (Date.now() / 1000) | 0
  return now > expirationDate
}

// ((REWARD-TOKEN_PER_DAY * REWARD-TOKEN_PRICE)/((STAKED_USDC + STAKED_HUSDC)*STAKED_TOKEN_PRICE)) * DAYS_PER_YEAR
export function calculateApr(
  tokenDecimals: number,
  tokenUsdPrice: number,
  rewardTokenUsdPrice: number,
  stakedTotal: BigNumber,
  totalRewardsPerDay: BigNumber
) {
  const rewardTokenUsdPriceBn = amountToBN(rewardTokenUsdPrice.toString(), 18)
  const tokenUsdPriceBn = amountToBN(tokenUsdPrice.toString(), 18)
  const stakedTotal18d = shiftBNDecimals(stakedTotal, TOTAL_AMOUNTS_DECIMALS - tokenDecimals)
  const precision = amountToBN('1', 18)

  return totalRewardsPerDay
    .mul(rewardTokenUsdPriceBn)
    .mul(precision)
    .div(stakedTotal18d.mul(tokenUsdPriceBn))
    .mul(oneYearDays)
}

export function calculateStakedPosition(
  earned: BigNumber,
  userStakedTotal: BigNumber,
  tokenUsdPrice: number,
  rewardTokenUsdPrice: number,
  tokenDecimals: number,
  stakingTokenDecimals: number
) {
  const rewardTokenUsdPriceBn = amountToBN(rewardTokenUsdPrice.toString(), stakingTokenDecimals)
  const tokenUsdPriceBn = amountToBN(tokenUsdPrice.toString(), stakingTokenDecimals)
  const userStakedTotal18d = shiftBNDecimals(
    userStakedTotal,
    TOTAL_AMOUNTS_DECIMALS - tokenDecimals
  )

  return userStakedTotal18d
    .mul(tokenUsdPriceBn)
    .add(earned.mul(rewardTokenUsdPriceBn))
    .div(BigNumber.from(10).pow(stakingTokenDecimals))
}
