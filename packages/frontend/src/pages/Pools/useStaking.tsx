import React, { useMemo, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { StakingRewards__factory, ERC20__factory } from '@hop-protocol/core/contracts'
import { formatTokenDecimalString } from 'src/utils/format'
import { findMatchingBridge, isRewardsExpired, calculateStakedPosition, findNetworkBySlug, formatError } from 'src/utils'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useTransactionReplacement, useApprove, useAsyncMemo, useBalance } from 'src/hooks'

export function useStaking (chainSlug: string, tokenSymbol: string, contractAddress: string) {
  const { bridges, sdk, txConfirm } = useApp()
  const { checkConnectedNetworkId, address } = useWeb3Context()
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
  const [userLpBalance, setUserLpBalance] = useState(BigNumber.from(0))
  const [isClaiming, setIsClaiming] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [approvalNeeded, setApprovalNeeded] = useState(false)
  const [error, setError] = useState<any>(null)
  const accountAddress = address?.address
  const [amount, setAmount] = useState<string>('')
  const [isStaking, setIsStaking] = useState(false)

  const lpToken = useAsyncMemo(async () => {
    const bridge = findMatchingBridge(bridges, tokenSymbol)!
    return bridge.getSaddleLpToken(chainSlug)
  }, [bridges, tokenSymbol, chainSlug])
  const { approve } = useApprove(lpToken)

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

  const lpTokenSymbol = `LP-${tokenSymbol}`
  const earnedFormatted = `${formatTokenDecimalString(earned, 18, 4)} ${rewardsTokenSymbol}`
  const depositedFormatted = `${formatTokenDecimalString(deposited, 18, 4)} ${lpTokenSymbol}`
  const canClaim = earned?.gt(0) ?? false
  const canWithdraw = deposited?.gt(0) ?? false

  const aprFormatted = ''
  const rewardsPerDayNumber = Number(formatUnits(userRewardsPerDay, 18))
  const rewardsPerDayFormatted = `${rewardsPerDayNumber < 0.001 && userRewardsPerDay.gt(0) ? '<0.001' : formatTokenDecimalString(userRewardsPerDay, 18, 4)} ${rewardsTokenSymbol} / day`
  const rewardsTotalUsdFormatted = `$${formatTokenDecimalString(userRewardsTotalUsd, 18, 4)}`
  const overallTotalStakedFormatted = `${formatTokenDecimalString(overallTotalStaked, 18, 4)} ${lpTokenSymbol}`
  const lpBalanceFormatted = `${formatTokenDecimalString(userLpBalance, 18, 4)} ${lpTokenSymbol}`
  const overallTotalRewardsPerDayFormatted = `${formatTokenDecimalString(rewardsPerDay, 18, 4)} ${rewardsTokenSymbol} / day`

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
      if (rewardsPerDay && overallTotalStaked?.gt(0) && deposited) {
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
      if (stakingTokenContract && accountAddress) {
        const balance = await stakingTokenContract?.balanceOf(accountAddress)
        setUserLpBalance(balance)
      }
    }
    update().catch(console.error)
  }, [stakingTokenContract, accountAddress])

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

  async function claim () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setIsClaiming(true)
      const signer = await sdk.getSignerOrProvider(chainSlug)
      const tx = await contract.connect(signer).getReward()
      await tx.wait()
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setIsClaiming(false)
  }

  async function withdraw () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      if (!isNetworkConnected) return

      setIsWithdrawing(true)
      const signer = await sdk.getSignerOrProvider(chainSlug)
      const _stakingRewards = contract.connect(signer)
      const stakeBalance = deposited
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

  async function approveTokens () {
    try {
      const network = findNetworkBySlug(chainSlug)!
      const networkId = Number(network.networkId)
      const isNetworkConnected = await checkConnectedNetworkId(networkId)
      const parsedAmount = parseUnits(amount || '0', 18)
      if (!isNetworkConnected) return

      setIsApproving(true)
      await approve(parsedAmount, lpToken!, contractAddress)
    } catch (err) {
      console.error(err)
      setError(formatError(err))
    }
    setIsApproving(false)
  }

  useEffect(() => {
    async function update() {
      try {
        if (stakingTokenContract) {
          const allowance = await stakingTokenContract.allowance(accountAddress, contractAddress)
          const parsedAmount = parseUnits(amount || '0', 18)
          const _approvalNeeded = allowance.lt(parsedAmount)
          setApprovalNeeded(_approvalNeeded)
        }
      } catch (err) {
      }
    }
    update().catch(console.error)
  }, [amount, stakingTokenContract, contractAddress, accountAddress])

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
          return contract.connect(signer).stake(parsedAmount)
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
    rewardsExpired,
    claim,
    isClaiming,
    error,
    setError,
    withdraw,
    isWithdrawing,
    approvalNeeded,
    isApproving,
    approveTokens,
    amount,
    setAmount,
    stake,
    isStaking
  }
}
