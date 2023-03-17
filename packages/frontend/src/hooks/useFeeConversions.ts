import { BigNumber } from 'ethers'
import { toTokenDisplay, toUsdDisplay } from 'src/utils'
import { useMemo } from 'react'
import { useTokenPrice } from 'src/hooks/useTokenPrice'

type Input = {
  destinationTxFee?: BigNumber
  bonderFee?: BigNumber
  estimatedReceived?: BigNumber,
  destToken?: any
  relayFee?: BigNumber
  tokenUsdPrice?: number
}

export function getConvertedFees(input: Input) {
  const { destinationTxFee, bonderFee, estimatedReceived, destToken, tokenUsdPrice, relayFee } = input
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

  const relayFeeEthDisplay = relayFee?.gt(0) ? toTokenDisplay(
    relayFee,
    18,
    'ETH'
  ) : ''

  const relayFeeUsdDisplay = relayFee?.gt(0) ? toUsdDisplay(relayFee, 18, tokenUsdPrice) : ''

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
    tokenUsdPrice,
    relayFeeEthDisplay,
    relayFeeUsdDisplay,
  }
}

export function useFeeConversions(input: Input) {
  const {
    destinationTxFee,
    bonderFee,
    estimatedReceived,
    destToken,
    relayFee
  } = input
  const { priceUsd: tokenUsdPrice } = useTokenPrice(destToken?.symbol)

  const convertedFees = useMemo(() => {
    return getConvertedFees({ destinationTxFee, bonderFee, estimatedReceived, destToken, tokenUsdPrice, relayFee })
  }, [destinationTxFee, bonderFee, estimatedReceived, destToken])

  return convertedFees
}
