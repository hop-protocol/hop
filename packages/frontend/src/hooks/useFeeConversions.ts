import { toTokenDisplay } from 'src/utils'
import { useMemo } from 'react'

export function useFeeConversions(destinationTxFee, bonderFee, estimatedReceived, destToken) {
  const convertedFees = useMemo(() => {
    // Base -> converted values (displayed to user)
    const destinationTxFeeDisplay = toTokenDisplay(
      destinationTxFee,
      destToken?.decimals,
      destToken?.symbol
    )
    const bonderFeeDisplay = toTokenDisplay(bonderFee, destToken?.decimals, destToken?.symbol)
    const totalBonderFee =
      destinationTxFee && bonderFee ? destinationTxFee.add(bonderFee) : destinationTxFee
    const totalBonderFeeDisplay = toTokenDisplay(
      totalBonderFee,
      destToken?.decimals,
      destToken?.symbol
    )
    const estimatedReceivedDisplay = toTokenDisplay(
      estimatedReceived,
      destToken?.decimals,
      destToken?.symbol
    )

    return {
      destinationTxFeeDisplay,
      bonderFeeDisplay,
      totalBonderFee,
      totalBonderFeeDisplay,
      estimatedReceivedDisplay,
    }
  }, [destinationTxFee, bonderFee, estimatedReceived, destToken])

  return convertedFees
}
