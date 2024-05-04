import { DateTime } from 'luxon'
import { utils } from 'ethers'
import { getChainSlug, getTokenDecimals } from '@hop-protocol/sdk'

export type Filters = {
  startDate: string
  endDate: string
  orderDesc: boolean
  destinationChainId?: number
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
    x.sourceChain = getChainSlug(x.sourceChainId.toString())
  }
  if (x.destinationChainId) {
    x.destinationChainId = Number(x.destinationChainId)
    x.destinationChain = getChainSlug(x.destinationChainId.toString())
  }

  const decimals = getTokenDecimals(x.token)

  // TODO: use correct decimal places for future assets
  if (x.amount) {
    x.formattedAmount = utils.formatUnits(x.amount, decimals)
  }
  if (x.bonderFee) {
    x.formattedBonderFee = utils.formatUnits(x.bonderFee, decimals)
  }

  x.blockNumber = Number(x.blockNumber)
  x.timestamp = Number(x.timestamp)
  x.timestampRelative = DateTime.fromSeconds(x.timestamp).toRelative()

  return x
}
