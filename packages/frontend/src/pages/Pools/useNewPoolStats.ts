import React, { useEffect, useState } from 'react'
import { useApp } from 'src/contexts/AppContext'
import { addresses } from 'src/config'
import { commafy, toPercentDisplay } from 'src/utils'
import { findNetworkBySlug } from 'src/utils/networks'
import { normalizeTokenSymbol } from 'src/utils/normalizeTokenSymbol'

export function usePoolStats () {
  const { sdk } = useApp()
  const [poolStats, setPoolStats] = useState<any>({})
  const [stakingStats, setStakingStats] = useState<any>({})

  function getPoolStats(chain: string, token: string) {
    token = normalizeTokenSymbol(token)
    return poolStats?.[chain]?.[token]
  }

  function getStakingStats(chain: string, token: string, contractAddress: string) {
    token = normalizeTokenSymbol(token)
    try {
      const key = `${chain}:${token}:${contractAddress?.toLowerCase()}`
      const value = stakingStats?.[key] ?? {
        apr: 0,
        apy: 0,
        rewardToken: "",
      }

      return {
        stakingApr: value.apr,
        stakingAprFormatted: toPercentDisplay(value.apr)
      }
    } catch (err) {
      return {
        stakingApr: 0,
        stakingAprFormatted: toPercentDisplay(0)
      }
    }
  }

  async function getPoolStatsFile () {
    const url = 'https://assets.hop.exchange/v1.1-pool-stats.json'
    const res = await fetch(url)
    const json = await res.json()
    console.log('pool stats data response:', json)
    if (!json?.data) {
      throw new Error('expected data')
    }
    return json.data
  }

  useEffect(() => {
    async function update() {
      const json = await getPoolStatsFile()

      const _poolStats :any = {}
      for (const token in addresses.tokens) {
        const bridge = sdk.bridge(token)
        for (const chain of bridge.getSupportedLpChains()) {
          const symbol = normalizeTokenSymbol(token)
          if (!_poolStats[chain]) {
            _poolStats[chain] = {}
          }
          if (!_poolStats[chain][token]) {
            _poolStats[chain][token] = {
              apr: 0,
              aprFormatted: '',
              stakingApr: 0,
              stakingAprFormatted: '',
              totalApr: 0,
              totalAprFormatted: '',
              dailyVolume: '',
              dailyVolumeFormatted: '',
              tvlUsd: '',
              tvlUsdFormatted: '',
              stakingAprChain: null
            }
          }
          const pool = _poolStats[chain][token]
          try {
            let data = json.pools
            const _stakingStats = json.stakingRewards
            if (!data[symbol]) {
              throw new Error(`expected data for token symbol "${symbol}"`)
            }
            if (!data[symbol][chain]) {
              throw new Error(`expected data for network "${chain}"`)
            }
            data = data[symbol][chain]
            if (data.apr === undefined) {
              throw new Error(`expected apr value for token "${symbol}" and network "${chain}"`)
            }

            const stakingRewardTokens = new Set<any>([])

            const _stakingStatsObj : any = {}
            let stakingApr = 0
            for (const _token in _stakingStats) {
              for (const _chain in _stakingStats[_token]) {
                for (const _address in _stakingStats[_token][_chain]) {
                  const key = `${_chain}:${_token}:${_address?.toLowerCase()}`
                  const _value = _stakingStats[_token][_chain][_address]
                  _stakingStatsObj[key] = _value
                  if (_chain === chain && _token === token) {
                    if (_value.isOptimalStakingContract) {
                      stakingApr = _value.apr
                    }
                  }

                  if (chain === _chain && token === _token) {
                    stakingRewardTokens.add(_value.rewardToken)
                  }
                }
              }
            }

            setStakingStats(_stakingStatsObj)

            const apr = data.apr ?? 0
            const dailyVolume = data.dailyVolume ?? 0
            const tvlUsd = data.tvlUsd ?? 0
            pool.apr = apr
            pool.aprFormatted = toPercentDisplay(apr)
            pool.stakingApr = stakingApr
            pool.stakingAprFormatted = toPercentDisplay(stakingApr)
            pool.totalApr = apr + stakingApr
            pool.totalAprFormatted = toPercentDisplay(apr + stakingApr)
            pool.stakingAprChain = findNetworkBySlug(chain)!
            pool.dailyVolume = dailyVolume
            pool.dailyVolumeFormatted = dailyVolume ? `${commafy(dailyVolume, 2)}` : '-'
            pool.tvlUsd = tvlUsd
            pool.tvlUsdFormatted = dailyVolume ? `$${commafy(tvlUsd, 2)}` : '-'
            pool.stakingRewardTokens = Array.from(stakingRewardTokens)
          } catch (err: any) {
            if (!err.message?.includes('expected data')) {
              console.error('pool stats error:', err)
            }

            pool.aprFormatted = toPercentDisplay(0)
            pool.stakingAprFormatted = toPercentDisplay(0)
            pool.totalAprFormatted = toPercentDisplay(0)
            pool.dailyVolumeFormatted = '-'
            pool.tvlUsdFormatted = '-'
            pool.stakingRewardTokens = []
          }
        }
      }
      setPoolStats(_poolStats)
    }
    update().catch(console.error)
  }, [])

   return {
     poolStats,
     getPoolStats,
     getStakingStats
   }
}
