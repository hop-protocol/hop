import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { StakingRewards__factory, ERC20__factory } from '@hop-protocol/core/contracts'
import { formatTokenDecimalString } from 'src/utils/format'
import { isRewardsExpired, calculateStakedPosition } from 'src/utils'
import { formatUnits } from 'ethers/lib/utils'

export function useStaking (chainSlug: string, tokenSymbol: string, contractAddress: string) {
  const { sdk } = useApp()
  const { address } = useWeb3Context()
  const [contract, setContract] = useState<any>()
  const [earned, setEarned] = useState<any>(BigNumber.from(0))
  const [deposited, setDeposited] = useState<any>(BigNumber.from(0))
  const [stakingTokenContract, setStakingTokenContract] = useState<any>()
  const [stakingTokenAddress, setStakingTokenAddress] = useState<any>('')
  const [rewardsTokenContract, setRewardsTokenContract] = useState<any>()
  const [rewardsTokenAddress, setRewardsTokenAddress] = useState<any>('')
  const [rewardsTokenSymbol, setRewardsTokenSymbol] = useState<any>('')
  const [rewardsExpired, setRewardsExpired] = useState(false)
  const [userRewardsPerDay, setUserRewardsPerDay] = useState(BigNumber.from(0))
  const [overallTotalStaked, setOverallTotalStaked] = useState(BigNumber.from(0))
  const [rewardsPerDay, setRewardsPerDay] = useState(BigNumber.from(0))
  const [userRewardsTotalUsd, setUserRewardsTotalUsd] = useState(BigNumber.from(0))
  const accountAddress = address?.address

  useEffect(() => {
    async function update () {
      if (sdk && chainSlug && contractAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = StakingRewards__factory.connect(contractAddress, _provider)
        setContract(_contract)
      }
    }

    update().catch(console.error)
  }, [chainSlug, contractAddress, sdk])

  useEffect(() => {
    async function update () {
      if (contract && accountAddress) {
        const _earned = await contract?.earned(accountAddress)
        setEarned(_earned)
      }
    }

    update().catch(console.error)
  }, [contract, accountAddress])

  useEffect(() => {
    async function update () {
      if (contract && accountAddress) {
        const _deposited = await contract?.balanceOf(accountAddress)
        setDeposited(_deposited)
      }
    }

    update().catch(console.error)
  }, [contract, accountAddress])

  useEffect(() => {
    async function update () {
      if (contract) {
        const _address = await contract?.rewardsToken()
        setRewardsTokenAddress(_address)
      }
    }

    update().catch(console.error)
  }, [contract])

  useEffect(() => {
    async function update () {
      if (contract) {
        const _address = await contract?.stakingToken()
        setStakingTokenAddress(_address)
      }
    }

    update().catch(console.error)
  }, [contract])

  useEffect(() => {
    async function update () {
      if (sdk && chainSlug && rewardsTokenAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = ERC20__factory.connect(rewardsTokenAddress, _provider)
        setRewardsTokenContract(_contract)
      }
    }

    update().catch(console.error)
  }, [chainSlug, rewardsTokenAddress, sdk])

  useEffect(() => {
    async function update () {
      if (sdk && chainSlug && stakingTokenAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = ERC20__factory.connect(stakingTokenAddress, _provider)
        setStakingTokenContract(_contract)
      }
    }

    update().catch(console.error)
  }, [chainSlug, stakingTokenAddress, sdk])

  useEffect(() => {
    async function update () {
      if (rewardsTokenContract) {
        const _symbol = await rewardsTokenContract?.symbol()
        setRewardsTokenSymbol(_symbol)
      }
    }

    update().catch(console.error)
  }, [rewardsTokenContract])

  const lpTokenSymbol = `LP`
  const earnedFormatted = `${formatTokenDecimalString(earned, 18, 4)} ${rewardsTokenSymbol}`
  const depositedFormatted = `${formatTokenDecimalString(deposited, 18, 4)} ${lpTokenSymbol}`
  const canClaim = earned?.gt(0) ?? false
  const canWithdraw = deposited?.gt(0) ?? false

  const aprFormatted = ''
  const rewardsPerDayNumber = Number(formatUnits(userRewardsPerDay, 18))
  const rewardsPerDayFormatted = `${rewardsPerDayNumber < 0.001 && userRewardsPerDay.gt(0) ? '<0.001' : formatTokenDecimalString(userRewardsPerDay, 18, 4)} ${rewardsTokenSymbol} / day`
  const rewardsTotalUsdFormatted = `$${formatTokenDecimalString(userRewardsTotalUsd, 18, 4)}`
  const overallTotalStakedFormatted = `${formatTokenDecimalString(overallTotalStaked, 18, 4)} ${lpTokenSymbol}`
  const lpBalanceFormatted = ''
  const overallTotalRewardsPerDayFormatted = `${formatTokenDecimalString(rewardsPerDay, 18, 4)} ${rewardsTokenSymbol} / day`

/*
        const token = await bridge.getL1Token()
        const tokenUsdPrice = await bridge.priceFeed.getPriceByTokenSymbol(token.symbol)
        if (address) {
          const earned = await stakingRewards?.earned(address.toString())
          const allowance = await stakingToken?.allowance(stakingRewards.address, address.toString())

          return {
            tokenUsdPrice,
            earned,
            allowance,
          }
        }
        */

  useEffect(() => {
    async function update() {
      if (contract) {
        const timestamp = await contract.periodFinish()
        const isExpired = isRewardsExpired(timestamp)
        setRewardsExpired(isExpired)
      }
    }
    update().catch(console.error)
  }, [contract])

  useEffect(() => {
    async function update() {
      if (rewardsPerDay && overallTotalStaked && deposited) {
        const _userRewardsPerDay = rewardsPerDay.mul(deposited).div(overallTotalStaked)
        setUserRewardsPerDay(_userRewardsPerDay)
      }
    }
    update().catch(console.error)
  }, [rewardsPerDay, overallTotalStaked, deposited])

  useEffect(() => {
    async function update() {
      if (stakingTokenContract && contractAddress) {
        const totalStaked = await stakingTokenContract?.balanceOf(contractAddress)
        setOverallTotalStaked(totalStaked)
      }
    }
    update().catch(console.error)
  }, [stakingTokenContract])

  useEffect(() => {
    async function update() {
      if (contract && !rewardsExpired) {
        const rewardRate = await contract?.rewardRate()
        const _rewardsPerDay = rewardRate.mul(86400) // multiply by 1 day
        setRewardsPerDay(_rewardsPerDay)
      }
    }
    update().catch(console.error)
  }, [contract, rewardsExpired])

  useEffect(() => {
    async function update() {
      if (earned && deposited && rewardsTokenSymbol) {
        const bridge = sdk.bridge(tokenSymbol)
        const amm = bridge.getAmm(chainSlug)
        const userStakedTotal = await amm.calculateTotalAmountForLpToken(deposited)
        const canonToken = bridge.getCanonicalToken(chainSlug)
        const tokenUsdPrice = await bridge.priceFeed.getPriceByTokenSymbol(tokenSymbol)
        const rewardTokenUsdPrice = await bridge.priceFeed.getPriceByTokenSymbol(rewardsTokenSymbol)

        const stakedPosition = calculateStakedPosition(
          earned,
          userStakedTotal,
          tokenUsdPrice,
          rewardTokenUsdPrice,
          canonToken.decimals,
          18
        )

        setUserRewardsTotalUsd(stakedPosition)
      }
    }
    update().catch(console.error)
  }, [earned, deposited, rewardsTokenSymbol])


  return {
    earned,
    earnedFormatted,
    deposited,
    depositedFormatted,
    rewardsTokenAddress,
    rewardsTokenSymbol,
    lpTokenSymbol,
    canClaim,
    canWithdraw,
    aprFormatted,
    rewardsPerDayFormatted,
    rewardsTotalUsdFormatted,
    overallTotalStaked,
    overallTotalStakedFormatted,
    lpBalanceFormatted,
    overallTotalRewardsPerDayFormatted,
    rewardsExpired
  }
}
