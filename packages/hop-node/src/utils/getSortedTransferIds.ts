import { findMissingIndexes } from 'src/utils/findMissingIndexes'

type Transfer = {
  transferId: string
  blockNumber: number
  index: number
}

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
  const replace: any = {}

  transfers = transfers.filter((x: any, i: number) => {
    if (seen[x.index]) {
      if (x.index > 100 && x.blockNumber > seen[x.index].blockNumber && x.blockNumber > startBlockNumber) {
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

  for (const i in replace) {
    transfers[i as any] = replace[i]
  }

  const lastIndex = transfers[transfers.length - 1]?.index
  const missingIndexes = findMissingIndexes(transfers)

  return { sortedTransfers: transfers, missingIndexes, lastIndex }
}
