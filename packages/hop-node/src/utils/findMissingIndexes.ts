interface Transfer {
  index: number
}

export function findMissingIndexes (sortedTransfers: Transfer[]) {
  if (sortedTransfers?.length <= 1) {
    return []
  }

  const sortedIndexes = sortedTransfers.map((x: Transfer) => x.index)
  const last = sortedIndexes[sortedIndexes.length - 1]
  const missingIndexes = []
  for (let i = 1; i <= last; i++) {
    if (!sortedIndexes.includes(i)) {
      missingIndexes.push(i)
    }
  }

  return missingIndexes
}
