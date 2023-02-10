import { BigNumber } from 'ethers'
import { toTokenDisplay, toUsdDisplay } from 'src/utils'
import { useMemo } from 'react'
import { useTokenPrice } from 'src/hooks/useTokenPrice'

export function getConvertedFees(destinationTxFee?: BigNumber, bonderFee?: BigNumber, estimatedReceived?: BigNumber, destToken?: any, tokenUsdPrice?: number) {
  const tokenSymbol = destToken?.symbol
  const tokenDecimals = destToken?.decimals

  // Base -> converted values (displayed to user)
  const destinationTxFeeDisplay = toTokenDisplay(
    destinationTxFee,
    tokenDecimals,
    tokenSymbol,
  )

  const destinationTxFeeUsdDisplay = toUsdDisplay(destinationTxFee, tokenDecimals, tokenUsdPrice)

  const bonderFeeDisplay = toTokenDisplay(bonderFee, tokenDecimals, tokenSymbol)
  const bonderFeeUsdDisplay = toUsdDisplay(bonderFee, tokenDecimals, tokenUsdPrice)

  const totalBonderFee =
    destinationTxFee && bonderFee ? destinationTxFee.add(bonderFee) : destinationTxFee
  const totalBonderFeeDisplay = toTokenDisplay(
    totalBonderFee,
    tokenDecimals,
    tokenSymbol
  )

  const totalBonderFeeUsdDisplay = toUsdDisplay(totalBonderFee, tokenDecimals, tokenUsdPrice)

  const estimatedReceivedDisplay = toTokenDisplay(
    estimatedReceived,
    tokenDecimals,
    tokenSymbol
  )

  const estimatedReceivedUsdDisplay = toUsdDisplay(estimatedReceived, tokenDecimals, tokenUsdPrice)

  return {
    destinationTxFeeDisplay,
    destinationTxFeeUsdDisplay,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    totalBonderFee,
    totalBonderFeeDisplay,
    totalBonderFeeUsdDisplay,
    estimatedReceivedDisplay,
    estimatedReceivedUsdDisplay,
    tokenUsdPrice
  }
}

export function useFeeConversions(destinationTxFee?: BigNumber, bonderFee?: BigNumber, estimatedReceived?: BigNumber, destToken?: any) {
  const { priceUsd } = useTokenPrice(destToken?.symbol)

  const convertedFees = useMemo(() => {
    return getConvertedFees(destinationTxFee, bonderFee, estimatedReceived, destToken, priceUsd)
  }, [destinationTxFee, bonderFee, estimatedReceived, destToken])

  return convertedFees
}
