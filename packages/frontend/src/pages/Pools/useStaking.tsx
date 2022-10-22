import React, { useMemo, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { StakingRewards__factory, ERC20__factory } from '@hop-protocol/core/contracts'
import { formatTokenDecimalString } from 'src/utils/format'
import { getTokenImage, findMatchingBridge, isRewardsExpired as isRewardsExpiredCheck, calculateStakedPosition, findNetworkBySlug, formatError } from 'src/utils'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useApprove, useAsyncMemo, useEffectInterval } from 'src/hooks'
import { usePoolStats } from './usePoolStats'

export function useStaking (chainSlug: string, tokenSymbol: string, stakingContractAddress: string) {
  const { bridges, sdk, txConfirm } = useApp()
  const { checkConnectedNetworkId, walletConnected, address } = useWeb3Context()
  const { getPoolStats } = usePoolStats()
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<any>(null)
  const [stakingContract, setStakingContract] = useState<any>()
  const [earnedAmountBn, setEarnedAmountBn] = useState<any>(BigNumber.from(0))
  const [depositedAmountBn, setDepositedAmountBn] = useState<any>(BigNumber.from(0))
  const [stakingTokenContract, setStakingTokenContract] = useState<any>()
  const [stakingTokenAddress, setStakingTokenAddress] = useState<any>('')
  const [rewardsTokenContract, setRewardsTokenContract] = useState<any>()
  const [rewardsTokenAddress, setRewardsTokenAddress] = useState<any>('')
  const [rewardsTokenSymbol, setRewardsTokenSymbol] = useState<any>('')
  const [isRewardsExpired, setIsRewardsExpired] = useState(false)
  const [overallTotalStakedBn, setOverallTotalStakedBn] = useState(BigNumber.from(0))
  const [overallRewardsPerDayBn, setOverallRewardsPerDayBn] = useState(BigNumber.from(0))
  const [userRewardsPerDayBn, setUserRewardsPerDayBn] = useState(BigNumber.from(0))
  const [userRewardsTotalUsd, setUserRewardsTotalUsd] = useState(BigNumber.from(0))
  const [userLpBalance, setUserLpBalance] = useState(BigNumber.from(0))
  const [isClaiming, setIsClaiming] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isApprovalNeeded, setIsApprovalNeeded] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const accountAddress = address?.address
  const pollIntervalMs = 5 * 1000
  const lpTokenSymbol = `${tokenSymbol}-LP`

  const lpToken = useAsyncMemo(async () => {
    if (!(tokenSymbol && chainSlug)) {
      return
    }
    const bridge = findMatchingBridge(bridges, tokenSymbol)!
    return bridge.getSaddleLpToken(chainSlug)
  }, [bridges, tokenSymbol, chainSlug])
  const { approve } = useApprove(lpToken)

  useEffect(() => {
    async function update () {
      if (sdk && chainSlug && stakingContractAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = StakingRewards__factory.connect(stakingContractAddress, _provider)
        setStakingContract(_contract)
      }
    }

    update().catch(console.error)
  }, [chainSlug, stakingContractAddress, sdk])

  useEffectInterval(() => {
    async function update () {
      if (chainSlug && stakingContract && accountAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _earned = await stakingContract.connect(_provider).earned(accountAddress)
        setEarnedAmountBn(_earned)
      }
    }

    update().catch(console.error)
  }, [stakingContract, accountAddress, chainSlug], pollIntervalMs)

  useEffectInterval(() => {
    async function update () {
      if (chainSlug && stakingContract && accountAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _deposited = await stakingContract.connect(_provider).balanceOf(accountAddress)
        setDepositedAmountBn(_deposited)
      }
    }

    update().catch(console.error)
  }, [stakingContract, accountAddress, chainSlug], pollIntervalMs)

  useEffect(() => {
    async function update () {
      if (chainSlug && stakingContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _address = await stakingContract.connect(_provider).rewardsToken()
        setRewardsTokenAddress(_address)
      }
    }

    update().catch(console.error)
  }, [stakingContract, chainSlug])

  useEffect(() => {
    async function update () {
      if (chainSlug && stakingContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _address = await stakingContract.connect(_provider).stakingToken()
        setStakingTokenAddress(_address)
      }
    }

    update().catch(console.error)
  }, [stakingContract, chainSlug])

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
      if (chainSlug && rewardsTokenContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _symbol = await rewardsTokenContract.connect(_provider).symbol()
        setRewardsTokenSymbol(_symbol)
      }
    }

    update().catch(console.error)
  }, [rewardsTokenContract, chainSlug])

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && stakingContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const timestamp = await stakingContract.connect(_provider).periodFinish()
        const _isExpired = isRewardsExpiredCheck(timestamp)
        setIsRewardsExpired(_isExpired)
      }
    }
    update().catch(console.error)
  }, [stakingContract, chainSlug], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      if (overallRewardsPerDayBn && overallTotalStakedBn.gt(0) && depositedAmountBn) {
        const _userRewardsPerDay = overallRewardsPerDayBn.mul(depositedAmountBn).div(overallTotalStakedBn)
        setUserRewardsPerDayBn(_userRewardsPerDay)
      }
    }
    update().catch(console.error)
  }, [overallRewardsPerDayBn, overallTotalStakedBn, depositedAmountBn], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && stakingTokenContract && stakingContractAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const totalStaked = await stakingTokenContract.connect(_provider).balanceOf(stakingContractAddress)
        setOverallTotalStakedBn(totalStaked)
      }
    }
    update().catch(console.error)
  }, [stakingTokenContract, chainSlug], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && stakingTokenContract && accountAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const balance = await stakingTokenContract.connect(_provider).balanceOf(accountAddress)
        setUserLpBalance(balance)
      }
    }
    update().catch(console.error)
  }, [stakingTokenContract, accountAddress, chainSlug], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && stakingContract && !isRewardsExpired) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const rewardRate = await stakingContract.connect(_provider).rewardRate()
        const oneDaySeconds = 86400
        const _rewardsPerDay = rewardRate.mul(oneDaySeconds)
        setOverallRewardsPerDayBn(_rewardsPerDay)
      }
    }
    update().catch(console.error)
  }, [stakingContract, isRewardsExpired, chainSlug], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && tokenSymbol && earnedAmountBn && depositedAmountBn && rewardsTokenSymbol) {
        const bridge = sdk.bridge(tokenSymbol)
        const amm = bridge.getAmm(chainSlug)
        const userStakedTotal = await amm.calculateTotalAmountForLpToken(depositedAmountBn)
        const canonToken = bridge.getCanonicalToken(chainSlug)
        const tokenUsdPrice = await bridge.priceFeed.getPriceByTokenSymbol(tokenSymbol)
        const rewardTokenUsdPrice = await bridge.priceFeed.getPriceByTokenSymbol(rewardsTokenSymbol)

        const stakedPosition = calculateStakedPosition(
          earnedAmountBn,
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
  }, [earnedAmountBn, depositedAmountBn, rewardsTokenSymbol, tokenSymbol, chainSlug], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      try {
        if (chainSlug && stakingTokenContract) {
          const _provider = await sdk.getSignerOrProvider(chainSlug)
          const allowance = await stakingTokenContract.connect(_provider).allowance(accountAddress, stakingContractAddress)
          const parsedAmount = parseUnits(amount || '0', 18)
          const _approvalNeeded = allowance.lt(parsedAmount)
          setIsApprovalNeeded(_approvalNeeded)
        }
      } catch (err) {
      }
    }
    update().catch(console.error)
  }, [amount, stakingTokenContract, stakingContractAddress, accountAddress, chainSlug], pollIntervalMs)

  async function approveTokens () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      const parsedAmount = parseUnits(amount || '0', 18)
      if (!isNetworkConnected) return

      setIsApproving(true)
      await approve(parsedAmount, lpToken!, stakingContractAddress)
    } catch (err) {
      console.error(err)
      setError(formatError(err))
    }
    setIsApproving(false)
  }

  async function stake() {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setIsStaking(true)

      const stakingToken = {
        decimals: 18,
        symbol: lpTokenSymbol,
      }

      const tx = await txConfirm?.show({
        kind: 'stake',
        inputProps: {
          source: {
            network,
          },
          amount: amount,
          token: stakingToken,
        },
        onConfirm: async () => {
          const signer = await sdk.getSignerOrProvider(chainSlug)
          const parsedAmount = parseUnits(amount || '0', 18)
          return stakingContract.connect(signer).stake(parsedAmount)
        },
      })

      await tx.wait()
      setAmount('')
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setIsStaking(false)
  }

  async function withdraw () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setIsWithdrawing(true)
      const signer = await sdk.getSignerOrProvider(chainSlug)
      const _stakingRewards = stakingContract.connect(signer)
      const stakeBalance = depositedAmountBn
      const stakingToken = {
        decimals: 18,
        symbol: lpTokenSymbol,
      }

      const tx = await txConfirm?.show({
        kind: 'withdrawStake',
        inputProps: {
          token: stakingToken,
          maxBalance: stakeBalance,
        },
        onConfirm: async (withdrawAmount: BigNumber) => {
          if (withdrawAmount.eq(stakeBalance)) {
            return _stakingRewards.exit()
          }

          return _stakingRewards.withdraw(withdrawAmount)
        },
      })

      await tx.wait()
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setIsWithdrawing(false)
  }

  async function claim () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setIsClaiming(true)
      const signer = await sdk.getSignerOrProvider(chainSlug)
      const tx = await stakingContract.connect(signer).getReward()
      await tx.wait()
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setIsClaiming(false)
  }

  const warning = useMemo(() => {
    if (!amount || !userLpBalance) return
    const parsedAmount = parseUnits(amount || '0', 18)
    if (parsedAmount.gt(userLpBalance)) {
      return 'Insufficient balance'
    }
  }, [amount, userLpBalance])

  const canClaim = earnedAmountBn.gt(0) ?? false
  const canWithdraw = depositedAmountBn.gt(0) ?? false
  const stakingApr = getPoolStats(chainSlug, tokenSymbol)?.stakingApr ?? 0
  const stakingAprFormatted = getPoolStats(chainSlug, tokenSymbol)?.stakingAprFormatted ?? ''
  const lpBalanceFormatted = `${formatTokenDecimalString(userLpBalance, 18, 4)}`
  const lpBalance = Number(formatUnits(userLpBalance, 18))
  const earnedAmountFormatted = `${formatTokenDecimalString(earnedAmountBn, 18, 4)} ${rewardsTokenSymbol}`
  const depositedAmountFormatted = `${formatTokenDecimalString(depositedAmountBn, 18, 4)}`
  const userRewardsPerDayNumber = Number(formatUnits(userRewardsPerDayBn, 18))
  const userRewardsPerDayFormatted = `${userRewardsPerDayNumber < 0.001 && userRewardsPerDayBn.gt(0) ? '<0.001' : formatTokenDecimalString(userRewardsPerDayBn, 18, 4)} ${rewardsTokenSymbol} / day`
  const userRewardsTotalUsdFormatted = `$${formatTokenDecimalString(userRewardsTotalUsd, 18, 4)}`
  const overallTotalStakedFormatted = `${formatTokenDecimalString(overallTotalStakedBn, 18, 4)}`
  const overallTotalRewardsPerDayFormatted = `${formatTokenDecimalString(overallRewardsPerDayBn, 18, 4)} ${rewardsTokenSymbol} / day`
  const noStaking = !stakingContractAddress
  const rewardsTokenImageUrl = getTokenImage(rewardsTokenSymbol)

  return {
    amount,
    approveTokens,
    canClaim,
    canWithdraw,
    claim,
    stakingContractAddress,
    depositedAmountBn,
    depositedAmountFormatted,
    earnedAmountBn,
    earnedAmountFormatted,
    error,
    isApprovalNeeded,
    isApproving,
    isClaiming,
    isRewardsExpired,
    isStaking,
    isWithdrawing,
    lpToken,
    lpBalanceFormatted,
    lpBalance,
    lpTokenSymbol,
    noStaking,
    overallTotalRewardsPerDayFormatted,
    overallTotalStakedBn,
    overallTotalStakedFormatted,
    rewardsTokenAddress,
    rewardsTokenSymbol,
    rewardsTokenImageUrl,
    setAmount,
    setError,
    stake,
    stakingContract,
    stakingApr,
    stakingAprFormatted,
    userRewardsPerDayFormatted,
    userRewardsTotalUsdFormatted,
    walletConnected,
    warning,
    withdraw,
  }
}
