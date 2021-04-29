import { useState } from 'react'
import { HopBridge } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import useInterval from 'src/hooks/useInterval'

const useAvailableLiquidity = (bridge: HopBridge, destinationChain: string | undefined): BigNumber | undefined => {
  const [availableLiquidity, setAvailableLiquidity] = useState<BigNumber>()

  const updateAvailableLiquidity = async () => {
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
