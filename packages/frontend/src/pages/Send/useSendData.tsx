import { useState, useMemo, useCallback } from 'react'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import Network from 'src/models/Network'
import useDebounceAsync from 'src/hooks/useDebounceAsync'

const useSendData = (
  token: Token | undefined,
  slippageTolerance: number,
  fromNetwork: Network | undefined,
  toNetwork: Network | undefined,
  fromAmount: BigNumber | undefined
) => {
  const { sdk, settings } = useApp()

  const [amountOut, setAmountOut] = useState<BigNumber>()
  const [rate, setRate] = useState<number | undefined>()
  const [priceImpact, setPriceImpact] = useState<number | undefined>()
  const [lpFees, setLpFees] = useState<BigNumber>()
  const [adjustedBonderFee, setAdjustedBonderFee] = useState<BigNumber>()
  const [adjustedDestinationTxFee, setAdjustedDestinationTxFee] = useState<BigNumber>()
  const [totalFee, setTotalFee] = useState<BigNumber>()
  const [requiredLiquidity, setRequiredLiquidity] = useState<BigNumber>()
  const [estimatedReceived, setEstimatedReceived] = useState<BigNumber>()
  const [error, setError] = useState<string | undefined>()

  const updateSendData = useCallback(
    async (isCancelled: () => boolean) => {
      try {
        setError(undefined)
        setAmountOut(undefined)
        setRate(undefined)
        setPriceImpact(undefined)
        setLpFees(undefined)
        setAdjustedBonderFee(undefined)
        setAdjustedDestinationTxFee(undefined)
        setTotalFee(undefined)
        setRequiredLiquidity(undefined)
        setEstimatedReceived(undefined)
        if (!(token && fromNetwork && toNetwork && fromAmount)) {
          return
        }

        const bridge = sdk.bridge(token?.symbol)
        const sendData = await bridge.getSendData(fromAmount, fromNetwork.slug, toNetwork.slug)

        if (isCancelled()) return

        setAmountOut(sendData.amountOut as BigNumber)
        setRate(sendData.rate)
        setPriceImpact(sendData.priceImpact)
        setLpFees(sendData.lpFees)
        setAdjustedBonderFee(sendData.adjustedBonderFee)
        setAdjustedDestinationTxFee(sendData.adjustedDestinationTxFee)
        setTotalFee(sendData.totalFee)
        setRequiredLiquidity(sendData.requiredLiquidity as BigNumber)
        setEstimatedReceived(sendData.estimatedReceived)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      }
    },
    [
      token,
      fromNetwork,
      toNetwork,
      fromAmount,
      setAmountOut,
      setRate,
      setPriceImpact,
      setLpFees,
      setAdjustedBonderFee,
      setAdjustedDestinationTxFee,
      setTotalFee,
      setRequiredLiquidity,
    ]
  )

  const loading = useDebounceAsync(updateSendData, 400, 800)

  const amountOutMin = useMemo(() => {
    let _amountOutMin
    if (fromNetwork && toNetwork && amountOut) {
      const slippageToleranceBps = slippageTolerance * 100
      const minBps = Math.ceil(10000 - slippageToleranceBps)
      _amountOutMin = amountOut.mul(minBps).div(10000)
    }

    return _amountOutMin
  }, [fromNetwork, toNetwork, amountOut, slippageTolerance])

  const intermediaryAmountOutMin = useMemo(() => {
    let _intermediaryAmountOutMin
    if (fromNetwork && toNetwork && requiredLiquidity) {
      const slippageToleranceBps = slippageTolerance * 100
      const minBps = Math.ceil(10000 - slippageToleranceBps)
      _intermediaryAmountOutMin = requiredLiquidity.mul(minBps).div(10000)
    }

    return _intermediaryAmountOutMin
  }, [fromNetwork, toNetwork, requiredLiquidity, slippageTolerance])

  return {
    amountOut,
    rate,
    priceImpact,
    amountOutMin,
    intermediaryAmountOutMin,
    lpFees,
    adjustedBonderFee,
    adjustedDestinationTxFee,
    totalFee,
    requiredLiquidity,
    loading,
    estimatedReceived,
    error,
  }
}

export default useSendData
