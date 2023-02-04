import { DateTime } from 'luxon'
import { formatUnits } from 'ethers/lib/utils'
import { truncateAddress } from './truncateAddress'
import { truncateHash } from './truncateHash'
import { getTokenDecimals } from './getTokenDecimals'
import { explorerLinkAddress } from './explorerLinkAddress'
import { explorerLinkTx } from './explorerLinkTx'
import { chainIdToSlug } from './chainIdToSlug'
import { chainSlugToName } from './chainSlugToName'
import { getSourceChainId } from './getSourceChainId'
import { getChainLogo } from './getChainLogo'
import { nearestDate } from './nearestDate'
import { getTokenLogo } from './getTokenLogo'
import { formatCurrency } from './formatCurrency'

export function populateTransfer (x: any, prices?: any) {
  if (typeof x.timestamp !== 'number') {
    x.timestamp = Number(x.timestamp)
  }

  if (typeof x.bondTimestamp !== 'number') {
    x.bondTimestamp = Number(x.bondTimestamp)
  }

  if (!x.accountAddress && x.from) {
    x.accountAddress = x.from?.toLowerCase()
  }

  if (!x.accountAddressTruncated && x.accountAddress) {
    x.accountAddressTruncated = truncateAddress(x.accountAddress)
  }

  if (!x.recipientAddressExplorerUrl && x.recipientAddress && x.destinationChainSlug) {
    x.recipientAddressExplorerUrl = explorerLinkAddress(x.destinationChainSlug, x.recipientAddress)
  }

  if (!x.transactionHashTruncated && x.transactionHash) {
    x.transactionHashTruncated = truncateHash(x.transactionHash)
  }

  const transferTime = x.timestamp ? DateTime.fromSeconds(x.timestamp) : null
  if (!x.transferIdTruncated && x.transferId) {
    x.transferIdTruncated = truncateHash(x.transferId)
  }
  if (!x.timestampIso && transferTime) {
    x.timestampIso = transferTime.toISO()
  }
  if (!x.relativeTimestamp && transferTime) {
    x.relativeTimestamp = transferTime.toRelative()
  }

  if (!x.sourceChainId && x.sourceChain) {
    x.sourceChainId = x.sourceChain
  }

  if (!x.destinationChainId && x.destinationChain) {
    x.destinationChainId = x.destinationChain
  }

  if (!x.sourceChainSlug && x.sourceChain) {
    x.sourceChainSlug = chainIdToSlug(x.sourceChain)
  }
  if (!x.sourceChainSlug && x.sourceChainId) {
    x.sourceChainSlug = chainIdToSlug(x.sourceChainId)
  }

  if (!x.destinationChainSlug && x.destinationChain) {
    x.destinationChainSlug = chainIdToSlug(x.destinationChain)
  }
  if (!x.destinationChainSlug && x.destinationChainId) {
    x.destinationChainSlug = chainIdToSlug(x.destinationChainId)
  }

  if (!x.sourceChainName && x.sourceChainSlug) {
    x.sourceChainName = chainSlugToName(x.sourceChainSlug)
  }

  if (!x.destinationChainName && x.destinationChainSlug) {
    x.destinationChainName = chainSlugToName(x.destinationChainSlug)
  }

  if (!x.sourceChainImageUrl && x.sourceChainSlug) {
    x.sourceChainImageUrl = getChainLogo(x.sourceChainSlug)
  }
  if (!x.destinationChainImageUrl && x.destinationChainSlug) {
    x.destinationChainImageUrl = getChainLogo(x.destinationChainSlug)
  }

  if (!x.transactionHashExplorerUrl && x.sourceChainSlug && x.transactionHash) {
    x.transactionHashExplorerUrl = explorerLinkTx(x.sourceChainSlug, x.transactionHash)
  }

  if (!x.bondTransactionHashExplorerUrl && x.destinationChainSlug && x.bondTransactionHash) {
    x.bondTransactionHashExplorerUrl = explorerLinkTx(x.destinationChainSlug, x.bondTransactionHash)
  }

  if (x.preregenesis && x.bondTransactionHash) {
    x.bondTransactionHashExplorerUrl = `https://expedition.dev/tx/${x.bondTransactionHash}?rpcUrl=https%3A%2F%2Fmainnet-replica-4.optimism.io`
  }

  if (!x.accountAddressExplorerUrl && x.sourceChainSlug && x.accountAddress) {
    x.accountAddressExplorerUrl = explorerLinkAddress(x.sourceChainSlug, x.accountAddress)
  }

  if (!x.recipientAddress && x.recipient) {
    x.recipientAddress = x.recipient?.toLowerCase()
  }

  if (!x.recipientAddressTruncated && x.recipientAddress) {
    x.recipientAddressTruncated = truncateAddress(x.recipientAddress)
  }

  if (!x.recipientAddressExplorerUrl && x.recipientAddress && x.destinationChainSlug) {
    x.recipientAddressExplorerUrl = explorerLinkAddress(x.destinationChainSlug, x.recipientAddress)
  }

  if (!x.bonderAddress && x.bonder) {
    x.bonderAddress = x.bonder?.toLowerCase()
  }

  if (!x.bonderAddressTruncated && x.bonderAddress) {
    x.bonderAddressTruncated = truncateAddress(x.bonderAddress)
  }

  if (!x.bonderAddressExplorerUrl && x.bonderAddress && x.destinationChainSlug) {
    x.bonderAddressExplorerUrl = explorerLinkAddress(x.destinationChainSlug, x.bonderAddress)
  }

  if (!x.bondTransactionHashTruncated && x.bondTransactionHash) {
    x.bondTransactionHashTruncated = truncateHash(x.bondTransactionHash)
  }

  if (!x.receiveStatusUnknown && transferTime) {
    x.receiveStatusUnknown = x.sourceChainId === getSourceChainId('ethereum') && !x.bondTxExplorerUrl && DateTime.now().toSeconds() > transferTime.toSeconds() + (60 * 60 * 2)
  }
  if (x.receiveStatusUnknown) {
    // x.bonded = true
  }

  if (!x.bondTimestamp && x.bondedTimestamp) {
    x.bondTimestamp = x.bondedTimestamp
  }

  if (x.bondTimestamp && transferTime) {
    const bondedTime = DateTime.fromSeconds(x.bondTimestamp)
    x.bondTimestampIso = bondedTime.toISO()
    x.relativeBondedTimestamp = bondedTime.toRelative()
    const diff = bondedTime.diff(transferTime, ['days', 'hours', 'minutes'])
    const diffObj = diff.toObject()
    x.bondWithinTimestamp = (((diff.days * 24 * 60) + (diff.hours * 60) + (diff as any).values.minutes) * 60)
    let hours = Number(diffObj.hours.toFixed(0))
    let minutes = Number(diffObj.minutes.toFixed(0))
    if (hours < 0) {
      hours = 0
    }
    if (minutes < 1) {
      minutes = 1
    }
    if (hours || minutes) {
      x.bondWithinTimestampRelative = `${hours ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
    }
  }

  const decimals = getTokenDecimals(x.token)
  if (!x.amountFormatted) {
    x.amountFormatted = Number(formatUnits(x.amount, decimals))
  }
  if (!x.amountDisplay) {
    x.amountDisplay = x.amountFormatted.toFixed(4)
  }
  if (!x.bonderFeeFormatted) {
    x.bonderFeeFormatted = x.bonderFee ? Number(formatUnits(x.bonderFee, decimals)) : 0
  }
  if (!x.bonderFeeDisplay) {
    x.bonderFeeDisplay = x.bonderFeeFormatted.toFixed(4)
  }
  if (!x.tokenImageUrl && x.token) {
    x.tokenImageUrl = getTokenLogo(x.token)
  }

  x.amountUsd = ''
  x.amountUsdDisplay = ''
  x.tokenPriceUsd = ''
  x.tokenPriceUsdDisplay = ''
  x.bonderFeeUsd = ''
  x.bonderFeeUsdDisplay = ''

  if (prices && prices[x.token]) {
    const dates = prices[x.token].reverse().map((x: any) => x[0])
    const nearest = nearestDate(dates, x.timestamp)
    if (prices[x.token][nearest]) {
      const price = prices[x.token][nearest][1]
      x.amountUsd = price * x.amountFormatted
      x.amountUsdDisplay = formatCurrency(x.amountUsd, 'USD')
      x.tokenPriceUsd = price
      x.tokenPriceUsdDisplay = formatCurrency(x.tokenPriceUsd, 'USD')
      x.bonderFeeUsd = x.tokenPriceUsd * x.bonderFeeFormatted
      x.bonderFeeUsdDisplay = formatCurrency(x.bonderFeeUsd, 'USD')
    }
  }

  return x
}
