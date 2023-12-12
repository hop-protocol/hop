import pluralize from 'pluralize'
import { getTransferTimeSeconds } from './getTransferTimeSeconds'

export function getTransferTimeString(fromChainSlug: string, toChainSlug: string) {
  if (!(fromChainSlug && toChainSlug)) {
    return ''
  }

  const seconds = getTransferTimeSeconds(fromChainSlug, toChainSlug)

  if (!seconds) {
    return '0 minutes'
  }

  if (seconds <= 60) {
    return '~1 minute'
  }

  // Calculate minutes and return the pluralized string
  const minutes = Math.round(seconds / 60)
  return `${minutes} ${pluralize('minute', minutes)}`
}
