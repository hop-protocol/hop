import { useState, useRef, useEffect, useCallback } from 'react'
import { BigNumber, Contract } from 'ethers'
import logger from 'src/logger'
import useInterval from 'src/hooks/useInterval'
import Address from 'src/models/Address'

const useStakeBalance = (stakingRewards: Contract | undefined, address: Address | undefined) => {
  const [stakeBalance, setStakeBalance] = useState<BigNumber>()
  const [loadingStakeBalance, setLoadingStakeBalance] = useState(false)
  const currentContract = useRef<Contract>()
  const debouncer = useRef<number>(0)

  const getBalance = useCallback(() => {
    const _getBalance = async () => {
      if (stakingRewards && address) {
        if (
          (currentContract.current && currentContract.current !== stakingRewards)
        ) {
          setLoadingStakeBalance(true)
        }

        const ctx = ++debouncer.current

        const _balance = await stakingRewards.balanceOf(address.toString())

        if (ctx === debouncer.current) {
          setStakeBalance(_balance as BigNumber)
          setLoadingStakeBalance(false)
        }
      } else {
        setStakeBalance(undefined)
        setLoadingStakeBalance(false)
      }
      currentContract.current = stakingRewards
    }

    _getBalance().catch(logger.error)
  }, [stakingRewards, address])

  useEffect(() => {
    getBalance()
  }, [stakingRewards, address])

  useInterval(() => {
    getBalance()
  }, 8e3)

  return { stakeBalance, loadingStakeBalance }
}

export default useStakeBalance
