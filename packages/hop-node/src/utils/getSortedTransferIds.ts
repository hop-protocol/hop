import { findMissingIndexes } from './findMissingIndexes.js'

type Transfer = {
  transferId: string
  blockNumber: number
  index: number
}

// TODO: simplify this
export function getSortedTransferIds (_transfers: Transfer[], startBlockNumber: number = 0): any {
  let transfers: any[] = _transfers.sort((a: any, b: any) => {
    if (a.index > b.index) return 1
    if (a.index < b.index) return -1
    if (a.blockNumber > b.blockNumber) return 1
    if (a.blockNumber < b.blockNumber) return -1
    return 0
  })

  // console.log(JSON.stringify(transfers, null, 2))

  const seen: any = {}
  const replace: Record<string, any> = {}

  transfers = transfers.filter((x: any, i: number) => {
    if (seen[x.index]) {
      if (x.blockNumber > seen[x.index].blockNumber && x.blockNumber > startBlockNumber) {
        replace[x.index] = x
      }
      return false
    }
    seen[x.index] = x
    return true
  })

  transfers = transfers.filter((x: any, i: number) => {
    return x.index === i
  })

  const firstBlockNumber = transfers[0]?.blockNumber

  for (const i in replace) {
    const idx = i as unknown as number // note: ts type checker suggests using 'unknown' type first to fix type error
    if (idx > 100 || firstBlockNumber > transfers[idx].blockNumber) {
      transfers[idx] = replace[i]
    }
  }

  const lastIndex = transfers[transfers.length - 1]?.index
  const missingIndexes = findMissingIndexes(transfers)

  return { sortedTransfers: transfers, missingIndexes, lastIndex }
}
