import { getTransferTimeMinutes } from './getTransferTimeMinutes'

export function getTransferTimeString (fromChainSlug: string, toChainSlug: string) {
  if (!(fromChainSlug && toChainSlug)) {
    return
  }
  const minutes = getTransferTimeMinutes(fromChainSlug, toChainSlug)
  if (minutes) {
    return `~${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  }
}
