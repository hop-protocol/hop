import React, { useMemo, useState, useEffect } from 'react'
import { Hop } from '@hop-protocol/v2-sdk'
import { utils } from 'ethers'
import { usePathname } from 'next/navigation'
import { useEvents } from './useEvents'
import { networkSlug } from '@/app/config'
import PendingIcon from '@mui/icons-material/Pending'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'

const { formatUnits, formatEther } = utils

export const useTransferDetails = (props: any) => {
  const { initialEventDetails } = props
  const pathname = usePathname()
  const parts = pathname.split('/')
  const transferId = parts[2]
  const sdk = useMemo(() => new Hop({
    signersOrProviders: Hop.getDefaultProviders(networkSlug)
  }), [])
  const formatDisplay = (value: string, decimals: number, symbol: string) => {
    if (value == null) return null

    const unit = decimals === 9 ? 'gwei' : symbol
    const formattedValue = formatUnits(value, decimals)
    const weiLabel = decimals === 9 ? ' wei' : ''

    return `${value}${weiLabel} (${formattedValue} ${unit ?? ''})`
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

  const lastBondedEvent = event?.transferBondedEvents?.[event?.transferBondedEvents?.length - 1]
  const token = event?.token
  const context = event?.context
  const tokenDecimals = token?.decimals
  const tokenSymbol = token?.symbol
  const tokenName = token?.name
  const isBonded = !!lastBondedEvent
  const counterpartToken = event?.counterpartToken
  const transferAmount = event?.amount
  const transferAmountDisplay = `${event?.amount ?? ''} (${event?.amountDisplay ?? ''}) (${event?.amountUsdDisplay ?? ''})`
  const sourcePool = event?.sourcePool
  const sourcePoolDisplay = event?.sourcePool
  const transferRecipient = event?.to
  const transferRecipientExplorerUrl = event?.toExplorerUrl
  const pathId = event?.pathId
  const hops = event?.hops?.map((hop: any) => {
    const maxBonderFeeDisplay = `${hop?.maxBonderFee} (${hop?.maxBonderFeeDisplay}) (${hop?.maxBonderFeeUsdDisplay})`
    const maxTotalSentDisplay = `${hop?.maxTotalSent} (${hop?.maxTotalSentDisplay}) (${hop?.maxTotalSentUsdDisplay})`
    return {
      ...hop,
      maxBonderFeeDisplay,
      maxTotalSentDisplay,
      token: token
    }
  })

  const sourceTokenAddress = token?.address
  const sourceTokenDisplay = tokenName && tokenSymbol ? `${tokenName} (${tokenSymbol})` : null
  const sourceTokenExplorerUrl = token?.tokenExplorerUrl
  const sourceTokenImageUrl = token?.imageUrl

  const sourceTx = {
    value: context?.value,
    valueDisplay: `${context?.value ?? ''} (${context?.valueDisplay ?? ''}) (${context?.valueUsdDisplay ?? ''})`,
    transactionHash: context?.transactionHash,
    transactionExplorerUrl: context?.transactionHashExplorerUrl,
    gasLimit: context?.gasLimit,
    nonce: context?.nonce,
    gasUsed: context?.gasUsed,
    gasPrice: context?.gasPrice,
    gasPriceDisplay: formatDisplay(context?.gasPrice, 9, 'gwei'),
    status: context?.status?.toString() ?? '-',
    statusDisplay:
      context?.status != null
        ? `${context?.status?.toString()} (${context?.status?.toString() === '1' ? 'Success' : context?.status?.toString() === '0' ? 'Failure' : 'Unknown'})`
        : null,
    from: context?.from,
    chainId: context?.chainId,
    chainDisplay: context?.chainLabel,
    chainImageUrl: context?.chainImageUrl,
    fromExplorerUrl: context?.from && context?.chainId ? sdk.utils.getAddressExplorerUrl(context.from, context.chainId) : '',
    to: context?.to,
    toExplorerUrl: context?.to && context?.chainId ? sdk.utils.getAddressExplorerUrl(context.to, context.chainId) : '',
    blockTimestamp: context?.blockTimestamp,
    blockTimestampRelative: context?.blockTimestampRelative,
    timestampDisplay:
      context?.blockTimestamp
        ? `${context?.blockTimestamp} ${context?.blockTimestampRelative ? `(${context?.blockTimestampRelative})` : ''}`
        : null,
    blockNumber: context?.blockNumber,
    data: context?.data,
    dataDecoded: context?.dataDecoded,
    tokenAddress: token?.address,
    tokenDisplay: tokenName && tokenSymbol ? `${tokenName} (${tokenSymbol})` : null,
    tokenExplorerUrl: token?.tokenExplorerUrl,
  }

  const destinationChainDisplay = event?.toChainLabel
  const destinationChainImageUrl = event?.toChainImageUrl

  const destinationTxs = event?.transferBondedEvents?.map((bondedEvent: any) => {
    const destinationContext = bondedEvent?.context

    // Utility function to format and return transformed fields
    const formatField = (field: any, formatter: (value: any) => string | null = (x) => x) => formatter(field)

    return {
      data: destinationContext?.data,
      dataDecoded: destinationContext?.dataDecoded,
      blockTimestamp: destinationContext?.blockTimestamp,
      blockTimestampRelative: destinationContext?.blockTimestampRelative,
      timestampDisplay: formatField(destinationContext?.blockTimestamp, (timestamp) =>
        timestamp
          ? `${timestamp} ${
              destinationContext?.blockTimestampRelative
                ? `(${destinationContext.blockTimestampRelative})`
                : ''
            }`
          : null
      ),
      status: destinationContext?.status?.toString() ?? '-',
      statusDisplay: formatField(destinationContext?.status.toString(), (status) =>
        status !== '-' ? `${status} (${status === '1' ? 'Success' : status === '0' ? 'Failure' : 'Unknown'})` : null
      ),
      value: destinationContext?.value,
      valueDisplay: formatField(destinationContext, (ctx) =>
        ctx
          ? `${ctx.value} (${ctx.valueDisplay}) (${ctx.valueUsdDisplay})`
          : null
      ),
      gasLimit: destinationContext?.gasLimit,
      gasUsed: destinationContext?.gasUsed,
      gasPrice: destinationContext?.gasPrice,
      gasPriceDisplay: formatDisplay(destinationContext?.gasPrice, 9, 'gwei'),
      nonce: destinationContext?.nonce,
      blockNumber: destinationContext?.blockNumber,
      fromDisplay: destinationContext?.from,
      fromExplorerUrl: destinationContext?.fromExplorerUrl,
      txTo: destinationContext?.to,
      txToExplorerUrl: destinationContext?.toExplorerUrl,
      tokenAddress: counterpartToken?.address,
      tokenDisplay: counterpartToken ? `${tokenName} (${tokenSymbol})` : null,
      claimId: bondedEvent?.claimId,
      chainDisplay: destinationContext?.chainLabel,
      chainImageUrl: destinationContext?.chainImageUrl,
      amountDisplay: bondedEvent
        ? `${bondedEvent.amount} (${bondedEvent.amountDisplay}) (${bondedEvent.amountUsdDisplay})`
        : null,
      bonderFeeDisplay: bondedEvent
        ? `${bondedEvent.bonderFee} (${bondedEvent.bonderFeeDisplay}) (${bondedEvent.bonderFeeUsdDisplay})`
        : null,
      to: bondedEvent?.to,
      toExplorerUrl: bondedEvent?.toExplorerUrl,
      pathId: bondedEvent?.pathId,
      transactionHash: destinationContext?.transactionHash,
      transactionExplorerUrl: destinationContext?.transactionHashExplorerUrl,
      tokenExplorerUrl: counterpartToken?.tokenExplorerUrl,
    }
  })

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
    tokenName,
    tokenSymbol,
    transferAmount,
    transferAmountDisplay,
    sourcePool,
    sourcePoolDisplay,
    transferRecipient,
    transferRecipientExplorerUrl,
    pathId,
    sourceTx,
    sourceTokenAddress,
    sourceTokenDisplay,
    sourceTokenExplorerUrl,
    sourceTokenImageUrl,
    destinationChainDisplay,
    destinationChainImageUrl,
    loading,
    hops,
    destinationTxs
  }
}
