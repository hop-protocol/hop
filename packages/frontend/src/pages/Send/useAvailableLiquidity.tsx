import { useState, useEffect } from 'react'
import { HopBridge } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useInterval } from 'react-use'
import logger from 'src/logger'

const useAvailableLiquidity = (
  bridge?: HopBridge,
  sourceChain?: string,
  destinationChain?: string
) => {
  const [availableLiquidity, setAvailableLiquidity] = useState<BigNumber>()

  const updateAvailableLiquidity = async () => {
    try {
      if (bridge && sourceChain && destinationChain) {
        const liquidity = await bridge.getFrontendAvailableLiquidity(sourceChain, destinationChain)
        setAvailableLiquidity(liquidity)
      }
    } catch (err: any) {
      logger.error(err)
      setAvailableLiquidity(undefined)
    }
  }

  useEffect(() => {
    setAvailableLiquidity(undefined)
    updateAvailableLiquidity()
  }, [bridge, sourceChain, destinationChain])

  useInterval(updateAvailableLiquidity, 15e3)

  return { availableLiquidity }
}

export default useAvailableLiquidity
