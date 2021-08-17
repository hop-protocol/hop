import { useState, useEffect, useMemo, useCallback } from 'react'
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
  const { sdk } = useApp()

  const [amountOut, setAmountOut] = useState<BigNumber>()
  const [rate, setRate] = useState<number | undefined>()
  const [priceImpact, setPriceImpact] = useState<number | undefined>()
  const [bonderFee, setBonderFee] = useState<BigNumber>()
  const [lpFees, setLpFees] = useState<BigNumber>()
  const [requiredLiquidity, setRequiredLiquidity] = useState<BigNumber>()
  const [l1Fee, setL1Fee] = useState<BigNumber>()
  const [estimatedReceived, setEstimatedReceived] = useState<BigNumber>()

  const updateSendData = useCallback(
    async (isCancelled: () => boolean) => {
      if (!token) return 0
      if (!fromNetwork) return 0
      if (!toNetwork) return 0
      if (!fromAmount) return 0

      const bridge = sdk.bridge(token?.symbol)
      const sendData = await bridge.getSendData(fromAmount, fromNetwork.slug, toNetwork.slug)

      if (isCancelled()) return

      setAmountOut(sendData.amountOut as BigNumber)
      setRate(sendData.rate)
      setPriceImpact(sendData.priceImpact)
      setBonderFee(sendData.bonderFee)
      setLpFees(sendData.lpFees)
      setRequiredLiquidity(sendData.requiredLiquidity as BigNumber)
      setL1Fee(sendData.l1Fee)
      setEstimatedReceived(sendData.estimatedReceived)
    },
    [
      token,
      fromNetwork,
      toNetwork,
      fromAmount,
      setAmountOut,
      setRate,
      setPriceImpact,
      setBonderFee,
      setLpFees,
      setRequiredLiquidity
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
  }, [fromNetwork, toNetwork, amountOut, slippageTolerance, l1Fee])

  const intermediaryAmountOutMin = useMemo(() => {
    let _intermediaryAmountOutMin
    if (fromNetwork && toNetwork && requiredLiquidity) {
      const slippageToleranceBps = slippageTolerance * 100
      const minBps = Math.ceil(10000 - slippageToleranceBps)
      _intermediaryAmountOutMin = requiredLiquidity.mul(minBps).div(10000)
    }

    return _intermediaryAmountOutMin
  }, [fromNetwork, toNetwork, requiredLiquidity, slippageTolerance, l1Fee])

  return {
    amountOut,
    rate,
    priceImpact,
    amountOutMin,
    intermediaryAmountOutMin,
    bonderFee,
    lpFees,
    requiredLiquidity,
    loading,
    l1Fee,
    estimatedReceived
  }
}

export default useSendData
