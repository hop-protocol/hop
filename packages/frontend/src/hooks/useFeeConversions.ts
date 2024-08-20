import { BigNumber } from 'ethers'
import { toTokenDisplay, toUsdDisplay } from '#utils/index.js'
import { useMemo } from 'react'
import { useTokenPrice } from '#hooks/useTokenPrice.js'

type Input = {
  destinationTxFee?: BigNumber
  bonderFee?: BigNumber
  estimatedReceived?: BigNumber,
  feeToken?: any
  destToken?: any
  relayFee?: BigNumber // message relay fee
  feeTokenUsdPrice?: number
  destTokenUsdPrice?: number
}

export function getConvertedFees(input: Input) {
  let { destinationTxFee, bonderFee, estimatedReceived, feeToken, destToken, feeTokenUsdPrice, destTokenUsdPrice, relayFee: relayFeeEth } = input
  if (!feeToken) {
    feeToken = destToken
  }
  if (!feeTokenUsdPrice) {
    feeTokenUsdPrice = destTokenUsdPrice
  }

  const destTokenSymbol = destToken?.symbol ?? ''
  const destTokenDecimals = destToken?.decimals

  const feeTokenSymbol = feeToken?.symbol ?? ''
  const feeTokenDecimals = feeToken?.decimals

  // Base -> converted values (displayed to user)
  const destinationTxFeeDisplay = toTokenDisplay(
    destinationTxFee,
    feeTokenDecimals,
    feeTokenSymbol,
  )

  const destinationTxFeeUsdDisplay = toUsdDisplay(destinationTxFee, feeTokenDecimals, feeTokenUsdPrice)

  const bonderFeeDisplay = toTokenDisplay(bonderFee, feeTokenDecimals, feeTokenSymbol)
  const bonderFeeUsdDisplay = toUsdDisplay(bonderFee, feeTokenDecimals, feeTokenUsdPrice)

  const totalBonderFee = destinationTxFee && bonderFee ? destinationTxFee.add(bonderFee) : (destinationTxFee ? destinationTxFee : bonderFee)
  const totalBonderFeeDisplay = toTokenDisplay(
    totalBonderFee,
    feeTokenDecimals,
    feeTokenSymbol
  )

  const totalBonderFeeUsdDisplay = toUsdDisplay(totalBonderFee, feeTokenDecimals, feeTokenUsdPrice)

  const estimatedReceivedDisplay = toTokenDisplay(
    estimatedReceived,
    destTokenDecimals,
    destTokenSymbol
  )

  const estimatedReceivedUsdDisplay = toUsdDisplay(estimatedReceived, destTokenDecimals, destTokenUsdPrice)

  const relayFeeEthDisplay = relayFeeEth?.gt(0) ? toTokenDisplay(
    relayFeeEth,
    18,
    'ETH'
  ) : ''

  const relayFeeUsdDisplay = relayFeeEth?.gt(0) ? toUsdDisplay(relayFeeEth, 18, feeTokenUsdPrice) : ''
  const totalFee = feeTokenSymbol === 'ETH' ? totalBonderFee?.add(relayFeeEth ?? 0) : totalBonderFee
  const totalFeeDisplay = toTokenDisplay(totalFee, feeTokenDecimals, feeTokenSymbol)
  const totalFeeUsdDisplay = toUsdDisplay(totalFee, feeTokenDecimals, feeTokenUsdPrice)

  return {
    destinationTxFeeDisplay,
    destinationTxFeeUsdDisplay,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    totalBonderFee,
    totalBonderFeeDisplay,
    totalBonderFeeUsdDisplay,
    totalFee,
    totalFeeDisplay,
    totalFeeUsdDisplay,
    estimatedReceivedDisplay,
    estimatedReceivedUsdDisplay,
    tokenUsdPrice: destTokenUsdPrice,
    relayFeeEthDisplay,
    relayFeeUsdDisplay,
  }
}

export function useFeeConversions(input: Input) {
  const {
    destinationTxFee,
    bonderFee,
    estimatedReceived,
    feeToken,
    destToken,
    relayFee
  } = input
  const { priceUsd: destTokenUsdPrice } = useTokenPrice(destToken?.symbol)
  let feeTokenUsdPrice :any
  if (feeToken) {
    ({ priceUsd: feeTokenUsdPrice } = useTokenPrice(feeToken?.symbol))
  }

  const convertedFees = useMemo(() => {
    return getConvertedFees({ destinationTxFee, bonderFee, estimatedReceived, feeToken, destToken, feeTokenUsdPrice, destTokenUsdPrice, relayFee })
  }, [destinationTxFee, bonderFee, estimatedReceived, feeToken, destToken])

  return convertedFees
}
