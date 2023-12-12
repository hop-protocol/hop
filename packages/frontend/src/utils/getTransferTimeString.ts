import pluralize from 'pluralize'
import { getTransferTimeSeconds } from './getTransferTimeSeconds'

export function getTransferTimeString (fromChainSlug: string, toChainSlug: string) {
  if (!(fromChainSlug && toChainSlug)) {
    return
  }
  const seconds = getTransferTimeSeconds(fromChainSlug, toChainSlug)
  const minutes = Math.round(seconds / 60)
  const isUnderMinute = seconds <= 60
  if (seconds) {
    if (isUnderMinute) {
      return '~1 minute'
    }
    return `${minutes} ${pluralize('minutes', minutes)}`
  }
}
