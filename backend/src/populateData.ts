import { DateTime } from 'luxon'
import { isGoerli, transferTimes } from './config'
import { getColor } from './utils/getColor'
import { truncateAddress } from './utils/truncateAddress'
import { explorerLinkAddress } from './utils/explorerLinkAddress'
import { getSourceChainId } from './utils/getSourceChainId'
import { integrationPartnerName } from './utils/integrationPartnerName'
import { integrationPartnerImage } from './utils/integrationPartnerImage'
import { getTokenDecimals } from './utils/getTokenDecimals'
import { formatUnits } from 'ethers/lib/utils'

export function populateData (x: any, i: number) {
  x.i = i

  if (x.sourceChainId && typeof x.sourceChainId !== 'number') {
    x.sourceChainId = Number(x.sourceChainId)
  }
  if (x.destinationChainId && typeof x.destinationChainId !== 'number') {
    x.destinationChainId = Number(x.destinationChainId)
  }
  if (typeof x.amountFormatted !== 'number') {
    x.amountFormatted = Number(x.amountFormatted)
  }
  if (typeof x.amountUsd !== 'number') {
    x.amountUsd = Number(x.amountUsd)
  }
  x.deadline = x.deadline ? Number(x.deadline) : 0
  x.bonderFeeFormatted = x.bonderFeeFormatted ? Number(x.bonderFeeFormatted) : 0
  x.bonderFeeUsd = x.bonderFeeUsd ? Number(x.bonderFeeUsd) : 0
  x.bondTimestamp = x.bondTimestamp ? Number(x.bondTimestamp) : 0
  x.bondWithinTimestamp = x.bondWithinTimestamp ? Number(x.bondWithinTimestamp) : null
  x.tokenPriceUsd = x.tokenPriceUsd ? Number(x.tokenPriceUsd) : null
  x.timestamp = x.timestamp ? Number(x.timestamp) : null
  if (x.amountReceivedFormatted && typeof x.amountReceivedFormatted !== 'number') {
    x.amountReceivedFormatted = Number(x.amountReceivedFormatted)
  }

  if (x.amountOutMin) {
    x.amountOutMinFormatted = Number(formatUnits(x.amountOutMin, getTokenDecimals(x.token)))
  }

  if (typeof x.bonded !== 'boolean') {
    x.bonded = !!x.bonded
  }
  if (x.timestamp) {
    x.timestampRelative = DateTime.fromSeconds(x.timestamp).toRelative()
    const transferTime = DateTime.fromSeconds(x.timestamp)
    x.receiveStatusUnknown = x.sourceChainId === getSourceChainId('ethereum') && !x.bondTxExplorerUrl && DateTime.now().toUTC().toSeconds() > transferTime.toSeconds() + (60 * 60 * 2)
  }
  if (x.receiveStatusUnknown) {
    // x.bonded = true
  }
  x.preregenesis = !!x.preregenesis
  x.bondTimestampRelative = x.bondTimestamp ? DateTime.fromSeconds(x.bondTimestamp).toRelative() : ''

  if (!x.accountAddressTruncated && x.accountAddress) {
    x.accountAddressTruncated = truncateAddress(x.accountAddress)
  }

  if (!x.accountAddressExplorerUrl && x.sourceChainSlug && x.accountAddress) {
    x.accountAddressExplorerUrl = explorerLinkAddress(x.sourceChainSlug, x.accountAddress)
  }

  if (!x.recipientAddressTruncated && x.recipientAddress) {
    x.recipientAddressTruncated = truncateAddress(x.recipientAddress)
  }

  // TODO: rerun worker
  if (!x.recipientAddressExplorerUrl || x.recipientAddressExplorerUrl?.includes('undefined')) {
    x.recipientAddressExplorerUrl = explorerLinkAddress(x.destinationChainSlug, x.recipientAddress)
  }

  if (!x.sourceChainColor && x.sourceChainSlug) {
    x.sourceChainColor = getColor(x.sourceChainSlug)
  }

  if (!x.destinationChainColor && x.destinationChainSlug) {
    x.destinationChainColor = getColor(x.destinationChainSlug)
  }

  if (!x.bondStatusColor) {
    x.bondStatusColor = x.bonded ? getColor('bonded') : getColor('pending')
  }

  if (typeof x.receivedHTokens !== 'boolean') {
    x.receivedHTokens = false
  }
  if (!x.convertHTokenUrl) {
    x.convertHTokenUrl = `https://${isGoerli ? 'goerli.hop.exchange' : 'app.hop.exchange'}/#/convert/amm?token=${x.token}&sourceNetwork=${x.destinationChainSlug}&fromHToken=true`
  }

  if (!x.hopExplorerUrl) {
    x.hopExplorerUrl = `https://${isGoerli ? 'goerli.explorer.hop.exchange' : 'explorer.hop.exchange'}/?transferId=${x.transferId}`
  }

  if (x.integrationPartner) {
    x.integrationPartnerName = integrationPartnerName(x.integrationPartner)
    x.integrationPartnerImageUrl = integrationPartnerImage(x.integrationPartner)
  }

  if (!x.estimatedUnixTimeUntilBond) {
    x.estimatedUnixTimeUntilBond = 0
  }
  if (!x.estimatedSecondsUntilBond) {
    x.estimatedSecondsUntilBond = 0
  }
  if (!x.estimatedRelativeTimeUntilBond) {
    x.estimatedRelativeTimeUntilBond = 0
  }

  if (!x.bonded && x.sourceChainSlug && x.destinationChainSlug) {
    const minutes = transferTimes?.[x.sourceChainSlug]?.[x.destinationChainSlug]
    if (minutes) {
      const bufferMinutes = 5 // to allow for enough time for indexer
      const transferTime = DateTime.fromSeconds(x.timestamp)
      const now = DateTime.now().toUTC()
      const estimatedDate = transferTime.plus({ minutes: minutes + bufferMinutes })
      const unixTimestamp = Math.floor(estimatedDate.toSeconds())
      const estimatedSeconds = Math.floor(estimatedDate.toSeconds() - now.toSeconds())
      const relativeTime = estimatedDate.toRelative()
      if (estimatedSeconds > 0) {
        x.estimatedUnixTimeUntilBond = unixTimestamp
        x.estimatedSecondsUntilBond = estimatedSeconds
        x.estimatedRelativeTimeUntilBond = relativeTime
      }
    }
  }

  return x
}
