import { useState, useEffect, useRef, useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import Token from 'src/models/Token'
import Network from 'src/models/Network'
import useDebounceAsync from 'src/hooks/useDebounceAsync'

const useSendData = (
  token: Token,
  slippageTolerance: number,
  fromNetwork?: Network,
  toNetwork?: Network,
  fromAmount?: BigNumber
) => {
  let { sdk } = useApp()

  const [amountOut, setAmountOut] = useState<BigNumber>()
  const [rate, setRate] = useState<number | undefined>()
  const [priceImpact, setPriceImpact] = useState<number | undefined>()
  const [bonderFee, setBonderFee] = useState<BigNumber>()
  const [requiredLiquidity, setRequiredLiquidity] = useState<BigNumber>()
  const [amountOutMin, setAmountOutMin] = useState<BigNumber>()

  const updateSendData = useCallback(
    async (isCancelled: () => boolean) => {
      if (!fromNetwork) return 0
      if (!toNetwork) return 0
      if (!fromAmount) return 0

      const bridge = sdk.bridge(token?.symbol)
      const {
        amountOut: _amountOut,
        rate: _rate,
        priceImpact: _priceImpact,
        bonderFee: _bonderFee,
        requiredLiquidity: _requiredLiquidity
      } = await bridge.getSendData(fromAmount, fromNetwork.slug, toNetwork.slug)

      if (isCancelled()) return

      setAmountOut(_amountOut)
      setRate(_rate)
      setPriceImpact(_priceImpact)
      setBonderFee(_bonderFee)
      setRequiredLiquidity(_requiredLiquidity)
    },
    [
      fromNetwork,
      toNetwork,
      fromAmount,
      setAmountOut,
      setRate,
      setPriceImpact,
      setBonderFee,
      setRequiredLiquidity
    ]
  )

  useDebounceAsync(updateSendData, 400, 800)

  useEffect(() => {
    const update = async () => {
      setAmountOutMin(undefined)
      if (fromNetwork && toNetwork && amountOut) {
        const slippageToleranceBps = slippageTolerance * 100
        const minBps = Math.ceil(10000 - slippageToleranceBps)
        const _amountOutMin = amountOut.mul(minBps).div(10000)

        setAmountOutMin(_amountOutMin)
      }
    }

    update()
  }, [fromNetwork, toNetwork, amountOut, slippageTolerance])

  return {
    amountOut,
    rate,
    priceImpact,
    amountOutMin,
    bonderFee,
    requiredLiquidity
  }
}

export default useSendData
