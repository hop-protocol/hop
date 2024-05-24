import { transferTimes } from '#config/index.js'

export function getTransferTimeSeconds (fromChainSlug: string, toChainSlug: string) {
  if (!(fromChainSlug && toChainSlug)) {
    return 0
  }
  const minutes = transferTimes?.[fromChainSlug]?.[toChainSlug] ?? 60
  return minutes * 60
}
