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

export function getConvertedFeesV2(input: Input) {
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
  const destinationTxFeeDisplay = destinationTxFee ? toTokenDisplay(
    destinationTxFee,
    feeTokenDecimals,
    feeTokenSymbol,
  ) : ''

  const destinationTxFeeUsdDisplay = destinationTxFee ? toUsdDisplay(destinationTxFee, feeTokenDecimals, feeTokenUsdPrice) : ''

  const bonderFeeDisplay = bonderFee ? toTokenDisplay(bonderFee, destTokenDecimals, destTokenSymbol) : ''
  const bonderFeeUsdDisplay = bonderFee ? toUsdDisplay(bonderFee, destTokenDecimals, destTokenUsdPrice) : ''

  const totalBonderFee = bonderFee
  const totalBonderFeeDisplay = toTokenDisplay(
    totalBonderFee,
    destTokenDecimals,
    destTokenSymbol
  )

  const totalBonderFeeUsdDisplay = toUsdDisplay(totalBonderFee, destTokenDecimals, destTokenUsdPrice)

  const estimatedReceivedDisplay = toTokenDisplay(
    estimatedReceived,
    destTokenDecimals,
    destTokenSymbol
  )

  const estimatedReceivedUsdDisplay = toUsdDisplay(estimatedReceived, destTokenDecimals, destTokenUsdPrice)

  const relayFeeEthDisplay = relayFeeEth ? toTokenDisplay(
    relayFeeEth,
    18,
    'ETH'
  ) : ''

  const relayFeeUsdDisplay = relayFeeEth ? toUsdDisplay(relayFeeEth, 18, feeTokenUsdPrice) : ''
  const totalFee = totalBonderFee
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

export function useFeeConversionsV2(input: Input) {
  const {
    destinationTxFee,
    bonderFee,
    estimatedReceived,
    feeToken,
    destToken,
    relayFee
  } = input
  const { priceUsd: destTokenUsdPrice } = useTokenPrice(destToken?.symbol)
  const { priceUsd: feeTokenUsdPrice } = useTokenPrice(feeToken?.symbol)

  const convertedFees = useMemo(() => {
    return getConvertedFeesV2({ destinationTxFee, bonderFee, estimatedReceived, feeToken, destToken, feeTokenUsdPrice, destTokenUsdPrice, relayFee })
  }, [destinationTxFee, bonderFee, estimatedReceived, feeToken, destToken])

  return convertedFees
}
