import { Token } from '@hop-protocol/sdk'
import { BigNumber, utils } from 'ethers'
import { useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Chain from 'src/models/Chain'
import { commafy, toTokenDisplay } from 'src/utils'
import { UnsupportedAsset } from './useAssets'
import { useFeeConversions } from './useFeeConversions'

interface InfoMessagesProps {
  sourceChain?: Chain
  destinationChain?: Chain
  destinationToken?: Token
  amountOut?: BigNumber
  amountOutMin?: BigNumber
  unsupportedAsset?: UnsupportedAsset | null
  customRecipient?: string
  estimatedReceived?: BigNumber
  adjustedDestinationTxFee?: BigNumber
  adjustedBonderFee?: BigNumber
  sendDataError?: unknown
  sourceToken?: Token
  sourceTokenAmount?: BigNumber
}

export function useDisplayedAmounts(props: InfoMessagesProps) {
  const {
    sourceChain,
    destinationChain,
    destinationToken,
    amountOut,
    amountOutMin,
    unsupportedAsset,
    customRecipient,
    estimatedReceived,
    adjustedDestinationTxFee,
    sendDataError,
    adjustedBonderFee,
    sourceToken,
    sourceTokenAmount,
  } = props

  const [destinationAmount, setDestinationAmount] = useState<string>()
  const [amountOutMinDisplay, setAmountOutMinDisplay] = useState<string>()
  const { checkConnectedNetworkId, address } = useWeb3Context()

  // Set destination amount (displayed)
  useEffect(() => {
    if (!destinationToken) {
      setDestinationAmount('')
      return
    }

    let amount
    if (amountOut) {
      amount = toTokenDisplay(amountOut, destinationToken.decimals)
    }
    setDestinationAmount(amount)
  }, [destinationToken, amountOut])

  // Set minimum amount out (displayed)
  useEffect(() => {
    if (!amountOutMin || !destinationToken) {
      setAmountOutMinDisplay(undefined)
      return
    }
    let _amountOutMin = amountOutMin
    if (adjustedDestinationTxFee?.gt(0)) {
      _amountOutMin = _amountOutMin.sub(adjustedDestinationTxFee)
    }

    if (_amountOutMin.lt(0)) {
      _amountOutMin = BigNumber.from(0)
    }

    const amountOutMinFormatted = commafy(
      utils.formatUnits(_amountOutMin, destinationToken.decimals),
      4
    )
    setAmountOutMinDisplay(`${amountOutMinFormatted} ${destinationToken.symbol}`)
  }, [amountOutMin])

  // Convert fees to displayed values
  const {
    destinationTxFeeDisplay,
    bonderFeeDisplay,
    totalBonderFeeDisplay,
    estimatedReceivedDisplay,
  } = useFeeConversions(
    adjustedDestinationTxFee,
    adjustedBonderFee,
    estimatedReceived,
    destinationToken
  )

  return {
    destinationAmount,
    setDestinationAmount,
    amountOutMinDisplay,
    destinationTxFeeDisplay,
    bonderFeeDisplay,
    totalBonderFeeDisplay,
    estimatedReceivedDisplay,
  }
}
