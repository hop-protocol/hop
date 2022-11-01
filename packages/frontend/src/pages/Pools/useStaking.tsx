import React, { useMemo, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { StakingRewards__factory, ERC20__factory } from '@hop-protocol/core/contracts'
import { formatTokenDecimalString } from 'src/utils/format'
import { commafy, getTokenImage, findMatchingBridge, isRewardsExpired as isRewardsExpiredCheck, calculateStakedPosition, findNetworkBySlug, formatError } from 'src/utils'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useApprove, useAsyncMemo } from 'src/hooks'
import { usePoolStats } from './useNewPoolStats'
import { useQuery } from 'react-query'

export function useStaking (chainSlug: string, tokenSymbol: string, stakingContractAddress: string) {
  const { bridges, sdk, txConfirm } = useApp()
  const { checkConnectedNetworkId, walletConnected, address } = useWeb3Context()
  const { getStakingStats } = usePoolStats()
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isApproving, setIsApproving] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [overallRewardsPerDayBn, setOverallRewardsPerDayBn] = useState<BigNumber>(BigNumber.from(0))
  const [parsedAmount, setParsedAmount] = useState<BigNumber>(BigNumber.from(0))
  const [rewardRateBn, setRewardRateBn] = useState<BigNumber>(BigNumber.from(0))
  const accountAddress = address?.address
  const lpTokenImageUrl = getTokenImage(tokenSymbol)
  const lpTokenSymbol = `${tokenSymbol}-LP`
  const pollIntervalMs = 10 * 1000

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

  const stakingContract = useMemo(() => {
    try {
      if (sdk && chainSlug && stakingContractAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = StakingRewards__factory.connect(stakingContractAddress, _provider)
        return _contract
      }
    } catch (err) {
      console.error(err)
    }
  }, [chainSlug, stakingContractAddress, sdk])

  const { data: earnedAmountBn } = useQuery(
    [
      `useStaking:earnedAmountBn:${stakingContract?.address}:${chainSlug}:${accountAddress}`,
      stakingContract?.address,
      chainSlug,
      accountAddress,
    ],
    async () => {
      if (chainSlug && stakingContract && accountAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _earned = await stakingContract.connect(_provider).earned(accountAddress)
        return _earned
      }
    },
    {
      enabled: !!stakingContract?.address && !!chainSlug && !!accountAddress,
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: depositedAmountBn } = useQuery(
    [
      `useStaking:depositedAmountBn:${stakingContract?.address}:${chainSlug}:${accountAddress}`,
      stakingContract?.address,
      chainSlug,
      accountAddress,
    ],
    async () => {
      if (chainSlug && stakingContract && accountAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _deposited = await stakingContract.connect(_provider).balanceOf(accountAddress)
        return _deposited
      }
    },
    {
      enabled: !!stakingContract?.address && !!chainSlug && !!accountAddress,
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: rewardsTokenAddress } = useQuery(
    [
      `useStaking:rewardsTokenAddress:${stakingContract?.address}:${chainSlug}`,
      stakingContract?.address,
      chainSlug,
    ],
    async () => {
      if (chainSlug && stakingContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _address = await stakingContract.connect(_provider).rewardsToken()
        return _address
      }
    },
    {
      enabled: !!stakingContract?.address && !!chainSlug,
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: stakingTokenAddress } = useQuery(
    [
      `useStaking:stakingTokenAddress:${stakingContract?.address}:${chainSlug}`,
      stakingContract?.address,
      chainSlug,
    ],
    async () => {
      if (chainSlug && stakingContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _address = await stakingContract.connect(_provider).stakingToken()
        return _address
      }
    },
    {
      enabled: !!stakingContract?.address && !!chainSlug,
      refetchInterval: pollIntervalMs,
    }
  )

  const rewardsTokenContract = useMemo(() => {
    try {
      if (sdk && chainSlug && rewardsTokenAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = ERC20__factory.connect(rewardsTokenAddress, _provider)
        return _contract
      }
    } catch (err) {
      console.error(err)
    }
  }, [chainSlug, rewardsTokenAddress, sdk])

  useEffect(() => {
    if (!loading) {
      setIsLoading(true)
    }
  }, [rewardsTokenAddress])

  const stakingTokenContract = useMemo(() => {
    try {
      if (sdk && chainSlug && stakingTokenAddress) {
        const _provider = sdk.getChainProvider(chainSlug)
        const _contract = ERC20__factory.connect(stakingTokenAddress, _provider)
        return _contract
      }
    } catch (err) {
      console.error(err)
    }
  }, [chainSlug, stakingTokenAddress, sdk])

  const { data: rewardsTokenSymbol } = useQuery(
    [
      `useStaking:rewardsTokenSymbol:${rewardsTokenContract?.address}:${chainSlug}}`,
      rewardsTokenContract?.address,
      chainSlug,
    ],
    async () => {
      if (chainSlug && rewardsTokenContract) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const _symbol = await rewardsTokenContract.connect(_provider).symbol()
        return _symbol
      }
    },
    {
      enabled: !!rewardsTokenContract?.address && !!chainSlug,
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: isRewardsExpired } = useQuery(
    [
      `useStaking:isRewardsExpired:${stakingContract?.address}:${chainSlug}:${rewardRateBn?.toString()}`,
      stakingContract?.address,
      chainSlug,
      rewardRateBn?.toString(),
    ],
    async () => {
      if (chainSlug && stakingContract && accountAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const timestamp = await stakingContract.connect(_provider).periodFinish()
        const _isExpired = isRewardsExpiredCheck(timestamp)
        return _isExpired
      }
    },
    {
      enabled: !!stakingContract?.address && !!chainSlug && !!rewardRateBn?.toString(),
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: overallTotalStakedBn } = useQuery(
    [
      `useStaking:overallTotalStakedBn:${stakingContractAddress}:${stakingTokenContract?.address}:${chainSlug}`,
      stakingTokenContract?.address,
      chainSlug
    ],
    async () => {
      if (chainSlug && stakingTokenContract && stakingContractAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const totalStaked = await stakingTokenContract.connect(_provider).balanceOf(stakingContractAddress)
        setIsLoading(false)
        return totalStaked
      }
    },
    {
      enabled: !!stakingContractAddress && !!stakingTokenContract?.address && !!chainSlug,
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: userRewardsPerDayBn } = useQuery(
    [
      `useStaking:userRewardsPerDayBn:${overallRewardsPerDayBn?.toString()}:${overallTotalStakedBn?.toString()}:${depositedAmountBn?.toString()}`,
      overallRewardsPerDayBn?.toString(),
      overallTotalStakedBn?.toString(),
      depositedAmountBn?.toString(),
    ],
    async () => {
      if (overallRewardsPerDayBn?.gt(0) && overallTotalStakedBn?.gt(0) && depositedAmountBn?.gt(0)) {
        const _userRewardsPerDay = overallRewardsPerDayBn.mul(depositedAmountBn).div(overallTotalStakedBn)
        return _userRewardsPerDay
      }
    },
    {
      enabled: !!overallRewardsPerDayBn?.toString() && !!overallTotalStakedBn?.toString() && !!depositedAmountBn?.toString(),
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: userLpBalanceBn } = useQuery(
    [
      `useStaking:userLpBalanceBn:${stakingTokenContract?.toString()}:${accountAddress}:${chainSlug}`,
    ],
    async () => {
      if (chainSlug && stakingTokenContract && accountAddress) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const balance = await stakingTokenContract.connect(_provider).balanceOf(accountAddress)
        return balance
      }
    },
    {
      enabled: !!stakingTokenContract?.toString() && !!accountAddress && !!chainSlug,
      refetchInterval: pollIntervalMs,
    }
  )

  useEffect(() => {
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
  }, [stakingContract, chainSlug]) // , pollIntervalMs)

  const { data: userRewardsTotalUsdBn } = useQuery(
    [
      `useStaking:userRewardsTotalUsdBn:${earnedAmountBn?.toString()}:${rewardsTokenSymbol}:${tokenSymbol}:${chainSlug}:${depositedAmountBn?.toString()}`,
      earnedAmountBn?.toString(),
      rewardsTokenSymbol,
      tokenSymbol,
      chainSlug,
      depositedAmountBn?.toString(),
    ],
    async () => {
      if (chainSlug && tokenSymbol && earnedAmountBn && depositedAmountBn?.gt(0) && rewardsTokenSymbol) {
        const bridge = sdk.bridge(tokenSymbol)
        const amm = bridge.getAmm(chainSlug)
        const userStakedTotal = await amm.calculateTotalAmountForLpToken(depositedAmountBn)
        const canonToken = bridge.getCanonicalToken(chainSlug)
        const tokenUsdPrice = ['USDC', 'USDT', 'DAI'].includes(tokenSymbol) ? 1 : await bridge.priceFeed.getPriceByTokenSymbol(tokenSymbol)
        const rewardTokenUsdPrice = ['USDC', 'USDT', 'DAI'].includes(rewardsTokenSymbol) ? 1 : await bridge.priceFeed.getPriceByTokenSymbol(rewardsTokenSymbol)

        const stakedPosition = calculateStakedPosition(
          earnedAmountBn,
          userStakedTotal,
          tokenUsdPrice,
          rewardTokenUsdPrice,
          canonToken.decimals,
          18
        )

        return stakedPosition
      }
    },
    {
      enabled: !!earnedAmountBn?.toString() && !!rewardsTokenSymbol && !!tokenSymbol && !!chainSlug && !!depositedAmountBn?.toString(),
      refetchInterval: pollIntervalMs,
    }
  )

  const { data: isApprovalNeeded } = useQuery(
    [
      `useStaking:isApprovalNeeded:${chainSlug}:${stakingContract?.address}:${accountAddress}:${parsedAmount?.toString()}`,
      chainSlug,
      stakingContract?.address,
      accountAddress,
      parsedAmount?.toString()
    ],
    async () => {
      if (chainSlug && stakingTokenContract && stakingContractAddress && accountAddress && parsedAmount) {
        const _provider = await sdk.getSignerOrProvider(chainSlug)
        const allowance = await stakingTokenContract.connect(_provider).allowance(accountAddress, stakingContractAddress)
        const _approvalNeeded = allowance.lt(parsedAmount)
        return _approvalNeeded
      }
    },
    {
      enabled: !!chainSlug && !!stakingContractAddress && !!accountAddress && !!parsedAmount?.toString(),
      refetchInterval: pollIntervalMs,
    }
  )

  async function approveTokens () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setIsApproving(true)
      setError('')
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
      if (!stakingContract) return

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
      if (!stakingContract) return

      if (!lpToken) {
        return
      }

      setIsStaking(true)
      setError('')

      const amountFormatted = commafy(amount || '0', 4)
      const totalFormatted = `${amountFormatted} ${lpTokenSymbol}`

      const txList:any = []

      txList.push({
        label: `Approve ${lpTokenSymbol}`,
        fn: async () => {
          const isNetworkConnected = await checkConnectedNetworkId(networkId)
          if (!isNetworkConnected) {
            throw new Error('wrong network connected')
          }

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
          const isNetworkConnected = await checkConnectedNetworkId(networkId)
          if (!isNetworkConnected) {
            throw new Error('wrong network connected')
          }

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

      setAmount('')
      setParsedAmount(BigNumber.from(0))
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
      if (!stakingContract) return
      const stakeBalance = depositedAmountBn
      if (!stakeBalance) {
        return
      }

      setIsWithdrawing(true)
      setError('')
      const signer = await sdk.getSignerOrProvider(chainSlug)
      const _stakingRewards = stakingContract.connect(signer)
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
      if (!stakingContract) return

      setIsClaiming(true)
      setError('')
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
    if (!amount || !userLpBalanceBn) return
    if (parsedAmount.gt(userLpBalanceBn)) {
      return 'Insufficient balance'
    }
  }, [amount, parsedAmount, userLpBalanceBn])

  const _stakingStats = getStakingStats(chainSlug, tokenSymbol, stakingContractAddress)
  const canClaim = earnedAmountBn?.gt(0) ?? false
  const canWithdraw = depositedAmountBn?.gt(0) ?? false
  const depositedAmountFormatted = depositedAmountBn ? `${formatTokenDecimalString(depositedAmountBn, 18, 4)}` : '-'
  const earnedAmountFormatted = earnedAmountBn ? `${commafy(formatUnits(earnedAmountBn.toString(), 18), 5)} ${rewardsTokenSymbol}` : '-'
  const isActive = rewardRateBn.gt(0)
  const lpBalance = userLpBalanceBn ? Number(formatUnits(userLpBalanceBn, 18)) : 0
  const lpBalanceFormatted = userLpBalanceBn ? `${formatTokenDecimalString(userLpBalanceBn, 18, 4)}` : '-'
  const noStaking = !stakingContractAddress
  const overallTotalRewardsPerDayFormatted = `${formatTokenDecimalString(overallRewardsPerDayBn, 18, 4)} ${rewardsTokenSymbol} / day`
  const overallTotalStakedFormatted = overallTotalStakedBn ? `${formatTokenDecimalString(overallTotalStakedBn, 18, 4)}` : '-'
  const rewardsTokenImageUrl = rewardsTokenSymbol ? getTokenImage(rewardsTokenSymbol) : ''
  const stakingApr = _stakingStats?.stakingApr ?? 0
  const stakingAprFormatted = _stakingStats?.stakingAprFormatted ?? '-'
  const userRewardsPerDayNumber = userRewardsPerDayBn ? Number(formatUnits(userRewardsPerDayBn, 18)) : 0
  const userRewardsPerDayFormatted = userRewardsPerDayBn ? (`${userRewardsPerDayNumber < 0.001 && userRewardsPerDayBn.gt(0) ? '<0.001' : formatTokenDecimalString(userRewardsPerDayBn, 18, 4)} ${rewardsTokenSymbol} / day`) : '-'
  const userRewardsTotalUsdFormatted = userRewardsTotalUsdBn ? `$${formatTokenDecimalString(userRewardsTotalUsdBn, 18, 4)}` : '-'

  return {
    amount,
    approveAndStake,
    approveTokens,
    canClaim,
    canWithdraw,
    claim,
    depositedAmountBn,
    depositedAmountFormatted,
    earnedAmountBn,
    earnedAmountFormatted,
    error,
    isActive,
    isApprovalNeeded,
    isApproving,
    isClaiming,
    isRewardsExpired,
    isStaking,
    isWithdrawing,
    loading,
    lpBalance,
    lpBalanceFormatted,
    lpToken,
    lpTokenImageUrl,
    lpTokenSymbol,
    noStaking,
    overallTotalRewardsPerDayFormatted,
    overallTotalStakedBn,
    overallTotalStakedFormatted,
    rewardsTokenAddress,
    rewardsTokenImageUrl,
    rewardsTokenSymbol,
    setAmount,
    setError,
    setParsedAmount,
    stake,
    stakingApr,
    stakingAprFormatted,
    stakingContract,
    stakingContractAddress,
    userLpBalanceBn,
    userRewardsPerDayFormatted,
    userRewardsTotalUsdFormatted,
    walletConnected,
    warning,
    withdraw,
  }
}
