import { useState, useCallback } from 'react'
import { Contract, BigNumber } from 'ethers'
import useCurrentBlockTimestamp from 'src/hooks/useCurrentBlockTimestamp'
import Token from 'src/models/Token'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { useApp } from 'src/contexts/AppContext'
import { L1_NETWORK } from 'src/constants'

type TokenArrayType = [Contract | undefined, Contract | undefined]
export interface StakingInfo {
  fetchStakingValues: () => void
  // the address of the reward contract
  stakingRewardAddress: string | undefined
  // the tokens involved in this pair
  tokens: TokenArrayType | undefined
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
  periodFinish: Date | undefined
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
  const app = useApp()
  const token = app?.tokens.find(token => token.symbol) as Token
  const stakingRewards = app?.contracts?.governance.stakingRewards
  const l1Dai =
    app?.contracts?.tokens[token.symbol][L1_NETWORK].l1CanonicalToken
  const fromToken = l1Dai
  const toToken = l1Dai

  const currentBlockTimestamp = useCurrentBlockTimestamp()

  const [stakedAmount, setStakedAmount] = useState<string | undefined>()
  const [earnedAmount, setEarnedAmount] = useState<string | undefined>()
  const [totalStakedAmount, setTotalStakedAmount] = useState<
    string | undefined
  >()
  const [totalRewardRate, setTotalRewardRate] = useState<string | undefined>()
  const [rewardRate, setRewardRate] = useState<string | undefined>()
  const [periodFinish, setPeriodFinish] = useState<Date | undefined>()

  const stakingRewardAddress = stakingRewards?.address.toString()
  const tokens: TokenArrayType = [fromToken, toToken]
  const active =
    periodFinish && currentBlockTimestamp
      ? Number(periodFinish) > Number(currentBlockTimestamp)
      : false

  const fetchStakingValues = useCallback(() => {
    async function setValues () {
      setStakedAmount(await stakingRewards?.balanceOf(address?.toString()))
      setEarnedAmount(await stakingRewards?.earned(address?.toString()))
      setTotalStakedAmount(await stakingRewards?.totalSupply())
      setTotalRewardRate(await stakingRewards?.rewardRate())
      setRewardRate(await stakingRewards?.rewardRate())
      const periodFinishBn: BigNumber = await stakingRewards?.periodFinish()
      if (periodFinishBn) {
        setPeriodFinish(new Date(periodFinishBn.toNumber() * 1000))
      }
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
