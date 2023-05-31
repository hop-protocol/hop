import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { StakingRewards__factory } from '@hop-protocol/core/contracts'
import { addresses, stakingRewardsContracts, hopStakingRewardsContracts, reactAppNetwork } from 'src/config'
import { findNetworkBySlug } from 'src/utils/networks'
import { formatTokenDecimalString } from 'src/utils/format'
import { formatUnits } from 'ethers/lib/utils'
import { getTokenImage } from 'src/utils/tokens'
import { toPercentDisplay, commafy } from 'src/utils'
import { stableCoins } from 'src/utils/constants'
import { useApp } from 'src/contexts/AppContext'
import { usePoolStats } from '../usePoolStats'
import { useQuery } from 'react-query'
import { useQueryParams } from 'src/hooks'
import { useWeb3Context } from 'src/contexts/Web3Context'

let cache :any = {}
const cacheExpiresMs = (2 * 60 * 1000)

try {
  const timestamp = localStorage.getItem('poolsOverviewTimestamp')
  if (timestamp && Number(timestamp) > Date.now() - cacheExpiresMs) {
    const cached = localStorage.getItem('poolsOverview:v000')
    if (cached) {
      cache = JSON.parse(cached)
    }
  }
} catch (err) {
}

function capitalInsensitiveSearch(subject: string, ref: string) {
  return subject
    .toLowerCase()
    .search(ref.toLowerCase())
}

export function usePools () {
  const { sdk } = useApp()
  const { queryParams } = useQueryParams()
  const { address } = useWeb3Context()
  const { poolStats, getPoolStats } = usePoolStats()
  const [filterTokens, setFilterTokens] = useState<any[]>([])
  const [filterChains, setFilterChains] = useState<any[]>([])
  const [searchPools, setSearchPools] = useState<string>('')
  const [columnSort, setColumnSort] = useState<string>('')
  const [columnSortDesc, setColumnSortDesc] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [hasFetchedAccount, setHasFetchedAccount] = useState(false)
  const [pools, setPools] = useState<any[]>(cache.base || [])
  const accountAddress = (queryParams?.address as string) || address?.address

  const { data: basePools } = useQuery(
    [
      `usePools:basePools`,
    ],
    async () => {
      const _pools :any[] = []
      for (const token in addresses.tokens) {
        const bridge = sdk.bridge(token)
        for (const chain of bridge.getSupportedLpChains()) {
          const chainModel = findNetworkBySlug(chain)
          const tokenModel = bridge.toTokenModel(token)
          if (!(chainModel && tokenModel)) {
            continue
          }
          const tokenImage = getTokenImage(tokenModel.symbol)
          const poolName = `${token} ${chainModel.name} Pool`
          const poolSubtitle = `${token} - h${token}`
          const depositLink = `/pool/deposit?token=${tokenModel.symbol}&sourceNetwork=${chainModel.slug}`
          const claimLink = `/pool/stake?token=${tokenModel.symbol}&sourceNetwork=${chainModel.slug}`
          const stakeLink = `/pool/stake?token=${tokenModel.symbol}&sourceNetwork=${chainModel.slug}`
          _pools.push({
            token: { ...tokenModel, imageUrl: tokenImage },
            chain: chainModel,
            poolName,
            poolSubtitle,
            userBalanceBn: BigNumber.from(0),
            userBalanceUsd: 0,
            userBalanceFormatted: '',
            userBalanceTotalUsd: 0,
            userBalanceTotalUsdFormatted: '-',
            tvl: 0,
            tvlFormatted: '',
            apr: 0,
            aprFormatted: '',
            stakingApr: 0,
            stakingAprFormatted: '',
            stakingRewards: [],
            totalApr: 0,
            totalAprFormatted: '',
            depositLink,
            canClaim: false,
            canStake: false,
            hasStakingContract: false,
            claimLink,
            stakeLink,
            hasStaked: false,
            stakingRewardsStaked: 0,
            stakingRewardsStakedUsd: 0,
            stakingRewardsStakedUsdFormatted: '',
            hopRewardsStaked: 0,
            hopRewardsStakedUsd: 0,
            hopRewardsStakedUsdFormatted: '',
            stakingRewardsStakedTotalUsd: 0,
            stakingRewardsStakedTotalUsdFormatted: '',
          })
        }
      }
      return _pools
    },
    {
      enabled: true,
      refetchInterval: 100 * 1000
    }
  )

  useQuery(
    [
      `usePools:pools:${accountAddress}:${JSON.stringify(poolStats)}`,
      accountAddress,
      basePools,
      poolStats
    ],
    async () => {
      if (!basePools) {
        return cache.base
      }
      if (!cache.base) {
        cache.base = basePools
      }
      if (!poolStats) {
        return cache.base
      }
      if (isFetching) {
        return cache.base
      }
      const _pools = await Promise.all(basePools.map(async (_pool: any) => {
        const pool = Object.assign({}, _pool)
        const tokenSymbol = pool.token.symbol
        const chainSlug = pool.chain.slug
        try {
          const symbol = pool.token.symbol
          const chain = pool.chain.slug
          const stakingRewards :any[] = []
          const _poolStats = getPoolStats(chain, symbol)
          if (_poolStats) {
            pool.apr = _poolStats.apr
            pool.aprFormatted = _poolStats.aprFormatted
            pool.stakingApr = _poolStats.stakingApr
            pool.stakingAprFormatted = _poolStats.stakingAprFormatted
            pool.totalApr = _poolStats.totalApr
            pool.totalAprFormatted = _poolStats.totalAprFormatted
            pool.tvl = _poolStats.tvl
            pool.tvlFormatted = _poolStats.tvlUsdFormatted
            const stakingRewardTokens = _poolStats.stakingRewardTokens

            // TODO: Replace with automated LSD data in stats-worker
            if (pool.token.symbol === 'rETH' && stakingRewardTokens.length === 1) {
              const rETHApr: number = 0.0398
              stakingRewardTokens.unshift({
                tokenSymbol: 'ETH',
                imageUrl: getTokenImage('ETH'),
                aprFormatted: toPercentDisplay(rETHApr)
              })

              pool.totalApr += rETHApr
              pool.totalAprFormatted = toPercentDisplay(pool.totalApr)
            }
            for (const item of stakingRewardTokens) {
              stakingRewards.push({
                tokenSymbol: item.tokenSymbol,
                imageUrl: getTokenImage(item.tokenSymbol),
                aprFormatted: item.aprFormatted
              })
            }
            pool.stakingRewards = [...stakingRewards.filter((x: any) => x.tokenSymbol === 'HOP'), ...stakingRewards.filter((x: any) => x.tokenSymbol !== 'HOP')]
          }
        } catch (err) {
          console.error('err', pool, err)

          pool.aprFormatted = toPercentDisplay(0)
          pool.stakingAprFormatted = toPercentDisplay(0)
          pool.totalAprFormatted = toPercentDisplay(0)
        }

        if (accountAddress) {
          const key = `${accountAddress}:${chainSlug}:${tokenSymbol}`
          const cached = cache[key]
          if (cached) {
            pool.userBalanceUsd = cached.userBalanceUsd
            pool.userBalanceTotalUsd = cached.userBalanceTotalUsd
            pool.userBalanceTotalUsdFormatted = cached.userBalanceTotalUsdFormatted
            pool.canClaim = cached.canClaim
            pool.canStake = cached.canStake
            pool.hasStaked = cached.hasStaked
            pool.hasStakingContract = cached.hasStakingContract
            pool.stakingRewardsStakedTotalUsd = cached.stakingRewardsStakedTotalUsd
            pool.stakingRewardsStakedTotalUsdFormatted = cached.stakingRewardsStakedTotalUsdFormatted
            setHasFetchedAccount(true)
            return pool
          }
          setIsFetching(true)
          try {
            const bridge = sdk.bridge(pool.token.symbol)
            const lpToken = bridge.getSaddleLpToken(pool.chain.slug)
            const tokenDecimals = bridge.getTokenDecimals()
            const [poolReserves, lpTokenTotalSupplyBn, lpBalance] = await Promise.all([
              bridge.getSaddleSwapReserves(pool.chain.slug),
              lpToken.totalSupply(),
              lpToken.balanceOf(accountAddress)
            ])
            const tokenUsdPrice = stableCoins.has(pool.token.symbol) ? 1 : await bridge.priceFeed.getPriceByTokenSymbol(pool.token.symbol)
            if (lpTokenTotalSupplyBn.gt(0)) {
              if (lpBalance.gt(0)) {
                const token0Deposited = lpBalance.mul(BigNumber.from(poolReserves[0] || 0)).div(lpTokenTotalSupplyBn)
                const token1Deposited = lpBalance.mul(BigNumber.from(poolReserves[1] || 0)).div(lpTokenTotalSupplyBn)
                const userBalance = token0Deposited.add(token1Deposited)
                const canonicalBalance = Number(formatUnits(userBalance, tokenDecimals))

                pool.userBalanceBn = lpBalance
                pool.userBalanceUsd = canonicalBalance * tokenUsdPrice
                pool.userBalanceUsdFormatted = `$${formatTokenDecimalString(pool.userBalanceUsd, 0, 4)}`
                pool.reserves = poolReserves
                pool.totalSupply = lpTokenTotalSupplyBn
              } else {
                pool.userBalance = BigNumber.from(0)
                pool.userBalanceUsdFormatted = '-'
              }
            }

            const address = stakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]

            if (lpTokenTotalSupplyBn.gt(0)) {
              let hasStakingContract = false
              let totalStakedBalance = BigNumber.from(0)
              if (address) {
                hasStakingContract = true
                const _provider = sdk.getChainProvider(pool.chain.slug)
                const contract = StakingRewards__factory.connect(address, _provider)
                const [stakedBalance, earned] = await Promise.all([
                  contract?.balanceOf(accountAddress),
                  contract?.earned(accountAddress)
                ])
                if (stakedBalance.gt(0)) {
                  totalStakedBalance = totalStakedBalance.add(stakedBalance)
                  pool.stakingRewardsStaked = Number(formatUnits(stakedBalance, 18))

                  const stakedToken0Deposited = stakedBalance.mul(BigNumber.from(poolReserves[0] || 0)).div(lpTokenTotalSupplyBn)
                  const stakedToken1Deposited = stakedBalance.mul(BigNumber.from(poolReserves[1] || 0)).div(lpTokenTotalSupplyBn)
                  const stakedCanonical = Number(formatUnits(stakedToken0Deposited.add(stakedToken1Deposited), tokenDecimals))

                  pool.stakingRewardsStakedUsd = stakedCanonical * tokenUsdPrice
                  pool.stakingRewardsStakedUsdFormatted = `$${commafy(pool.stakingRewardsStakedUsd, 2)}`
                }
                if (earned.gt(0)) {
                  pool.canClaim = true
                }
              }

              const hopStakingContractAddress = hopStakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
              if (hopStakingContractAddress) {
                hasStakingContract = true
                const _provider = sdk.getChainProvider(chainSlug)
                const contract = StakingRewards__factory.connect(hopStakingContractAddress, _provider)
                const [stakedBalance, earned] = await Promise.all([
                  contract?.balanceOf(accountAddress),
                  contract?.earned(accountAddress)
                ])
                if (stakedBalance.gt(0)) {
                  totalStakedBalance = totalStakedBalance.add(stakedBalance)
                  pool.hopRewardsStaked = Number(formatUnits(stakedBalance, 18))

                  const stakedToken0Deposited = stakedBalance.mul(BigNumber.from(poolReserves[0] || 0)).div(lpTokenTotalSupplyBn)
                  const stakedToken1Deposited = stakedBalance.mul(BigNumber.from(poolReserves[1] || 0)).div(lpTokenTotalSupplyBn)
                  const stakedCanonical = Number(formatUnits(stakedToken0Deposited.add(stakedToken1Deposited), tokenDecimals))

                  pool.hopRewardsStakedUsd = stakedCanonical * tokenUsdPrice
                  pool.hopRewardsStakedUsdFormatted = `$${commafy(pool.hopRewardsStakedUsd, 2)}`
                }
                if (earned.gt(0)) {
                  pool.canClaim = true
                }
              }
              pool.hasStakingContract = hasStakingContract
              pool.hasStaked = totalStakedBalance.gt(0)

              const totalLpBalance = totalStakedBalance.add(lpBalance)
              const totalToken0Deposited = totalLpBalance.mul(BigNumber.from(poolReserves[0] || 0)).div(lpTokenTotalSupplyBn)
              const totalToken1Deposited = totalLpBalance.mul(BigNumber.from(poolReserves[1] || 0)).div(lpTokenTotalSupplyBn)
              const totalCanonical = Number(formatUnits(totalToken0Deposited.add(totalToken1Deposited), tokenDecimals))
              pool.userBalanceTotalUsd = totalCanonical * tokenUsdPrice

              pool.stakingRewardsStakedTotalUsd = pool.stakingRewardsStakedUsd + pool.hopRewardsStakedUsd
              pool.stakingRewardsStakedTotalUsdFormatted = `$${commafy(pool.stakingRewardsStakedTotalUsd, 2)}`

              cache[key] = {}
              cache[key].userBalanceUsd = pool.userBalanceUsd
              cache[key].userBalanceTotalUsd = pool.userBalanceTotalUsd
              cache[key].userBalanceTotalUsdFormatted = pool.userBalanceTotalUsdFormatted
              cache[key].canClaim = pool.canClaim
              cache[key].canStake = pool.canStake
              cache[key].hasStaked = pool.hasStaked
              cache[key].hasStakingContract = pool.hasStakingContract
              cache[key].stakingRewardsStakedTotalUsd = pool.stakingRewardsStakedTotalUsd
              cache[key].stakingRewardsStakedTotalUsdFormatted = pool.stakingRewardsStakedTotalUsdFormatted
            }
            setTimeout(() => {
              setHasFetchedAccount(true)
            }, 2 * 1000)
          } catch (err: any) {
            if (!/noNetwork/.test(err.message)) {
              console.error('usePools error:', err)
            }
          }
        }
        return pool
      }))
      try {
        delete cache.base
        localStorage.setItem('poolsOverview:v000', JSON.stringify(cache))
        const timestamp = localStorage.getItem('poolsOverviewTimestamp')
        if (Number(timestamp) && Date.now() > Number(timestamp) + cacheExpiresMs) {
          localStorage.setItem('poolsOverviewTimestamp', `${Date.now()}`)
        }
      } catch (err) {
        console.error(err)
      }
      cache.base = _pools
      setPools(_pools)
      return _pools
    },
    {
      enabled: !!basePools?.length && !!poolStats,
      refetchInterval: 100 * 1000
    }
  )

  const { data: userPools } = useQuery(
    [
      `usePools:userPools:${accountAddress}:${JSON.stringify(pools)}`,
      accountAddress,
      pools?.length
    ],
    async () => {
      if (!pools?.length) {
        return
      }
      const _userPools = pools.filter((x: any) => {
        return (Number(x.userBalanceTotalUsd) > 0) || x.canClaim
      }).map((x: any) => {
        x.userBalanceTotalUsdFormatted = x.userBalanceTotalUsd ? `$${commafy(x.userBalanceTotalUsd, 4)}` : '-'

        if (x.hasStakingContract && x.userBalanceUsd && !x.hasStaked && !x.canClaim) {
          x.canStake = true
        }

        return x
      })

      return _userPools
    },
    {
      enabled: true,
      refetchInterval: 100 * 1000
    }
  )

  useEffect(() => {
    async function update() {
      if (!pools?.length) {
        return
      }
      if (filterTokens.length) {
        return
      }
      const tokens :any = {}
      for (const pool of pools) {
        if (!tokens[pool.token.symbol]) {
          tokens[pool.token.symbol] = { ...pool.token, enabled: true, filterBy: true }
        }
      }
      setFilterTokens(Object.values(tokens))
    }
    update().catch(console.error)
  }, [pools?.length])

  useEffect(() => {
    async function update() {
      if (!pools?.length) {
        return
      }
      if (filterChains.length) {
        return
      }
      const chains :any = {}
      for (const pool of pools) {
        if (!chains[pool.chain.slug]) {
          chains[pool.chain.slug] = { ...pool.chain, enabled: true, filterBy: true }
        }
      }
      setFilterChains(Object.values(chains))
    }
    update().catch(console.error)
  }, [pools?.length])

  function toggleFilterItem(items: any[], keyName: string, toggleKey: string) {
    const isFirst = items.every((x: any) => x.enabled)
    for (const item of items) {
      if (item[keyName] === toggleKey) {
        const enabled = !item.enabled
        item.enabled = enabled
        item.filterBy = !enabled
      } else {
        if (isFirst) {
          item.filterBy = false
        }
      }
    }
    const shouldFilterAll = items.every((x: any) => x.enabled)
    if (shouldFilterAll) {
      for (const item of items) {
        item.filterBy = true
      }
    }

    return items
  }

  function toggleFilterToken (symbol: string) {
    const _filterTokens = toggleFilterItem(filterTokens, 'symbol', symbol)
    setFilterTokens([..._filterTokens])
  }

  function toggleFilterChain (slug: string) {
    const _filterChains = toggleFilterItem(filterChains, 'slug', slug)
    setFilterChains([..._filterChains])
  }

  function toggleColumnSort(column: string) {
    if (column === columnSort) {
      setColumnSortDesc(!columnSortDesc)
    } else {
      setColumnSort(column)
      setColumnSortDesc(true)
    }
  }

  let filteredPools = pools ? pools.filter((x: any) => {
    for (const filterToken of filterTokens) {
      if (x.token.symbol === filterToken.symbol && !filterToken.filterBy) {
        return false
      }
    }
    for (const filterChain of filterChains) {
      if (x.chain.slug === filterChain.slug && !filterChain.filterBy) {
        return false
      }
    }
    if (capitalInsensitiveSearch(x.poolName, searchPools) === -1) {
      return false
    }
    return true
  }) : []

  if (columnSort) {
    filteredPools = filteredPools.sort((a: any, b: any) => {
      if (columnSortDesc) {
        return b[columnSort] - a[columnSort]
      } else {
        return a[columnSort] - b[columnSort]
      }
    })
  }

  const filteredUserPools = userPools ? userPools?.sort((a: any, b: any) => {
    return b.userBalanceTotalUsd - a.userBalanceTotalUsd
  }) : []

  const noSearchResults = Boolean(searchPools.length) && !filteredPools?.length

  const isAccountLoading = !!accountAddress && !hasFetchedAccount && !filteredUserPools?.length

  return {
    columnSort,
    filterChains,
    filterTokens,
    noSearchResults,
    isAccountLoading,
    pools: filteredPools,
    toggleColumnSort,
    toggleFilterChain,
    toggleFilterToken,
    setSearchPools,
    userPools: filteredUserPools,
  }
}
