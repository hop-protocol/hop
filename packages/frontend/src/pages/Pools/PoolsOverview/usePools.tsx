import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useApp } from 'src/contexts/AppContext'
import { metadata, addresses, stakingRewardsContracts, hopStakingRewardsContracts, reactAppNetwork } from 'src/config'
import { useQueryParams } from 'src/hooks'
import { toPercentDisplay, commafy } from 'src/utils'
import { formatTokenDecimalString } from 'src/utils/format'
import { findNetworkBySlug } from 'src/utils/networks'
import { getTokenImage } from 'src/utils/tokens'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { StakingRewards__factory } from '@hop-protocol/core/contracts'
import { usePoolStats } from '../useNewPoolStats'

const cache : any = {}

export function usePools () {
  const { sdk } = useApp()
  const { queryParams } = useQueryParams()
  const { address } = useWeb3Context()
  const { poolStats, getPoolStats } = usePoolStats()
  const [userPools, setUserPools] = useState<any[]>([])
  const [pools, setPools] = useState<any[]>([])
  const [isSet, setIsSet] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [filterTokens, setFilterTokens] = useState<any[]>([])
  const [filterChains, setFilterChains] = useState<any[]>([])
  const [columnSort, setColumnSort] = useState<string>('')
  const [columnSortDesc, setColumnSortDesc] = useState(true)
  const accountAddress = (queryParams?.address as string) || address?.address

  useEffect(() => {
    async function update () {
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
      setPools(_pools)
      setIsSet(true)
    }
    update().catch(console.error)
  }, [])

  useEffect(() => {
    async function update() {
      if (!isSet) {
        return
      }
      if (!accountAddress) {
        for (const pool of pools) {
          pool.userBalanceBn = BigNumber.from(0)
          pool.userBalanceUsd = 0
          pool.userBalanceUsdFormatted = '-'
        }
        setPools([...pools])
        return
      }
      await Promise.all(pools.map(async pool => {
        try {
          const bridge = sdk.bridge(pool.token.symbol)
          const lpToken = bridge.getSaddleLpToken(pool.chain.slug)
          const tokenDecimals = bridge.getTokenDecimals()
          const [poolReserves, lpTokenTotalSupplyBn] = await Promise.all([
            bridge.getSaddleSwapReserves(pool.chain.slug),
            lpToken.totalSupply(),
          ])
          if (lpTokenTotalSupplyBn.eq(0)) {
            return
          }
          const tokenUsdPrice = ['USDC', 'USDT', 'DAI'].includes(pool.token.symbol) ? 1 : await bridge.priceFeed.getPriceByTokenSymbol(pool.token.symbol)
          const lpBalance = await lpToken.balanceOf(accountAddress)
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
          setPools([...pools])
        } catch (err: any) {
          console.error(err)
        }
      }))
    }
    update().catch(console.error)
  }, [isSet, accountAddress])

  useEffect(() => {
    async function update() {
      const _userPools = pools.filter((x: any) => {
        return (Number(x.userBalanceTotalUsd) > 0) || x.canClaim
      }).map((x: any) => {
        x.userBalanceTotalUsdFormatted = x.userBalanceTotalUsd ? `$${commafy(x.userBalanceTotalUsd, 4)}` : '-'

        if (x.hasStakingContract && x.userBalanceUsd && !x.hasStaked && !x.canClaim) {
          x.canStake = true
        }

        return x
      })
      setUserPools(_userPools)
    }
    update().catch(console.error)
  }, [pools])

  useEffect(() => {
    async function update() {
      if (filterTokens.length) {
        return
      }
      const tokens :any = {}
      for (const pool of pools) {
        if (!tokens[pool.token.symbol]) {
          tokens[pool.token.symbol] = { ...pool.token, enabled: true }
        }
      }
      setFilterTokens(Object.values(tokens))
    }
    update().catch(console.error)
  }, [pools])

  useEffect(() => {
    async function update() {
      if (filterChains.length) {
        return
      }
      const chains :any = {}
      for (const pool of pools) {
        if (!chains[pool.chain.slug]) {
          chains[pool.chain.slug] = { ...pool.chain, enabled: true }
        }
      }
      setFilterChains(Object.values(chains))
    }
    update().catch(console.error)
  }, [pools])

  useEffect(() => {
    async function update() {
      await Promise.all(pools.map(async pool => {
        try {
          const symbol = pool.token.symbol
          const chain = pool.chain.slug
          pool.stakingRewards = []
          const hopStakingContractAddress = hopStakingRewardsContracts?.[reactAppNetwork]?.[chain]?.[symbol]
          if (hopStakingContractAddress) {
            const hopLogo = metadata.tokens.HOP.image
            pool.stakingRewards.push({
              name: 'Hop',
              imageUrl: hopLogo,
            })
          }
          const _poolStats = getPoolStats(chain, symbol)
          pool.apr = _poolStats.apr
          pool.aprFormatted = _poolStats.aprFormatted
          pool.stakingApr = _poolStats.stakingApr
          pool.stakingAprFormatted = _poolStats.stakingAprFormatted
          pool.totalApr = _poolStats.totalApr
          pool.totalAprFormatted = _poolStats.totalAprFormatted
          pool.tvl = _poolStats.tvl
          pool.tvlFormatted = _poolStats.tvlUsdFormatted
          for (const rewardToken of _poolStats.stakingRewardTokens) {
            if (rewardToken === 'HOP') {
              continue
            }
            pool.stakingRewards.push({
              name: rewardToken,
              imageUrl: getTokenImage(rewardToken),
            })
          }

          setPools([...pools])
        } catch (err) {
          console.error('err', pool, err)

          pool.aprFormatted = toPercentDisplay(0)
          pool.stakingAprFormatted = toPercentDisplay(0)
          pool.totalAprFormatted = toPercentDisplay(0)

          setPools([...pools])
        }
      }))
    }
    update().catch(console.error)
  }, [poolStats])

  useEffect(() => {
    async function update() {
      if (!isSet) {
        return
      }
      if (isUpdating) {
        return
      }
      if (!accountAddress) {
        for (const pool of pools) {
          if (pool.canClaim) {
            pool.canClaim = false
            pool.canStake = false
            setPools([...pools])
          }
        }
        return
      }
      setIsUpdating(true)
      await Promise.all(pools.map(async (pool: any) => {
        try {
          const tokenSymbol = pool.token.symbol
          const chainSlug = pool.chain.slug
          const cacheKey = `${chainSlug}:${tokenSymbol}:${accountAddress}`
          const address = stakingRewardsContracts?.[reactAppNetwork]?.[chainSlug]?.[tokenSymbol]
          const bridge = sdk.bridge(tokenSymbol)
          const tokenDecimals = bridge.getTokenDecimals()
          const tokenUsdPrice = ['USDC', 'USDT', 'DAI'].includes(tokenSymbol) ? 1 : await bridge.priceFeed.getPriceByTokenSymbol(tokenSymbol)

          const lpToken = bridge.getSaddleLpToken(chainSlug)
          const [poolReserves, lpTokenTotalSupplyBn] = await Promise.all([
            bridge.getSaddleSwapReserves(chainSlug),
            lpToken.totalSupply(),
          ])

          if (lpTokenTotalSupplyBn.eq(0)) {
            return
          }

          let hasStakingContract = false
          let totalStakedBalance = BigNumber.from(0)
          if (address) {
            hasStakingContract = true
            const _provider = sdk.getChainProvider(pool.chain.slug)
            const contract = StakingRewards__factory.connect(address, _provider)
            const stakedBalance = await contract?.balanceOf(accountAddress)
            const earned = await contract?.earned(accountAddress)
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
            const stakedBalance = await contract?.balanceOf(accountAddress)
            const earned = await contract?.earned(accountAddress)
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

          const lpBalance = await lpToken.balanceOf(accountAddress)

          const totalLpBalance = totalStakedBalance.add(lpBalance)
          const totalToken0Deposited = totalLpBalance.mul(BigNumber.from(poolReserves[0] || 0)).div(lpTokenTotalSupplyBn)
          const totalToken1Deposited = totalLpBalance.mul(BigNumber.from(poolReserves[1] || 0)).div(lpTokenTotalSupplyBn)
          const totalCanonical = Number(formatUnits(totalToken0Deposited.add(totalToken1Deposited), tokenDecimals))
          pool.userBalanceTotalUsd = totalCanonical * tokenUsdPrice

          pool.stakingRewardsStakedTotalUsd = pool.stakingRewardsStakedUsd + pool.hopRewardsStakedUsd
          pool.stakingRewardsStakedTotalUsdFormatted = `$${commafy(pool.stakingRewardsStakedTotalUsd, 2)}`
          setPools([...pools])
        } catch (err) {
          console.error(err)
        }
      }))
    }
    update().catch(console.error)
  }, [isSet, pools, accountAddress])

  function toggleFilterToken (symbol: string) {
    for (const filterToken of filterTokens) {
      if (filterToken.symbol === symbol) {
        filterToken.enabled = !filterToken.enabled
      }
    }
    setFilterTokens([...filterTokens])
  }

  function toggleFilterChain (slug: string) {
    for (const filterChain of filterChains) {
      if (filterChain.slug === slug) {
        filterChain.enabled = !filterChain.enabled
      }
    }
    setFilterChains([...filterChains])
  }

  function toggleColumnSort(column: string) {
    if (column === columnSort) {
      setColumnSortDesc(!columnSortDesc)
    } else {
      setColumnSort(column)
      setColumnSortDesc(true)
    }
  }

  let filteredPools = pools.filter((x: any) => {
    for (const filterToken of filterTokens) {
      if (x.token.symbol === filterToken.symbol && !filterToken.enabled) {
        return false
      }
    }
    for (const filterChain of filterChains) {
      if (x.chain.slug === filterChain.slug && !filterChain.enabled) {
        return false
      }
    }
    return true
  })

  if (columnSort) {
    filteredPools = filteredPools.sort((a, b) => {
      if (columnSortDesc) {
        return b[columnSort] - a[columnSort]
      } else {
        return a[columnSort] - b[columnSort]
      }
    })
  }

  const filteredUserPools = userPools.sort((a, b) => {
    return b.userBalanceTotalUsd - a.userBalanceTotalUsd
  })

  return {
    pools: filteredPools,
    userPools: filteredUserPools,
    filterTokens,
    filterChains,
    toggleFilterToken,
    toggleFilterChain,
    toggleColumnSort,
    columnSort,
  }
}
