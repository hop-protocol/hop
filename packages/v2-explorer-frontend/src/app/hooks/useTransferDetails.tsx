import React, { useMemo, useState, useEffect } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { utils } from 'ethers'
import { usePathname } from 'next/navigation'
import { useEvents } from './useEvents'
import { networkSlug } from '../config'
import PendingIcon from '@mui/icons-material/Pending'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'

const { formatUnits, formatEther } = utils

export const useTransferDetails = (props: any) => {
  const { initialEventDetails } = props
  const pathname = usePathname()
  const parts = pathname.split('/')
  const transferId = parts[2]
  const sdk = useMemo(() => new Hop({ network: networkSlug }), [])
  const formatDisplay = (value: string, decimals: number, symbol: string) => {
    if (value == null) return null

    const unit = decimals === 9 ? 'gwei' : symbol
    const formattedValue = formatUnits(value, decimals)
    const weiLabel = decimals === 9 ? ' wei' : ''

    return `${value}${weiLabel} (${formattedValue} ${unit})`
  }

  const filter = { transferId }
  const [isFetching, setIsFetching] = useState(() => {
    return !initialEventDetails
  })
  const { events, loading: eventsFetching } = useEvents('explorer', filter)
  const [event, setEvent] = useState(() => {
    return initialEventDetails ?? null
  })

  const eventDetails = events?.[0]
  useEffect(() => {
    if (eventDetails) {
      setEvent(eventDetails)
      setIsFetching(false)
    }
  }, [eventDetails])

  const bondedEvent = event?.transferBondedEvent
  const token = event?.token
  const context = event?.context
  const destinationContext = event?.transferBondedEvent?.context
  const tokenDecimals = token?.decimals
  const tokenSymbol = token?.symbol
  const tokenName = token?.name
  const isBonded = !!bondedEvent
  const counterpartToken = event?.counterpartToken
  const transferAmount = event?.amount
  const transferAmountDisplay = formatDisplay(transferAmount, tokenDecimals, tokenSymbol)
  const checkpointTotalSent = event?.totalSent
  const checkpointTotalSentDisplay = formatDisplay(checkpointTotalSent, tokenDecimals, tokenSymbol)
  const transferRecipient = event?.to
  const transferRecipientExplorerUrl = event?.toExplorerUrl
  const attestationFee = event?.attestationFee
  const attestationFeeDisplay = formatDisplay(attestationFee, 18, 'ETH')
  const checkpoint = event?.checkpoint
  const transferNonce = event?.nonce
  const pathId = event?.pathId
  const sourceTxValue = context?.value
  const sourceTxValueDisplay = formatDisplay(sourceTxValue, 18 , 'ETH')
  const sourceTxTransactionHash = context?.transactionHash
  const sourceTxTransactionExplorerUrl = context?.transactionHashExplorerUrl
  const sourceTxGasLimit = context?.gasLimit
  const sourceTxNonce = context?.nonce
  const sourceTxGasUsed = context?.gasUsed
  const sourceTxGasPrice = context?.gasPrice
  const sourceTxGasPriceDisplay = formatDisplay(sourceTxGasPrice, 9, 'gwei')
  const sourceTxStatus = context?.status?.toString() ?? '-'
  const sourceTxFrom = context?.from
  const sourceTxChainId = context?.chainId
  const sourceTxChainDisplay = context?.chainLabel
  const sourceTxChainImageUrl = context?.chainImageUrl
  const sourceTxFromExplorerUrl = sourceTxFrom && sourceTxChainId ? sdk.utils.getAddressExplorerUrl(sourceTxFrom, sourceTxChainId) : ''
  const sourceTxTo = context?.to
  const sourceTxToExplorerUrl = sourceTxTo && sourceTxChainId ? sdk.utils.getAddressExplorerUrl(sourceTxTo, sourceTxChainId) : ''
  const sourceTokenAddress = token?.address
  const sourceTokenDisplay = tokenName && tokenSymbol ? `${tokenName} (${tokenSymbol})` : null
  const sourceTokenExplorerUrl = token?.tokenExplorerUrl
  const sourceTxStatusDisplay = sourceTxStatus != null ? `${sourceTxStatus} (${sourceTxStatus === '1' ? 'Success' : sourceTxStatus === '0' ? 'Failure' : 'Unknown'})` : null
  const sourceTxBlockTimestamp = context?.blockTimestamp
  const sourceTxBlockTimestampRelative = context?.blockTimestampRelative
  const sourceTxTimestampDisplay = sourceTxBlockTimestamp ? `${sourceTxBlockTimestamp} ${sourceTxBlockTimestampRelative ? `(${sourceTxBlockTimestampRelative})` : ''}` : null
  const sourceTxBlockNumber = context?.blockNumber
  const sourceTxData = context?.data
  const destinationChainDisplay = event?.toChainLabel
  const destinationChainImageUrl = event?.toChainImageUrl
  const destinationTransactionHash = destinationContext?.transactionHash
  const destinationTransactionExplorerUrl = destinationContext?.transactionHashExplorerUrl
  const destinationAmountOut = bondedEvent?.amountOut
  const destinationAmountOutDisplay = destinationAmountOut ? `${destinationAmountOut} (${formatUnits(destinationAmountOut, tokenDecimals)} ${tokenSymbol})` : null
  const destinationTxFromDisplay = destinationContext?.from
  const destinationTxFromExplorerUrl = destinationContext?.fromExplorerUrl
  const destinationTxToDisplay = destinationContext?.to
  const destinationTxToExplorerUrl = destinationContext?.toExplorerUrl
  const destinationTokenAddress = counterpartToken?.address
  const destinationTokenDisplay = counterpartToken ? `${tokenName} (${tokenSymbol})` : null
  const destinationTokenExplorerUrl = counterpartToken?.tokenExplorerUrl
  const destinationTxData = destinationContext?.data
  const destinationTxBlockTimestamp = destinationContext?.blockTimestamp
  const destinationTxBlockTimestampRelative = destinationContext?.blockTimestampRelative
  const destinationTxTimestampDisplay = destinationTxBlockTimestamp ? `${destinationTxBlockTimestamp} ${destinationTxBlockTimestampRelative ? `(${destinationTxBlockTimestampRelative})` : ''}` : null
  const destinationTxStatus = destinationContext?.status?.toString() ?? '-'
  const destinationTxStatusDisplay = destinationTxStatus != '-' ? `${destinationTxStatus} (${destinationTxStatus === '1' ? 'Success' : destinationTxStatus === '0' ? 'Failure' : 'Unknown'})` : null
  const destinationTxValue = destinationContext?.value
  const destinationTxValueDisplay = formatDisplay(destinationTxValue, 18, 'ETH')
  const destinationTxGasLimit = destinationContext?.gasLimit
  const destinationTxGasUsed = destinationContext?.gasUsed
	const destinationTxGasPrice = destinationContext?.gasPrice
  const destinationTxGasPriceDisplay = formatDisplay(destinationTxGasPrice, 9, 'gwei')
  const destinationTxNonce = destinationContext?.nonce
  const destinationTxBlockNumber = destinationContext?.blockNumber
  const loading = false // !(!isFetching && event)

  const statusDisplay = isBonded ? (
    <Chip icon={<CheckIcon style={{ color: '#fff' }} />} label="Bonded" style={{ backgroundColor: '#74d56e', color: '#fff' }} />
  ) : (
    <Chip icon={<PendingIcon />} label="Pending" color="secondary" />
  )

  return {
    transferId,
    statusDisplay,
    token,
    context,
    destinationContext,
    tokenName,
    tokenSymbol,
    transferAmount,
    transferAmountDisplay,
    checkpointTotalSent,
    checkpointTotalSentDisplay,
    transferRecipient,
    transferRecipientExplorerUrl,
    attestationFeeDisplay,
    checkpoint,
    transferNonce,
    pathId,
    sourceTxValue,
    sourceTxValueDisplay,
    sourceTxTransactionHash,
    sourceTxTransactionExplorerUrl,
    sourceTxGasLimit,
    sourceTxNonce,
    sourceTxGasUsed,
    sourceTxGasPrice,
    sourceTxGasPriceDisplay,
    sourceTxStatus,
    sourceTxFrom,
    sourceTxChainId,
    sourceTxChainDisplay,
    sourceTxChainImageUrl,
    sourceTxFromExplorerUrl,
    sourceTxTo,
    sourceTxToExplorerUrl,
    sourceTokenAddress,
    sourceTokenDisplay,
    sourceTokenExplorerUrl,
    sourceTxStatusDisplay,
    sourceTxBlockTimestamp,
    sourceTxBlockTimestampRelative,
    sourceTxTimestampDisplay,
    sourceTxBlockNumber,
    sourceTxData,
    destinationChainDisplay,
    destinationChainImageUrl,
    destinationTransactionHash,
    destinationTransactionExplorerUrl,
    destinationAmountOutDisplay,
    destinationTxFromDisplay,
    destinationTxFromExplorerUrl,
    destinationTxToDisplay,
    destinationTxToExplorerUrl,
    destinationTokenAddress,
    destinationTokenDisplay,
    destinationTokenExplorerUrl,
    destinationTxData,
    destinationTxStatusDisplay,
    destinationTxValueDisplay,
    destinationTxGasLimit,
    destinationTxGasUsed,
    destinationTxGasPriceDisplay,
    destinationTxNonce,
    destinationTxBlockNumber,
    destinationTxTimestampDisplay,
    loading,
  }
}
