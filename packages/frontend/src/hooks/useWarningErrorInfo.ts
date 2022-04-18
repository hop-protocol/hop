import { ChainSlug } from '@hop-protocol/sdk'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import Chain from 'src/models/Chain'
import { formatError } from 'src/utils'
import { UnsupportedAsset } from './useAssets'

interface InfoMessagesProps {
  sourceChain?: Chain
  destinationChain?: Chain
  unsupportedAsset?: UnsupportedAsset | null
  customRecipient?: string
  destinationTxFeeDisplay?: string
  estimatedReceived?: BigNumber
  adjustedDestinationTxFee?: BigNumber
  adjustedBonderFee?: BigNumber
  sendDataError?: unknown
  liquidityWarning?: string
  sufficientBalanceWarning?: string
  priceImpact?: number
  sourceTokenAmount?: string
  destinationAmount?: string
}

export function useWarningErrorInfo(props: InfoMessagesProps) {
  const {
    sourceChain,
    destinationChain,
    unsupportedAsset,
    customRecipient,
    destinationTxFeeDisplay,
    estimatedReceived,
    adjustedDestinationTxFee,
    sendDataError,
    // adjustedBonderFee,
    // liquidityWarning,
    // sufficientBalanceWarning,
    // priceImpact,
    // sourceTokenAmount,
    // destinationAmount,
  } = props

  const [warning, setWarning] = useState<any>(null)
  const [error, setError] = useState<string | null | undefined>(null)
  const [manualWarning, setManualWarning] = useState<string>('')
  const [manualError, setManualError] = useState<string>('')
  const [minimumSendWarning, setMinimumSendWarning] = useState<string | null | undefined>(null)
  const [info, setInfo] = useState<string | null | undefined>(null)
  const { address } = useWeb3Context()

  // Reset error message when sourceChain/destinationChain changes
  useEffect(() => {
    if (warning) setWarning('')
    if (error) setError('')
  }, [sourceChain, destinationChain])

  // Set error message if asset is unsupported
  useEffect(() => {
    if (unsupportedAsset) {
      const { chain, tokenSymbol } = unsupportedAsset
      setError(`${tokenSymbol} is currently not supported on ${chain}`)
    } else if (error) {
      setError('')
    }
  }, [unsupportedAsset])

  useEffect(() => {
    const warningMessage = `Send at least ${destinationTxFeeDisplay} to cover the transaction fee`
    if (estimatedReceived?.lte(0) && adjustedDestinationTxFee?.gt(0)) {
      setMinimumSendWarning(warningMessage)
    } else if (minimumSendWarning) {
      setMinimumSendWarning('')
    }
  }, [estimatedReceived, adjustedDestinationTxFee])

  useEffect(() => {
    if (
      destinationChain?.slug === ChainSlug.Arbitrum &&
      customRecipient &&
      !address?.eq(customRecipient)
    ) {
      return setManualWarning(
        'Warning: transfers to exchanges that do not support internal transactions may result in lost funds.'
      )
    }
    setManualWarning('')
  }, [sourceChain?.slug, destinationChain?.slug, customRecipient, address])

  useEffect(() => {
    // if (sourceChain?.slug === ChainSlug.Polygon || destinationChain?.slug === ChainSlug.Polygon) {
    //   return setManualError('Warning: transfers to/from Polygon are temporarily down.')
    // }
    // setManualError('')
  }, [sourceChain?.slug, destinationChain?.slug])

  useEffect(() => {
    setError(formatError(sendDataError))
  }, [sendDataError])

  return {
    warning,
    setWarning,
    error,
    setError,
    manualWarning,
    manualError,
    minimumSendWarning,
    info,
    setInfo,
  }
}
