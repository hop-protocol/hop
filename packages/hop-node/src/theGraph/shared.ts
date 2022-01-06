import getTokenDecimals from 'src/utils/getTokenDecimals'
import { DateTime } from 'luxon'
import { formatUnits } from 'ethers/lib/utils'

export type Filters = {
  startDate: string
  endDate: string
  orderDesc: boolean
}

export const chainIdToSlug: any = {
  1: 'ethereum',
  10: 'optimism',
  100: 'gnosis',
  137: 'polygon',
  42161: 'arbitrum'
}

export function normalizeEntity (x: any) {
  if (!x) {
    return x
  }

  if (x.index !== undefined) {
    x.index = Number(x.index)
  }
  if (x.originChainId) {
    x.originChainId = Number(x.originChainId)
  }
  if (x.sourceChainId) {
    x.sourceChainId = Number(x.sourceChainId)
    x.sourceChain = chainIdToSlug[x.sourceChainId]
  }
  if (x.destinationChainId) {
    x.destinationChainId = Number(x.destinationChainId)
    x.destinationChain = chainIdToSlug[x.destinationChainId]
  }

  const decimals = getTokenDecimals(x.token)

  // TODO: use correct decimal places for future assets
  if (x.amount) {
    x.formattedAmount = formatUnits(x.amount, decimals)
  }
  if (x.bonderFee) {
    x.formattedBonderFee = formatUnits(x.bonderFee, decimals)
  }

  x.blockNumber = Number(x.blockNumber)
  x.timestamp = Number(x.timestamp)
  x.timestampRelative = DateTime.fromSeconds(x.timestamp).toRelative()

  return x
}
