import { useState, useCallback, useMemo } from 'react'
import { Contract } from 'ethers'
import useCurrentBlockTimestamp from 'src/hooks/useCurrentBlockTimestamp'

import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'

export interface StakingInfo {
  fetchStakingValues: any
  // the address of the reward contract
  stakingRewardAddress: string | undefined
  // the tokens involved in this pair
  tokens: [Contract | undefined, Contract | undefined] | undefined
  // the amount of token currently staked, or undefined if no account
  stakedAmount: string | undefined
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: string | undefined
  // the total amount of token staked in the contract
  totalStakedAmount: string | undefined
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: string | undefined
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: string | undefined
  // when the period ends
  periodFinish: Date | string | undefined
  // if pool is active
  active: boolean | undefined
  // calculates a hypothetical amount of token distributed to the active account per second.
  // getHypotheticalRewardRate: (
  //   stakedAmount: TokenAmount,
  //   totalStakedAmount: TokenAmount,
  //   totalRewardRate: TokenAmount
  // ) => TokenAmount
}

// gets the staking info from the network for the active chain id
export const useStakingInfo = (): StakingInfo => {
  const { address } = useWeb3Context()
  const { contracts } = useApp()
  const { stakingRewards, l1Dai } = contracts
  const fromToken = l1Dai
  const toToken = l1Dai

  const currentBlockTimestamp = useCurrentBlockTimestamp()

  const [stakedAmount, setStakedAmount] = useState<string | undefined>()
  const [earnedAmount, setEarnedAmount] = useState<string | undefined>()
  const [totalStakedAmount, setTotalStakedAmount] = useState<string | undefined>()
  const [totalRewardRate, setTotalRewardRate] = useState<string | undefined>()
  const [rewardRate, setRewardRate] = useState<string | undefined>()
  const [periodFinish, setPeriodFinish] = useState<Date | string | undefined>()

  const stakingRewardAddress = stakingRewards?.address.toString()
  const tokens = useMemo<[Contract | undefined, Contract | undefined]>(() => {
    return [fromToken, toToken]
  }, [fromToken, toToken])
  const active = useMemo<boolean | undefined>(() => {
    return periodFinish && currentBlockTimestamp ? Number(periodFinish) > Number(currentBlockTimestamp) : true
  }, [periodFinish, currentBlockTimestamp])

  const fetchStakingValues = useCallback(() => {
    async function setValues () {
      setStakedAmount(await stakingRewards?.balanceOf(address?.toString()))
      setEarnedAmount(await stakingRewards?.earned(address?.toString()))
      setTotalStakedAmount(await stakingRewards?.totalSupply())
      setTotalRewardRate(await stakingRewards?.rewardRate()) // TODO: What is this
      setRewardRate(await stakingRewards?.rewardRate())
      setPeriodFinish(await stakingRewards?.periodFinish())
    }
    setValues()
  }, [ 
    address,
    stakingRewards,
    setStakedAmount,
    setEarnedAmount,
    setTotalStakedAmount,
    setTotalRewardRate,
    setRewardRate,
    setPeriodFinish
  ])

  return {
    fetchStakingValues,
    stakingRewardAddress,
    tokens,
    stakedAmount,
    earnedAmount,
    totalStakedAmount,
    totalRewardRate,
    rewardRate,
    periodFinish,
    active
  }
}