import React, { useState, useEffect } from 'react'
import { formatUnits } from 'ethers/lib/utils'

// NOTE: this will come from the official airdrop repo once it's live
const url = 'https://gist.githubusercontent.com/miguelmota/3342af8dc536cf218e24c36f0b975cc2/raw/06d772e41d1da2c61c44de628f67cad9e6f9ce16/distribution.csv'

export function useDistribution(address?: string) {
  const [loading, setLoading] = useState<boolean>(false)
  const [allData, setAllData] = useState<any>(null)
  useEffect(() => {
    const update = async () => {
      try {
        if (allData) {
          return
        }
        setLoading(true)
        const res = await fetch(url)
        const text = await res.text()
        const csv = text.trim().split('\n')
        const header = csv[0].split(',')
        const rows = csv.slice(1)
        const data :any = {}
        for (const line of rows) {
          const row = line.split(',')
          const address = row[0]
          data[address] = {}
          for (const h of header) {
            data[address][h] = row[header.indexOf(h)]
          }
        }
        setAllData(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    update().catch(console.error)
  }, [])

  let lpTokens = 0
  let hopUserTokens = 0
  let earlyMultiplier = 0
  let volumeMultiplier = 0
  let total = 0
  if (address) {
    const data = allData?.[address.toLowerCase()]
    if (data) {
      lpTokens = Number(Number(formatUnits(data.lpTokens.toString(), 18)).toFixed(2))
      hopUserTokens = Number(Number(formatUnits(data.hopUserTokens.toString(), 18)).toFixed(2))
      earlyMultiplier = Number(Number(data.earlyMultiplier).toFixed(2)) || 1
      volumeMultiplier = Number(Number(data.volumeMultiplier).toFixed(2)) || 1
      total = Number((lpTokens + hopUserTokens).toFixed(2))
    }
  }

  return {
    loading,
    lpTokens,
    hopUserTokens,
    earlyMultiplier,
    volumeMultiplier,
    total
  }
}
