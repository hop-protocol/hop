import { BigNumber, FixedNumber, constants } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import {
  ethereumRpc,
  gnosisRpc,
  polygonRpc,
  optimismRpc,
  arbitrumRpc,
  novaRpc
} from './config'
import { Hop } from '@hop-protocol/sdk'
import {
  mainnet as mainnetAddresses,
  Bridges,
  RewardsContracts
} from '@hop-protocol/core/addresses'
import {
  ERC20__factory,
  StakingRewards__factory
} from '@hop-protocol/core/contracts'

const TOTAL_AMOUNTS_DECIMALS = 18
const oneYearDays = 365

type YieldDataRes = {
  apr: number
  apy: number
  tvlUsd: number
  dailyVolume: number
}

type StakingYieldDataRes = {
  apr: number
  apy: number
  rewardToken: string
  rewardTokenAddress: string
  stakingRewardsContractAddress: string
  isOptimalStakingContract: boolean
}

type PoolData = {
  apr: number
  apy: number
  tvlUsd: number
  dailyVolume: number
  error?: boolean
}

type StakingRewardsData = {
  apr: number
  apy: number
  rewardToken: string
  rewardTokenAddress: string
  isOptimalStakingContract: boolean
  error?: boolean
}

type OptimalYieldData = {
  apr: number
  apy: number
  dailyVolume: number
  rewardToken: string
  rewardTokenAddress: string
}

type Pools = {
  [token: string]: {
    [chain: string]: PoolData
  }
}

type StakingRewards = {
  [token: string]: {
    [chain: string]: {
      [rewardContractAddress: string]: StakingRewardsData
    }
  }
}

type OptimalYield = {
  [token: string]: {
    [chain: string]: OptimalYieldData
  }
}

type LegacyYieldData = {
  [token: string]: {
    [chain: string]: {
      apr: number
      apr7Day: number
      apr30Day: number
      stakingApr: number
      dailyVolume: number
    }
  }
}

type YieldData = {
  pools: Pools
  stakingRewards: StakingRewards
  optimalYield: OptimalYield
}

type YieldDatas = {
  legacyYieldData: {
    timestamp: number
    data: LegacyYieldData
  }
  yieldData: {
    timestamp: number
    data: YieldData
  }
}

type Response = {
  yieldDatas: YieldDatas
}

class YieldStats {
  sdk = new Hop('mainnet')
  bridges: Bridges
  stakingRewardsContracts: RewardsContracts

  constructor () {
    this.sdk.setChainProviderUrls({
      ethereum: ethereumRpc,
      gnosis: gnosisRpc,
      polygon: polygonRpc,
      optimism: optimismRpc,
      arbitrum: arbitrumRpc,
      nova: novaRpc
    })

    this.bridges = mainnetAddresses.bridges
    this.stakingRewardsContracts = mainnetAddresses.rewardsContracts

    console.log(
      'provider urls:',
      JSON.stringify(this.sdk.getChainProviderUrls())
    )
  }

  async getAllYields () {
    const timestamp = (Date.now() / 1000) | 0
    let yieldData: YieldData = this.initializeYieldData(this.bridges)
    for (let token in this.bridges) {
      const promises: Promise<any>[] = []
      for (let chain in this.bridges[token]) {
        const shouldSkip = this.shouldSkipYields(this.bridges, chain, token)
        if (shouldSkip) {
          continue
        }

        promises.push(
          this.getYieldData(token, chain)
            .then(res => {
              console.log(`${chain}.${token} got yield data`)
              yieldData.pools[token][chain] = {
                apr: res.apr,
                apy: res.apy,
                tvlUsd: res.tvlUsd,
                dailyVolume: res.dailyVolume
              }
            })
            .catch((err: any) => {
              yieldData.pools[token][chain].error = true
              console.error(`apr 1 day ${chain} ${token} error:`, err)
            })
        )
        promises.push(
          this.getStakingYieldData(token, chain)
            .then(res => {
              console.log(`${chain}.${token} got staking yield data`)
              for (const stakingYieldData of res) {
                yieldData.stakingRewards[token][chain][
                  stakingYieldData.stakingRewardsContractAddress
                ] = {
                  apr: stakingYieldData.apr,
                  apy: stakingYieldData.apy,
                  rewardToken: stakingYieldData.rewardToken,
                  rewardTokenAddress: stakingYieldData.rewardTokenAddress,
                  isOptimalStakingContract:
                    stakingYieldData.isOptimalStakingContract
                }
              }
            })
            .catch((err: any) => {
              console.error(`staking apr 1 ${chain} ${token} error:`, err)
            })
        )
      }

      // RPC endpoints cannot handle too many chain/token combinations at once. To avoid this,
      // get all chains for a given token before proceeding to the next token
      await Promise.all(promises)
    }

    yieldData = this.normalizeResult(yieldData)
    yieldData = await this.addCachedDataToYieldData(yieldData)
    const legacyYieldData = this.getLegacyYieldData(yieldData)

    console.log('yield data stats:')
    console.log(JSON.stringify(yieldData, null, 2))

    const yieldDatas = {
      legacyYieldData: {
        timestamp,
        data: legacyYieldData
      },
      yieldData: {
        timestamp,
        data: yieldData
      }
    }
    const response: Response = {
      yieldDatas
    }

    return response
  }

  initializeYieldData (bridges: any): YieldData {
    const yieldData: any = {}
    for (let token in bridges) {
      for (let chain in bridges[token]) {
        const shouldSkip = this.shouldSkipYields(bridges, chain, token)
        if (shouldSkip) {
          continue
        }

        if (!yieldData.pools) yieldData.pools = {}
        if (!yieldData.pools[token]) yieldData.pools[token] = {}
        if (!yieldData.pools[token][chain]) {
          yieldData.pools[token][chain] = {
            apr: 0,
            apy: 0,
            tvlUsd: 0,
            dailyVolume: 0
          }
        }

        const stakingContracts = this.stakingRewardsContracts?.[token]?.[chain]
        if (stakingContracts?.length > 0) {
          if (!yieldData.stakingRewards) yieldData.stakingRewards = {}
          if (!yieldData.stakingRewards[token])
            yieldData.stakingRewards[token] = {}
          if (!yieldData.stakingRewards[token][chain])
            yieldData.stakingRewards[token][chain] = {}
          for (const stakingContract of stakingContracts) {
            yieldData.stakingRewards[token][chain][stakingContract] = {
              apr: 0,
              apy: 0,
              rewardToken: '',
              rewardTokenAddress: '',
              isOptimalStakingContract: false
            }
          }
        }

        if (!yieldData.optimalYield) yieldData.optimalYield = {}
        if (!yieldData.optimalYield[token]) yieldData.optimalYield[token] = {}
        if (!yieldData.optimalYield[token][chain]) {
          yieldData.optimalYield[token][chain] = {
            apr: 0,
            apy: 0,
            dailyVolume: 0,
            rewardToken: '',
            rewardTokenAddress: ''
          }
        }
      }
    }

    return yieldData
  }

  normalizeResult (yieldData: YieldData): YieldData {
    yieldData = this.removeInactiveBridges(yieldData)
    yieldData = this.removeInactiveStakingContracts(yieldData)
    yieldData = this.getOptimalYield(yieldData)
    return yieldData
  }

  async addCachedDataToYieldData (yieldData: YieldData): Promise<YieldData> {
    const url = `https://assets.hop.exchange/v1.1-pool-stats.json`
    const cachedRes: any = await fetch(url)
    const cachedData = await cachedRes.json()
    for (const token in yieldData.pools) {
      const tokenData = yieldData.pools[token]
      for (const chain in tokenData) {
        const chainData = tokenData[chain]
        // If APR is missing then the entire entry is missing
        if (!chainData.apr) {
          console.log(
            `Missing APR for ${chain}.${token}`,
            yieldData.pools[token][chain]
          )
          if (!cachedData?.data?.pools?.[token]?.[chain]) {
            console.error(`Missing cached data for ${chain}.${token}`)
            continue
          }
          yieldData.pools[token][chain] = cachedData.data.pools[token][chain]
        }
      }
    }
    if (yieldData?.stakingRewards) {
      for (const token in yieldData.stakingRewards) {
        for (const chain in yieldData.stakingRewards[token]) {
          const item = yieldData.optimalYield[token][chain]
          if (!item?.dailyVolume) {
            if (cachedData?.data?.pools?.[token]?.[chain]?.dailyVolume) {
              item.dailyVolume =
                cachedData?.data?.pools?.[token]?.[chain]?.dailyVolume
            }
          }
        }
      }
    }
    return yieldData
  }

  removeInactiveBridges (yieldData: YieldData): YieldData {
    yieldData = Object.assign({}, yieldData)

    // Some bridges might have been deployed and added to the config but do not yet have a bonder
    for (const token in yieldData.pools) {
      const tokenData = yieldData.pools[token]
      // The returned data might be missing a single chain's data due to an RPC error.
      // We do not want to remove the entire bridge because of an RPC error.
      // We only want to remove bridges that are completely inactive and missing all chains
      let areAllChainsMissing = true
      for (const chain in tokenData) {
        const chainData = tokenData[chain]
        const isInactive =
          !chainData ||
          chainData?.apr === 0 ||
          chainData?.apr === null ||
          isNaN(chainData?.apr)
        if (!isInactive || chainData.error) {
          areAllChainsMissing = false
          break
        }
      }
      if (areAllChainsMissing) {
        delete yieldData.pools[token]
        delete yieldData.optimalYield[token]
        if (yieldData.stakingRewards?.[token]) {
          delete yieldData.stakingRewards[token]
        }
      }
    }

    return yieldData
  }

  removeInactiveStakingContracts (yieldData: YieldData): YieldData {
    // Some staking contracts might have been deployed and added to the config but do not yet have rewards active
    for (const token in yieldData.stakingRewards) {
      const tokenData = yieldData.stakingRewards[token]
      for (const chain in tokenData) {
        const stakingRewardData = yieldData.stakingRewards?.[token]?.[chain]
        for (const stakingRewardsContractAddress in stakingRewardData) {
          const stakingRewardsData =
            stakingRewardData[stakingRewardsContractAddress]
          if (stakingRewardsData.apr === 0) {
            delete yieldData.stakingRewards[token][chain][
              stakingRewardsContractAddress
            ]
          }
        }
        const isStakingContractsForChainRemaining =
          Object.keys(yieldData.stakingRewards[token][chain]).length > 0
        if (!isStakingContractsForChainRemaining) {
          delete yieldData.stakingRewards[token][chain]
        }
      }
      const isStakingContractsForTokenRemaining =
        Object.keys(yieldData.stakingRewards[token]).length > 0
      if (!isStakingContractsForTokenRemaining) {
        delete yieldData.stakingRewards[token]
      }
    }

    return yieldData
  }

  getOptimalYield (yieldData: YieldData): YieldData {
    for (const token in yieldData.pools) {
      const tokenData = yieldData.pools[token]
      for (const chain in tokenData) {
        const stakingRewardData = yieldData.stakingRewards?.[token]?.[chain]
        for (const stakingRewardsContractAddress in stakingRewardData) {
          const stakingRewardsData =
            stakingRewardData[stakingRewardsContractAddress]
          if (stakingRewardsData.isOptimalStakingContract) {
            if (stakingRewardsData.rewardToken === 'HOP') {
              console.log('here0', token, chain, yieldData.pools[token][chain])
            }
            yieldData.optimalYield[token][chain] = {
              apr: yieldData.pools[token][chain].apr + stakingRewardsData.apr,
              apy: yieldData.pools[token][chain].apy + stakingRewardsData.apy,
              dailyVolume: yieldData.pools[token][chain].dailyVolume,
              rewardToken: stakingRewardsData.rewardToken,
              rewardTokenAddress: stakingRewardsData.rewardTokenAddress
            }
          }
        }
        // If there is no optimal staking contract, just use the pool yield
        const isNoOptimalStakingContract =
          yieldData.optimalYield[token][chain].apy === 0
        if (isNoOptimalStakingContract) {
          yieldData.optimalYield[token][chain] = {
            apr: yieldData.pools[token][chain].apr,
            apy: yieldData.pools[token][chain].apy,
            dailyVolume: yieldData.pools[token][chain].dailyVolume,
            rewardToken: '',
            rewardTokenAddress: ''
          }
        }
      }
    }

    return yieldData
  }

  getLegacyYieldData (yieldData: YieldData): LegacyYieldData {
    const legacyYieldData: LegacyYieldData = {}
    for (const token in yieldData.optimalYield) {
      const tokenData = yieldData.optimalYield[token]
      for (const chain in tokenData) {
        if (!legacyYieldData[token]) {
          legacyYieldData[token] = {}
        }
        const stakingRewardData = yieldData.stakingRewards?.[token]?.[chain]
        let stakingApr: number = 0
        for (const stakingRewardsContractAddress in stakingRewardData) {
          const stakingRewardsData =
            stakingRewardData[stakingRewardsContractAddress]
          if (stakingRewardsData.isOptimalStakingContract) {
            stakingApr = stakingRewardsData.apr
          }
        }
        legacyYieldData[token][chain] = {
          apr: yieldData.pools[token][chain].apr,
          apr7Day: 0,
          apr30Day: 0,
          stakingApr,
          dailyVolume: yieldData.pools[token][chain].dailyVolume
        }
      }
    }

    return legacyYieldData
  }

  async getYieldData (token: string, chain: string): Promise<YieldDataRes> {
    const bridge = this.sdk.bridge(token)
    const amm = bridge.getAmm(chain)
    const { apr, apy, volumeFormatted } = await amm.getYieldData()
    const tvl = await bridge.getTvlUsd(chain)
    return {
      apr: apr ?? 0,
      apy: apy ?? 0,
      tvlUsd: tvl ?? 0,
      dailyVolume: volumeFormatted ?? 0
    }
  }

  async getStakingYieldData (
    token: string,
    chain: string
  ): Promise<StakingYieldDataRes[]> {
    const bridge = this.sdk.bridge(token)
    const canonToken = bridge.getCanonicalToken(chain)
    const amm = bridge.getAmm(chain)

    const provider = this.sdk.getChainProvider(chain)
    const stakingRewardsAddresses = this.stakingRewardsContracts?.[token]?.[
      chain
    ]
    if (!stakingRewardsAddresses?.length) {
      return []
    }

    let currentOptimalApr = 0
    const stakingYieldData: StakingYieldDataRes[] = []
    for (const stakingRewardsAddress of stakingRewardsAddresses) {
      const assetBridge = this.sdk.bridge(token)
      const stakingRewards = StakingRewards__factory.connect(
        stakingRewardsAddress,
        provider
      )
      const stakingToken = assetBridge.getSaddleLpToken(chain)

      const totalStaked = await stakingToken.balanceOf(stakingRewards?.address)
      if (totalStaked.lte(0)) {
        continue
      }

      const stakedTotal = await amm.calculateTotalAmountForLpToken(totalStaked)
      if (stakedTotal.lte(0)) {
        continue
      }

      const tokenUsdPrice = await bridge.priceFeed.getPriceByTokenSymbol(token)

      const rewardsTokenAddr = await stakingRewards.rewardsToken()
      const rewardsToken = ERC20__factory.connect(rewardsTokenAddr, provider)
      const rewardsTokenSymbol = await rewardsToken.symbol()
      const rewardTokenUsdPrice = await bridge?.priceFeed.getPriceByTokenSymbol(
        rewardsTokenSymbol
      )

      const timestamp = await stakingRewards.periodFinish()
      const rewardsExpired = await this.isRewardsExpired(timestamp)

      let totalRewardsPerDay = BigNumber.from(0)
      if (!rewardsExpired) {
        const rewardRate = await stakingRewards.rewardRate()
        totalRewardsPerDay = rewardRate.mul(86400) // multiply by 1 day
      }

      const { apr, apy } = this.calculateStakingYield(
        canonToken.decimals,
        tokenUsdPrice,
        rewardTokenUsdPrice,
        stakedTotal,
        totalRewardsPerDay
      )

      // Sanity check
      if ((apr <= 0 && apy > 0) || (apy <= 0 && apr > 0)) {
        throw new Error(
          'Cannot have negative APR and positive APY or vice versa'
        )
      }

      let rewardToken = ''
      let rewardTokenAddress = ''
      let stakingRewardsContractAddress = ''
      const isActiveRewards = apr > 0 && apy > 0
      if (isActiveRewards) {
        rewardToken = rewardsTokenSymbol
        rewardTokenAddress = rewardsTokenAddr
        stakingRewardsContractAddress = stakingRewardsAddress
      } else {
        continue
      }

      stakingYieldData.push({
        apr,
        apy,
        rewardToken,
        rewardTokenAddress,
        stakingRewardsContractAddress,
        isOptimalStakingContract: apr > currentOptimalApr
      })
      currentOptimalApr = apr > currentOptimalApr ? apr : currentOptimalApr
    }
    return stakingYieldData
  }

  async isRewardsExpired (timestamp: BigNumber) {
    const expirationDate = Number(timestamp.toString())
    const now = (Date.now() / 1000) | 0
    return now > expirationDate
  }

  // ((REWARD-TOKEN_PER_DAY * REWARD-TOKEN_PRICE)/((STAKED_USDC + STAKED_HUSDC)*STAKED_TOKEN_PRICE)) * DAYS_PER_YEAR
  calculateStakingYield (
    tokenDecimals: number,
    tokenUsdPrice: number,
    rewardTokenUsdPrice: number,
    stakedTotal: BigNumber,
    totalRewardsPerDay: BigNumber
  ) {
    const rewardTokenUsdPriceBn = this.amountToBN(
      rewardTokenUsdPrice.toString(),
      TOTAL_AMOUNTS_DECIMALS
    )
    const tokenUsdPriceBn = this.amountToBN(
      tokenUsdPrice.toString(),
      TOTAL_AMOUNTS_DECIMALS
    )
    const stakedTotal18d = this.shiftBNDecimals(
      stakedTotal,
      TOTAL_AMOUNTS_DECIMALS - tokenDecimals
    )
    const precision = this.amountToBN('1', TOTAL_AMOUNTS_DECIMALS)
    const rateBn = totalRewardsPerDay
      .mul(rewardTokenUsdPriceBn)
      .mul(precision)
      .div(stakedTotal18d.mul(tokenUsdPriceBn))

    const rate = Number(formatUnits(rateBn.toString(), TOTAL_AMOUNTS_DECIMALS))
    const apr = rate * oneYearDays
    const apy = (1 + rate) ** oneYearDays - 1

    return {
      apr,
      apy
    }
  }

  shiftBNDecimals (bn: BigNumber, shiftAmount: number): BigNumber {
    if (shiftAmount < 0) throw new Error('shiftAmount must be positive')
    return bn.mul(BigNumber.from(10).pow(shiftAmount))
  }

  amountToBN (amount: string | number, decimals: number = 18) {
    const fixedAmount = this.fixedDecimals(amount.toString(), decimals)
    return parseUnits(fixedAmount || '0', decimals)
  }

  fixedDecimals (amount: string, decimals: number = 18) {
    if (amount === '') {
      return amount
    }
    const mdAmount = this.maxDecimals(amount, decimals)
    return FixedNumber.from(mdAmount).toString()
  }

  maxDecimals (amount: string, decimals: number) {
    const sanitizedAmount = this.sanitizeNumericalString(amount)
    const indexOfDecimal = sanitizedAmount.indexOf('.')
    if (indexOfDecimal === -1) {
      return sanitizedAmount
    }

    const wholeAmountStr = sanitizedAmount.slice(0, indexOfDecimal) || '0'
    const wholeAmount = BigNumber.from(wholeAmountStr).toString()

    const fractionalAmount = sanitizedAmount.slice(indexOfDecimal + 1)
    const decimalAmount =
      decimals !== 0 ? `.${fractionalAmount.slice(0, decimals)}` : ''

    return `${wholeAmount}${decimalAmount}`
  }

  sanitizeNumericalString (numStr: string) {
    return numStr.replace(/[^0-9.]|\.(?=.*\.)/g, '')
  }

  shouldSkipYields (bridges: any, chain: string, token: string) {
    if (chain === 'ethereum') {
      return true
    }
    if (!bridges[token][chain]) {
      return true
    }
    if (bridges[token][chain].l2CanonicalToken === constants.AddressZero) {
      return true
    }
    if (token === 'HOP') {
      return true
    }
    if (bridges[token][chain].l2SaddleSwap === constants.AddressZero) {
      return true
    }
    return false
  }
}

export default YieldStats
