import React, { useEffect, useState } from 'react'
import { useApp } from 'src/contexts/AppContext'
import { addresses } from 'src/config'
import { commafy, shiftBNDecimals, BNMin, toTokenDisplay, toPercentDisplay } from 'src/utils'

export function usePools () {
  const { sdk } = useApp()
  const [pools, setPools] = useState<any[]>([])
  const [isSet, setIsSet] = useState<boolean>(false)

  useEffect(() => {
    async function update () {
      const _pools :any[] = []
      for (const token in addresses.tokens) {
        const bridge = sdk.bridge(token)
        for (const chain of bridge.getSupportedLpChains()) {
          _pools.push({
            token,
            chain,
            tvl: '-',
            apr: '-',
            stakingApr: '-'
          })
        }
      }
      setPools(_pools)
      setIsSet(true)
    }
    update().catch(console.error)
  }, [])

  useEffect(() => {
    async function update() {
      await Promise.all(pools.map(async pool => {
        const bridge = sdk.bridge(pool.token)
        const tvl = await bridge.getReservesTotal(pool.chain)
        pool.tvl = bridge.formatUnits(tvl)
        setPools([...pools])
      }))
    }
    update().catch(console.error)
  }, [isSet])

  async function getPoolStatsFile () {
    const url = 'https://assets.hop.exchange/v1-pool-stats.json'
    const res = await fetch(url)
    const json = await res.json()
    console.log('apr data response:', json)
    if (!json.data) {
      throw new Error('expected data')
    }
    return json
  }

  useEffect(() => {
    async function update() {
      const json = await getPoolStatsFile()
      await Promise.all(pools.map(async pool => {
        try {
          let symbol = pool.token
          const chain = pool.chain

          if (symbol === 'WETH') {
            symbol = 'ETH'
          }
          if (symbol === 'XDAI') {
            symbol = 'DAI'
          }
          if (symbol === 'WXDAI') {
            symbol = 'DAI'
          }
          if (symbol === 'WMATIC') {
            symbol = 'MATIC'
          }
          if (!json.data[symbol]) {
            throw new Error(`expected data for token symbol "${symbol}"`)
          }
          if (!json.data[symbol][chain]) {
            throw new Error(`expected data for network "${chain}"`)
          }
          if (json.data[symbol][chain].apr === undefined) {
            throw new Error(`expected apr value for token "${symbol}" and network "${chain}"`)
          }

          const apr = json.data[symbol][chain].apr
          const stakingApr = json.data[symbol][chain].stakingApr
          pool.apr = toPercentDisplay(apr)
          pool.stakingApr = toPercentDisplay(stakingApr)

          setPools([...pools])
        } catch (err) {
          pool.apr = toPercentDisplay(0)
          pool.stakingApr = toPercentDisplay(0)

          setPools([...pools])
          console.error(err)
        }
      }))
    }
    update().catch(console.error)
  }, [isSet])

  return {
    pools
  }
}
