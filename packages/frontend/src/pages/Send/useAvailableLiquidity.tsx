import { useState, useEffect } from 'react'
import { HopBridge } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import useInterval from 'src/hooks/useInterval'

const useAvailableLiquidity = (
  bridge: HopBridge | undefined,
  sourceChain: string | undefined,
  destinationChain: string | undefined
): BigNumber | undefined => {
  const [availableLiquidity, setAvailableLiquidity] = useState<BigNumber>()

  useEffect(() => {
    setAvailableLiquidity(undefined)
    updateAvailableLiquidity()
  }, [destinationChain])

  const updateAvailableLiquidity = async () => {
    try {
      if (!bridge) {
        setAvailableLiquidity(undefined)
        return
      }

      let liquidity
      if (sourceChain && destinationChain) {
        liquidity = await bridge.getFrontendAvailableLiquidity(sourceChain, destinationChain)
      }

      // NOTE: temporarily disable ability to transfer due to bonder delays.
      // remove this once infura is back up
      liquidity = BigNumber.from(0)

      setAvailableLiquidity(liquidity)
    } catch (err) {
      setAvailableLiquidity(undefined)
    }
  }

  useInterval(() => {
    updateAvailableLiquidity()
  }, 15e3)

  return availableLiquidity
}

export default useAvailableLiquidity
