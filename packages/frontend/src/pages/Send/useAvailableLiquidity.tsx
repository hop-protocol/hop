import { useState, useEffect } from 'react'
import { HopBridge } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import useInterval from 'src/hooks/useInterval'

const useAvailableLiquidity = (
  bridge: HopBridge | undefined,
  destinationChain: string | undefined
): BigNumber | undefined => {
  const [availableLiquidity, setAvailableLiquidity] = useState<BigNumber>()

  useEffect(() => {
    setAvailableLiquidity(undefined)
    updateAvailableLiquidity()
  }, [destinationChain])

  const updateAvailableLiquidity = async () => {
    if (!bridge) {
      setAvailableLiquidity(undefined)
      return
    }

    let liquidity
    if (destinationChain) {
      liquidity = await bridge.getAvailableLiquidity(destinationChain)
    }
    setAvailableLiquidity(liquidity)
  }

  useInterval(() => {
    updateAvailableLiquidity()
  }, 15e3)

  return availableLiquidity
}

export default useAvailableLiquidity
