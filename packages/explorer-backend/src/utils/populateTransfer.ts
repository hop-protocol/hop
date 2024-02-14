import { DateTime } from 'luxon'
import { chainIdToSlug } from './chainIdToSlug'
import { chainSlugToId } from './chainSlugToId'
import { chainSlugToName } from './chainSlugToName'
import { explorerLinkAddress } from './explorerLinkAddress'
import { explorerLinkTx } from './explorerLinkTx'
import { formatCurrency } from './formatCurrency'
import { formatUnits } from 'ethers/lib/utils'
import { getChainLogo } from './getChainLogo'
import { getTokenDecimals } from './getTokenDecimals'
import { getTokenLogo } from './getTokenLogo'
import { isGoerli } from '../config'
import { nearestDate } from './nearestDate'
import { truncateAddress } from './truncateAddress'
import { truncateHash } from './truncateHash'

export function populateTransfer (item: any, prices?: Record<string, any>) {
  if (typeof item.timestamp !== 'number') {
    item.timestamp = Number(item.timestamp)
  }

  if (typeof item.bondTimestamp !== 'number') {
    item.bondTimestamp = Number(item.bondTimestamp)
  }

  if (!item.accountAddress && item.from) {
    item.accountAddress = item.from?.toLowerCase()
  }

  if (!item.accountAddressTruncated && item.accountAddress) {
    item.accountAddressTruncated = truncateAddress(item.accountAddress)
  }

  if (!item.recipientAddressExplorerUrl && item.recipientAddress && item.destinationChainSlug) {
    item.recipientAddressExplorerUrl = explorerLinkAddress(item.destinationChainSlug, item.recipientAddress)
  }

  if (!item.transactionHashTruncated && item.transactionHash) {
    item.transactionHashTruncated = truncateHash(item.transactionHash)
  }

  const transferTime = item.timestamp ? DateTime.fromSeconds(item.timestamp) : null
  if (!item.transferIdTruncated && item.transferId) {
    item.transferIdTruncated = truncateHash(item.transferId)
  }
  if (!item.timestampIso && transferTime) {
    item.timestampIso = transferTime.toISO()
  }
  if (!item.relativeTimestamp && transferTime) {
    item.relativeTimestamp = transferTime.toRelative()
  }

  if (!item.sourceChainId && item.sourceChain) {
    item.sourceChainId = item.sourceChain
  }

  if (!item.destinationChainId && item.destinationChain) {
    item.destinationChainId = item.destinationChain
  }

  if (!item.sourceChainSlug && item.sourceChain) {
    item.sourceChainSlug = chainIdToSlug(item.sourceChain)
  }
  if (!item.sourceChainSlug && item.sourceChainId) {
    item.sourceChainSlug = chainIdToSlug(item.sourceChainId)
  }

  if (!item.destinationChainSlug && item.destinationChain) {
    item.destinationChainSlug = chainIdToSlug(item.destinationChain)
  }
  if (!item.destinationChainSlug && item.destinationChainId) {
    item.destinationChainSlug = chainIdToSlug(item.destinationChainId)
  }

  if (!item.sourceChainName && item.sourceChainSlug) {
    item.sourceChainName = chainSlugToName(item.sourceChainSlug)
  }

  if (!item.destinationChainName && item.destinationChainSlug) {
    item.destinationChainName = chainSlugToName(item.destinationChainSlug)
  }

  if (!item.sourceChainImageUrl && item.sourceChainSlug) {
    item.sourceChainImageUrl = getChainLogo(item.sourceChainSlug)
  }
  if (!item.destinationChainImageUrl && item.destinationChainSlug) {
    item.destinationChainImageUrl = getChainLogo(item.destinationChainSlug)
  }

  if (!item.transactionHashExplorerUrl && item.sourceChainSlug && item.transactionHash) {
    item.transactionHashExplorerUrl = explorerLinkTx(item.sourceChainSlug, item.transactionHash)
  }

  if (!item.bondTransactionHashExplorerUrl && item.destinationChainSlug && item.bondTransactionHash) {
    item.bondTransactionHashExplorerUrl = explorerLinkTx(item.destinationChainSlug, item.bondTransactionHash)
  }

  if (item.preregenesis && item.bondTransactionHash) {
    item.bondTransactionHashExplorerUrl = `https://expedition.dev/tx/${item.bondTransactionHash}?rpcUrl=https%3A%2F%2Fmainnet-replica-4.optimism.io`
  }

  if (!item.accountAddressExplorerUrl && item.sourceChainSlug && item.accountAddress) {
    item.accountAddressExplorerUrl = explorerLinkAddress(item.sourceChainSlug, item.accountAddress)
  }

  if (!item.recipientAddress && item.recipient) {
    item.recipientAddress = item.recipient?.toLowerCase()
  }

  if (!item.recipientAddressTruncated && item.recipientAddress) {
    item.recipientAddressTruncated = truncateAddress(item.recipientAddress)
  }

  if (!item.recipientAddressExplorerUrl && item.recipientAddress && item.destinationChainSlug) {
    item.recipientAddressExplorerUrl = explorerLinkAddress(item.destinationChainSlug, item.recipientAddress)
  }

  if (!item.bonderAddress && item.bonder) {
    item.bonderAddress = item.bonder?.toLowerCase()
  }

  if (!item.bonderAddressTruncated && item.bonderAddress) {
    item.bonderAddressTruncated = truncateAddress(item.bonderAddress)
  }

  if (!item.bonderAddressExplorerUrl && item.bonderAddress && item.destinationChainSlug) {
    item.bonderAddressExplorerUrl = explorerLinkAddress(item.destinationChainSlug, item.bonderAddress)
  }

  if (!item.bondTransactionHashTruncated && item.bondTransactionHash) {
    item.bondTransactionHashTruncated = truncateHash(item.bondTransactionHash)
  }

  if (!item.receiveStatusUnknown && transferTime) {
    item.receiveStatusUnknown = item.sourceChainId === chainSlugToId('ethereum') && !item.bondTxExplorerUrl && DateTime.now().toSeconds() > transferTime.toSeconds() + (60 * 60 * 2)
  }
  if (item.receiveStatusUnknown) {
    // these got relayed but db not updated
    if (isGoerli && item.destinationChainSlug === 'arbitrum' && item.timestamp < 1686979675 && item.timestamp > 1686812400) {
      // item.bonded = true
    }
  }

  if (!item.bondTimestamp && item.bondedTimestamp) {
    item.bondTimestamp = item.bondedTimestamp
  }

  if (item.bondTimestamp && transferTime && (!item.bondTimestampIso || !item.relativeBondedTimestamp || !item.bondWithinTimestamp || !item.bondWithinTimestampRelative)) {
    const bondedTime = DateTime.fromSeconds(item.bondTimestamp)
    item.bondTimestampIso = bondedTime.toISO()
    item.relativeBondedTimestamp = bondedTime.toRelative()
    const diff = bondedTime.diff(transferTime, ['days', 'hours', 'minutes'])
    const diffObj = diff.toObject()
    item.bondWithinTimestamp = (((diff.days * 24 * 60) + (diff.hours * 60) + (diff as any).values.minutes) * 60)
    let hours = Number(diffObj?.hours?.toFixed(0))
    let days = Number(diffObj?.days?.toFixed(0))
    let minutes = Number(diffObj?.minutes?.toFixed(0))
    if (hours < 0) {
      hours = 0
    }
    if (minutes < 1) {
      minutes = 1
    }
    if (days < 1) {
      days = 0
    }
    if (hours || minutes) {
      item.bondWithinTimestampRelative = `${days ? `${days} day${days > 1 ? 's' : ''} ` : ''}${hours ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
    }
  }

  const decimals = getTokenDecimals(item.token)
  if (!item.amountFormatted) {
    item.amountFormatted = Number(formatUnits(item.amount, decimals))
  }
  if (!item.amountDisplay) {
    item.amountDisplay = item.amountFormatted.toFixed(4)
  }
  if (!item.bonderFeeFormatted) {
    item.bonderFeeFormatted = item.bonderFee ? Number(formatUnits(item.bonderFee, decimals)) : 0
  }
  if (!item.bonderFeeDisplay) {
    item.bonderFeeDisplay = item.bonderFeeFormatted.toFixed(4)
  }
  if (!item.tokenImageUrl && item.token) {
    item.tokenImageUrl = getTokenLogo(item.token)
  }

  if (!item.amountUsd) {
    item.amountUsd = ''
  }
  if (!item.amountUsdDisplay) {
    item.amountUsdDisplay = ''
  }
  if (!item.tokenPriceUsd) {
    item.tokenPriceUsd = ''
  }
  if (!item.tokenPriceUsdDisplay) {
    item.tokenPriceUsdDisplay = ''
  }
  if (!item.bonderFeeUsd) {
    item.bonderFeeUsd = ''
  }
  if (!item.bonderFeeUsdDisplay) {
    item.bonderFeeUsdDisplay = ''
  }

  if (prices && prices[item.token]) {
    const dates = prices[item.token].reverse().map((x: number[]) => x[0])
    const nearest = nearestDate(dates, item.timestamp)
    if (prices[item.token][nearest]) {
      const price = prices[item.token][nearest][1]
      item.amountUsd = price * item.amountFormatted
      item.amountUsdDisplay = formatCurrency(item.amountUsd, 'USD')
      item.tokenPriceUsd = price
      item.tokenPriceUsdDisplay = formatCurrency(item.tokenPriceUsd, 'USD')
      item.bonderFeeUsd = item.tokenPriceUsd * item.bonderFeeFormatted
      item.bonderFeeUsdDisplay = formatCurrency(item.bonderFeeUsd, 'USD')
    }
  }

  return item
}
