import jsonData from '../distribution.json'
import { formatUnits } from 'ethers/lib/utils'

const allData :any = {}
for (const address in jsonData) {
  allData[address.toLowerCase()] = jsonData[address]
}

export function useDistribution(address?: string) {
  if (address) {
    const data = allData[address.toLowerCase()]
    if (data) {
      return {
        lpTokens: Number(Number(formatUnits(data.lpTokens.toString(), 18)).toFixed(2)),
        hopUserTokens: Number(Number(formatUnits(data.hopUserTokens.toString(), 18)).toFixed(2)),
        earlyMultiplier: Number(Number(data.earlyMultiplier).toFixed(2)),
        volumeMultiplier: Number(Number(data.volumeMultiplier).toFixed(2))
      }
    }
  }
  return { }
}
