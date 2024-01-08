import { BigNumber } from 'ethers'
import { amountToBN } from './format'
import { shiftBNDecimals } from './shiftBNDecimals'

const TOTAL_AMOUNTS_DECIMALS = 18

export function isRewardsExpired(timestamp: BigNumber) {
  const expirationDate = Number(timestamp.toString())
  const now = Math.floor((Date.now() / 1000))
  return now > expirationDate
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
