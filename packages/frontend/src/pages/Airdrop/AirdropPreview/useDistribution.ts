import jsonData from '../distribution.json'
import { formatUnits } from 'ethers/lib/utils'

const allData :any = {}
for (const address in jsonData) {
  allData[address.toLowerCase()] = jsonData[address]
}

export function useDistribution(address?: string) {
  let lpTokens = 0
  let hopUserTokens = 0
  let earlyMultiplier = 0
  let volumeMultiplier = 0
  let total = 0
  if (address) {
    const data = allData[address.toLowerCase()]
    if (data) {
      lpTokens = Number(Number(formatUnits(data.lpTokens.toString(), 18)).toFixed(2))
      hopUserTokens = Number(Number(formatUnits(data.hopUserTokens.toString(), 18)).toFixed(2))
      earlyMultiplier = Number(Number(data.earlyMultiplier).toFixed(2))
      volumeMultiplier = Number(Number(data.volumeMultiplier).toFixed(2))
      total = Number((lpTokens + hopUserTokens).toFixed(2))
    }
  }
  return {
    lpTokens,
    hopUserTokens,
    earlyMultiplier,
    volumeMultiplier,
    total
  }
}
