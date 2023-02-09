import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { toTokenDisplay } from 'src/utils'
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

  const destinationTxFeeUsdDisplay = (() => {
    try {
      if (!(tokenUsdPrice && destinationTxFee)) {
        return ''
      }

      return `$${(Number(formatUnits(destinationTxFee?.toString(), tokenDecimals)) * tokenUsdPrice).toFixed(2)}`
    } catch (err) {
      return ''
    }
  })()

  const bonderFeeDisplay = toTokenDisplay(bonderFee, tokenDecimals, tokenSymbol)

  const bonderFeeUsdDisplay = (() => {
    try {
      if (!(tokenUsdPrice && bonderFee)) {
        return ''
      }

      return `$${(Number(formatUnits(bonderFee?.toString(), tokenDecimals)) * tokenUsdPrice).toFixed(2)}`
    } catch (err) {
      return ''
    }
  })()

  const totalBonderFee =
    destinationTxFee && bonderFee ? destinationTxFee.add(bonderFee) : destinationTxFee
  const totalBonderFeeDisplay = toTokenDisplay(
    totalBonderFee,
    tokenDecimals,
    tokenSymbol
  )
  const estimatedReceivedDisplay = toTokenDisplay(
    estimatedReceived,
    tokenDecimals,
    tokenSymbol
  )

  return {
    destinationTxFeeDisplay,
    destinationTxFeeUsdDisplay,
    bonderFeeDisplay,
    bonderFeeUsdDisplay,
    totalBonderFee,
    totalBonderFeeDisplay,
    estimatedReceivedDisplay,
  }
}

export function useFeeConversions(destinationTxFee?: BigNumber, bonderFee?: BigNumber, estimatedReceived?: BigNumber, destToken?: any) {
  const { priceUsd } = useTokenPrice(destToken?.symbol)

  const convertedFees = useMemo(() => {
    return getConvertedFees(destinationTxFee, bonderFee, estimatedReceived, destToken, priceUsd)
  }, [destinationTxFee, bonderFee, estimatedReceived, destToken])

  return convertedFees
}
