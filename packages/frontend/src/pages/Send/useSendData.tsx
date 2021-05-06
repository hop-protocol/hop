import { useState, useEffect, useRef } from 'react'
import { BigNumber } from 'ethers'
import { useApp } from 'src/contexts/AppContext'
import Token from 'src/models/Token'
import Network from 'src/models/Network'

const useSendData = (
  token: Token,
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
  const debouncer = useRef<number>(0)

  useEffect(() => {
    const update = async () => {
      if (!fromNetwork) return 0
      if (!toNetwork) return 0
      if (!fromAmount) return 0

      const ctx = ++debouncer.current

      const bridge = sdk.bridge(token?.symbol)
      const {
        amountOut: _amountOut,
        rate: _rate,
        priceImpact: _priceImpact,
        bonderFee: _bonderFee,
        requiredLiquidity: _requiredLiquidity
      } = await bridge.getSendData(fromAmount, fromNetwork.slug, toNetwork.slug)

      if (ctx !== debouncer.current) return

      setAmountOut(_amountOut)
      setRate(_rate)
      setPriceImpact(_priceImpact)
      setBonderFee(_bonderFee)
      setRequiredLiquidity(_requiredLiquidity)
    }

    update()
  }, [token, fromNetwork, toNetwork, fromAmount])

  return {
    amountOut,
    rate,
    priceImpact,
    bonderFee,
    requiredLiquidity
  }
}

export default useSendData
