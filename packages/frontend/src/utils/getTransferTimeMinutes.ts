import { transferTimes } from 'src/config'

export function getTransferTimeMinutes (fromChainSlug: string, toChainSlug: string) {
  if (!(fromChainSlug && toChainSlug)) {
    return
  }
  const minutes = transferTimes?.[fromChainSlug]?.[toChainSlug]
  return minutes
}
