import React, { useMemo, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { reactAppNetwork, stakingRewardTokens } from 'src/config'
import { StakingRewards__factory, ERC20__factory } from '@hop-protocol/core/contracts'
import { formatTokenDecimalString } from 'src/utils/format'
import { commafy, getTokenImage, findMatchingBridge, isRewardsExpired as isRewardsExpiredCheck, calculateStakedPosition, findNetworkBySlug, formatError } from 'src/utils'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useApprove, useAsyncMemo, useEffectInterval } from 'src/hooks'
import { usePoolStats } from './useNewPoolStats'

export function useStaking (chainSlug: string, tokenSymbol: string, stakingContractAddress: string) {
  const { bridges, sdk, txConfirm } = useApp()
  const { checkConnectedNetworkId, walletConnected, address } = useWeb3Context()
  const { getStakingStats } = usePoolStats()
  const [amount, setAmount] = useState<string>('')
  const [parsedAmount, setParsedAmount] = useState<any>(BigNumber.from(0))
  const [error, setError] = useState<any>(null)
  const [loading, setIsLoading] = useState(false)
  const [stakingContract, setStakingContract] = useState<any>(null)
  const [earnedAmountBn, setEarnedAmountBn] = useState<any>(BigNumber.from(0))
  const [depositedAmountBn, setDepositedAmountBn] = useState<any>(BigNumber.from(0))
  const [stakingTokenContract, setStakingTokenContract] = useState<any>(null)
  const [stakingTokenAddress, setStakingTokenAddress] = useState<any>('')
  const [rewardsTokenContract, setRewardsTokenContract] = useState<any>(null)
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
  const [rewardRateBn, setRewardRateBn] = useState(BigNumber.from(0))
  const accountAddress = address?.address
  const pollIntervalMs = 5 * 1000
  const lpTokenSymbol = `${tokenSymbol}-LP`
  const lpTokenImageUrl = getTokenImage(tokenSymbol)

  const lpToken = useAsyncMemo(async () => {
    try {
      if (!(tokenSymbol && chainSlug)) {
        return
      }
      const bridge = findMatchingBridge(bridges, tokenSymbol)
      if (!bridge) {
        return
      }
      return bridge.getSaddleLpToken(chainSlug)
    } catch (err) {
      console.error(err)
    }
  }, [bridges, tokenSymbol, chainSlug])
  const { approve } = useApprove(lpToken)

  useEffect(() => {
    async function update () {
      if (sdk && chainSlug && stakingContractAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = StakingRewards__factory.connect(stakingContractAddress, _provider)
        setStakingContract(_contract)
      } else {
        setStakingContract(null)
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
      } else {
        setEarnedAmountBn(BigNumber.from(0))
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
      } else {
        setDepositedAmountBn(BigNumber.from(0))
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
      } else {
        setRewardsTokenAddress('')
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
      } else {
        setStakingTokenAddress('')
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
      } else {
        setRewardsTokenContract(null)
      }
    }

    update().catch(console.error)
  }, [chainSlug, rewardsTokenAddress, sdk])

  useEffect(() => {
    setIsLoading(true)
  }, [rewardsTokenAddress])

  useEffect(() => {
    async function update () {
      if (sdk && chainSlug && stakingTokenAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = ERC20__factory.connect(stakingTokenAddress, _provider)
        setStakingTokenContract(_contract)
      } else {
        setStakingTokenContract(null)
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
      } else {
        setRewardsTokenSymbol('')
      }
    }

    update().catch(console.error)
  }, [rewardsTokenContract, chainSlug])

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && stakingContract && rewardRateBn.gt(0)) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const timestamp = await stakingContract.connect(_provider).periodFinish()
        const _isExpired = isRewardsExpiredCheck(timestamp)
        setIsRewardsExpired(_isExpired)
      } else {
        setIsRewardsExpired(false)
      }
    }
    update().catch(console.error)
  }, [stakingContract, chainSlug, rewardRateBn], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      if (overallRewardsPerDayBn && overallTotalStakedBn.gt(0) && depositedAmountBn) {
        const _userRewardsPerDay = overallRewardsPerDayBn.mul(depositedAmountBn).div(overallTotalStakedBn)
        setUserRewardsPerDayBn(_userRewardsPerDay)
      } else {
        setUserRewardsPerDayBn(BigNumber.from(0))
      }
    }
    update().catch(console.error)
  }, [overallRewardsPerDayBn, overallTotalStakedBn, depositedAmountBn], pollIntervalMs)

  useEffect(() => {
  try {
    setOverallTotalStakedBn(BigNumber.from(0))
    setRewardRateBn(BigNumber.from(0))
    setOverallRewardsPerDayBn(BigNumber.from(0))
    setRewardsTokenSymbol(stakingRewardTokens?.[reactAppNetwork]?.[chainSlug]?.[stakingContractAddress.toLowerCase()] ?? '')
    setIsRewardsExpired(false)
  } catch (err) {
    console.error(err)
  }
}, [stakingContractAddress])

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && stakingTokenContract && stakingContractAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const totalStaked = await stakingTokenContract.connect(_provider).balanceOf(stakingContractAddress)
        setOverallTotalStakedBn(totalStaked)
        setIsLoading(false)
      } else {
        setOverallTotalStakedBn(BigNumber.from(0))
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
      } else {
        setUserLpBalance(BigNumber.from(0))
      }
    }
    update().catch(console.error)
  }, [stakingTokenContract, accountAddress, chainSlug], pollIntervalMs)

  useEffectInterval(() => {
    async function update() {
      if (chainSlug && stakingContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const rewardRate = await stakingContract.connect(_provider).rewardRate()
        setRewardRateBn(rewardRate)
        if (rewardRate.gt(0)) {
          const oneDaySeconds = 86400
          const _rewardsPerDay = rewardRate.mul(oneDaySeconds)
          setOverallRewardsPerDayBn(_rewardsPerDay)
        } else {
          setOverallRewardsPerDayBn(BigNumber.from(0))
        }
      } else {
        setRewardRateBn(BigNumber.from(0))
        setOverallRewardsPerDayBn(BigNumber.from(0))
      }
    }
    update().catch(console.error)
  }, [stakingContract, chainSlug], pollIntervalMs)

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
      } else {
        setUserRewardsTotalUsd(BigNumber.from(0))
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
          const _approvalNeeded = allowance.lt(parsedAmount)
          setIsApprovalNeeded(_approvalNeeded)
        } else {
          setIsApprovalNeeded(false)
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
          return stakingContract.connect(signer).stake(parsedAmount)
        },
      })

      await tx.wait()
      setAmount('')
      setParsedAmount(BigNumber.from(0))
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setIsStaking(false)
  }

  async function approveAndStake () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      if (!lpToken) {
        return
      }

      setIsStaking(true)

      const amountFormatted = commafy(amount || '0', 4)
      const totalFormatted = `${amountFormatted} ${lpTokenSymbol}`

      const txList:any = []

      txList.push({
        label: `Approve ${lpTokenSymbol}`,
        fn: async () => {
          const spender = stakingContractAddress
          const allowance = await lpToken.allowance(spender)
          if (allowance.lt(parseUnits(amount, 18))) {
            return lpToken.approve(spender)
          }
        }
      })

      txList.push({
        label: `Stake ${lpTokenSymbol}`,
        fn: async () => {
          const signer = await sdk.getSignerOrProvider(chainSlug)
          return stakingContract.connect(signer).stake(parsedAmount)
        }
      })

      await txConfirm?.show({
        kind: 'approveAndStake',
        inputProps: {
          token: {
            amount: amountFormatted,
            token: {
              symbol: lpTokenSymbol,
              imageUrl: getTokenImage(tokenSymbol)
            },
          },
          total: totalFormatted,
        },
        onConfirm: async () => {
          const _txList = txList.filter((x: any) => x)
          await txConfirm?.show({
            kind: 'txList',
            inputProps: {
              title: 'Stake',
              txList: _txList
            },
            onConfirm: async () => {
            },
          })
        }
      })
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
    if (parsedAmount.gt(userLpBalance)) {
      return 'Insufficient balance'
    }
  }, [amount, parsedAmount, userLpBalance])

  const canClaim = earnedAmountBn.gt(0) ?? false
  const canWithdraw = depositedAmountBn.gt(0) ?? false
  const stakingApr = getStakingStats(chainSlug, tokenSymbol, stakingContractAddress)?.stakingApr ?? 0
  const stakingAprFormatted = useMemo(() => {
    return getStakingStats(chainSlug, tokenSymbol, stakingContractAddress)?.stakingAprFormatted ?? ''
  }, [chainSlug, tokenSymbol, stakingContractAddress])
  const lpBalanceFormatted = `${formatTokenDecimalString(userLpBalance, 18, 4)}`
  const lpBalance = Number(formatUnits(userLpBalance, 18))
  const earnedAmountFormatted = `${commafy(formatUnits(earnedAmountBn.toString(), 18), 5)} ${rewardsTokenSymbol}`
  const depositedAmountFormatted = `${formatTokenDecimalString(depositedAmountBn, 18, 4)}`
  const userRewardsPerDayNumber = Number(formatUnits(userRewardsPerDayBn, 18))
  const userRewardsPerDayFormatted = `${userRewardsPerDayNumber < 0.001 && userRewardsPerDayBn.gt(0) ? '<0.001' : formatTokenDecimalString(userRewardsPerDayBn, 18, 4)} ${rewardsTokenSymbol} / day`
  const userRewardsTotalUsdFormatted = `$${formatTokenDecimalString(userRewardsTotalUsd, 18, 4)}`
  const overallTotalStakedFormatted = `${formatTokenDecimalString(overallTotalStakedBn, 18, 4)}`
  const overallTotalRewardsPerDayFormatted = `${formatTokenDecimalString(overallRewardsPerDayBn, 18, 4)} ${rewardsTokenSymbol} / day`
  const noStaking = !stakingContractAddress
  const rewardsTokenImageUrl = rewardsTokenSymbol ? getTokenImage(rewardsTokenSymbol) : ''
  const isActive = rewardRateBn.gt(0)

  return {
    isActive,
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
    userLpBalance,
    lpTokenSymbol,
    lpTokenImageUrl,
    noStaking,
    overallTotalRewardsPerDayFormatted,
    overallTotalStakedBn,
    overallTotalStakedFormatted,
    rewardsTokenAddress,
    rewardsTokenSymbol,
    rewardsTokenImageUrl,
    setAmount,
    setParsedAmount,
    setError,
    approveAndStake,
    stake,
    stakingContract,
    stakingApr,
    stakingAprFormatted,
    userRewardsPerDayFormatted,
    userRewardsTotalUsdFormatted,
    walletConnected,
    warning,
    withdraw,
    loading
  }
}
