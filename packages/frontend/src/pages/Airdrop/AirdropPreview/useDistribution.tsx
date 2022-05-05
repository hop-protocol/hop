import React, { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

const url = 'https://raw.githubusercontent.com/hop-protocol/hop-airdrop/master/src/data/finalDistribution.csv'
const BASE_AMOUNT = BigNumber.from('264736330517381718178')

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
          const address = row[0]?.toLowerCase()
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
  let baseAmount = 0
  let earlyMultiplier = 0
  let volumeMultiplier = 0
  let total = 0
  const baseAmountBn = BASE_AMOUNT
  if (address) {
    const data = allData?.[address.toLowerCase()]
    if (data) {
      lpTokens = Number(Number(formatUnits(data.lpTokens.toString(), 18)).toFixed(4))
      hopUserTokens = Number(Number(formatUnits(data.hopUserTokens.toString(), 18)).toFixed(4))
      earlyMultiplier = Number(Number(data.earlyMultiplier).toFixed(4)) || 1
      volumeMultiplier = Number(Number(data.volumeMultiplier).toFixed(4)) || 1
      if (hopUserTokens) {
        baseAmount = Number(Number(formatUnits(baseAmountBn.toString(), 18)).toFixed(4))
      }
      if (data.totalTokens) {
        total = Number(Number(formatUnits(data.totalTokens.toString(), 18)).toFixed(4))
      } else {
        total = Number((lpTokens + hopUserTokens).toFixed(4))
      }
    }
  }

  return {
    loading,
    lpTokens,
    hopUserTokens,
    baseAmount,
    earlyMultiplier,
    volumeMultiplier,
    total
  }
}
