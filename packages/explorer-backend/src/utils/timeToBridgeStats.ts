export interface TimeToBridgeStats {
  avg: number | null
  median: number | null
  percentile90: number | null
}

export function timeToBridgeStats(times: number[]): TimeToBridgeStats {
  const n = times.length
  if (n === 0) {
    return { avg: null, median: null, percentile90: null }
  }

  // sort bundle of transactions
  times.sort((a, b) => a - b)

  // calculate average time
  const avg = times.reduce((a, b) => a + b, 0) / n

  // calculate median time
  const mid = Math.floor(n / 2)
  const median = n % 2 === 0 ? (times[mid - 1] + times[mid]) / 2 : times[mid]

  // calculate the 90th percentile with linear interpolation
  const percentileRank = 0.9
  const index = percentileRank * (n - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower

  const percentile90 = times[lower] + (times[upper] - times[lower]) * weight

  return { avg, median, percentile90 }
}
