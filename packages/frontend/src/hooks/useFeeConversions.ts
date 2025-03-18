import { BigNumber } from 'ethers'
import { toTokenDisplay, toUsdDisplay, toUsd } from '#utils/index.js'
import { useMemo } from 'react'
import { useTokenPrice } from '#hooks/useTokenPrice.js'

type Input = {
  destinationTxFee?: BigNumber
  bonderFee?: BigNumber
  estimatedReceived?: BigNumber,
  destToken?: any
  relayFee?: BigNumber // message relay fee
  tokenUsdPrice?: number
}

export function getConvertedFees(input: Input) {
  const { destinationTxFee, bonderFee, estimatedReceived, destToken, tokenUsdPrice, relayFee: relayFeeEth } = input
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

  const estimatedReceivedUsd = estimatedReceived?.gt(0) ? toUsd(estimatedReceived, tokenDecimals, tokenUsdPrice) : 0
  const estimatedReceivedUsdDisplay = toUsdDisplay(estimatedReceived, tokenDecimals, tokenUsdPrice)

  const relayFeeEthDisplay = relayFeeEth?.gt(0) ? toTokenDisplay(
    relayFeeEth,
    18,
    'ETH'
  ) : ''

  const relayFeeUsdDisplay = relayFeeEth?.gt(0) ? toUsdDisplay(relayFeeEth, 18, tokenUsdPrice) : ''
  const totalFee = tokenSymbol === 'ETH' ? totalBonderFee?.add(relayFeeEth ?? 0) : totalBonderFee
  const totalFeeDisplay = toTokenDisplay(totalFee, tokenDecimals, tokenSymbol)
  const totalFeeUsd = toUsd(totalFee, tokenDecimals, tokenUsdPrice)
  const totalFeeUsdDisplay = toUsdDisplay(totalFee, tokenDecimals, tokenUsdPrice)

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
    totalFeeUsd,
    totalFeeUsdDisplay,
    estimatedReceivedDisplay,
    estimatedReceivedUsd,
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