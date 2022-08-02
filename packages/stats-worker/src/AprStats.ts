import { BigNumber, FixedNumber, constants } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import {
  ethereumRpc,
  gnosisRpc,
  polygonRpc,
  optimismRpc,
  arbitrumRpc
} from './config'
import { Hop } from '@hop-protocol/sdk'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import {
  StakingRewards,
  StakingRewards__factory
} from '@hop-protocol/core/contracts'

const TOTAL_AMOUNTS_DECIMALS = 18
const oneYearDays = 365

const stakingRewardsContracts: any = {
  polygon: {
    ETH: '0x7bCeDA1Db99D64F25eFA279BB11CE48E15Fda427',
    MATIC: '0x7dEEbCaD1416110022F444B03aEb1D20eB4Ea53f',
    DAI: '0x4Aeb0B5B1F3e74314A7Fa934dB090af603E8289b',
    USDC: '0x2C2Ab81Cf235e86374468b387e241DF22459A265',
    USDT: '0x07932e9A5AB8800922B2688FB1FA0DAAd8341772'
  },
  gnosis: {
    ETH: '0xC61bA16e864eFbd06a9fe30Aab39D18B8F63710a',
    DAI: '0x12a3a66720dD925fa93f7C895bC20Ca9560AdFe7',
    USDC: '0x5D13179c5fa40b87D53Ff67ca26245D3D5B2F872',
    USDT: '0x2C2Ab81Cf235e86374468b387e241DF22459A265'
  }
}

const rewardTokenAddresses: any = {
  WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  GNO: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'
}

type PoolData = {
  apr: number
  stakingApr?: number
}

type Data = { [token: string]: { [chain: string]: PoolData } }

type Response = {
  timestamp: number
  data: Data
}

class AprStats {
  sdk = new Hop('mainnet')

  constructor () {
    this.sdk.setChainProviderUrls({
      ethereum: ethereumRpc,
      gnosis: gnosisRpc,
      polygon: polygonRpc,
      optimism: optimismRpc,
      arbitrum: arbitrumRpc
    })

    console.log(
      'provider urls:',
      JSON.stringify(this.sdk.getChainProviderUrls())
    )
  }

  async getAllAprs () {
    const timestamp = (Date.now() / 1000) | 0
    const data: Data = {}
    const bridges: any = mainnetAddresses.bridges
    const promises: Promise<any>[] = []
    for (let token in bridges) {
      for (let chain in bridges[token]) {
        if (chain === 'ethereum') {
          continue
        }
        if (!bridges[token][chain]) {
          continue
        }
        if (bridges[token][chain].l2CanonicalToken === constants.AddressZero) {
          continue
        }
        if (!data[token]) {
          data[token] = {}
        }
        if (!data[token][chain]) {
          data[token][chain] = {
            apr: 0,
            stakingApr: 0
          }
        }
        promises.push(
          this.getApr(token, chain)
            .then(apr => {
              console.log(`${chain}.${token} got apr`)
              data[token][chain].apr = apr
            })
            .catch(err => console.error(err))
        )
        promises.push(
          this.getStakingApr(token, chain)
            .then(apr => {
              if (apr) {
                console.log(`${chain}.${token} got staking apr`)
                data[token][chain].stakingApr = apr
              }
            })
            .catch(err => console.error(err))
        )
      }
    }

    await Promise.all(promises)
    console.log(JSON.stringify(data, null, 2))
    const response: Response = {
      timestamp,
      data
    }

    return response
  }

  async getApr (token: string, chain: string) {
    const bridge = this.sdk.bridge(token)
    const amm = bridge.getAmm(chain)
    const apr = await amm.getApr()
    if (!apr) {
      return 0
    }
    return apr
  }

  async getStakingApr (token: string, chain: string): Promise<number> {
    const bridge = this.sdk.bridge(token)
    const canonToken = await bridge.getCanonicalToken(chain)
    const amm = bridge.getAmm(chain)

    const _provider = this.sdk.getChainProvider(chain)
    const srAddrs = stakingRewardsContracts[chain]
    if (!srAddrs) {
      return 0
    }
    const _stakingRewards = Object.keys(srAddrs).reduce((acc, tokenSymbol) => {
      const addr = srAddrs[tokenSymbol]
      return {
        ...acc,
        [tokenSymbol.toLowerCase()]: StakingRewards__factory.connect(
          addr,
          _provider
        )
      }
    }, {} as { [key: string]: StakingRewards })

    const allBridges = {
      eth: this.sdk.bridge('ETH'),
      matic: this.sdk.bridge('MATIC'),
      dai: this.sdk.bridge('DAI'),
      usdc: this.sdk.bridge('USDC'),
      usdt: this.sdk.bridge('USDT')
    }

    const stakingTokens: any = {
      eth: allBridges.eth.getSaddleLpToken(chain),
      matic: allBridges.matic.getSaddleLpToken(chain),
      dai: allBridges.dai.getSaddleLpToken(chain),
      usdc: allBridges.usdc.getSaddleLpToken(chain),
      usdt: allBridges.usdt.getSaddleLpToken(chain)
    }

    const stakingRewards = _stakingRewards?.[token.toLowerCase()]
    const stakingToken = stakingTokens?.[token.toLowerCase()]
    if (!stakingRewards) {
      return 0
    }
    if (!stakingToken) {
      return 0
    }

    const totalStaked = await stakingToken.balanceOf(stakingRewards?.address)
    if (totalStaked.lte(0)) {
      return 0
    }
    let stakedTotal = BigNumber.from(0)
    try {
      stakedTotal = await amm.calculateTotalAmountForLpToken(totalStaked)
    } catch (err) {
      return 0
    }
    if (stakedTotal.lte(0)) {
      return 0
    }
    const tokenUsdPrice = await bridge.priceFeed.getPriceByTokenSymbol(token)
    const rewardTokenSymbol = chain === 'gnosis' ? 'GNO' : 'MATIC'
    const rewardTokenUsdPrice = await allBridges.eth?.priceFeed.getPriceByTokenSymbol(
      rewardTokenSymbol
    )

    let rewardsExpired = false
    const timestamp = await stakingRewards.periodFinish()
    rewardsExpired = await this.isRewardsExpired(timestamp)

    let totalRewardsPerDay = BigNumber.from(0)
    if (!rewardsExpired) {
      const rewardRate = await stakingRewards.rewardRate()
      totalRewardsPerDay = rewardRate.mul(86400) // multiply by 1 day
    }

    const aprBn = this.calculateStakingApr(
      canonToken.decimals,
      tokenUsdPrice,
      rewardTokenUsdPrice,
      stakedTotal,
      totalRewardsPerDay
    )

    return Number(formatUnits(aprBn.toString(), TOTAL_AMOUNTS_DECIMALS))
  }

  // ((REWARD-TOKEN_PER_DAY * REWARD-TOKEN_PRICE)/((STAKED_USDC + STAKED_HUSDC)*STAKED_TOKEN_PRICE)) * DAYS_PER_YEAR
  calculateStakingApr (
    tokenDecimals: number,
    tokenUsdPrice: number,
    rewardTokenUsdPrice: number,
    stakedTotal: BigNumber,
    totalRewardsPerDay: BigNumber
  ) {
    const rewardTokenUsdPriceBn = this.amountToBN(
      rewardTokenUsdPrice.toString(),
      18
    )
    const tokenUsdPriceBn = this.amountToBN(tokenUsdPrice.toString(), 18)
    const stakedTotal18d = this.shiftBNDecimals(
      stakedTotal,
      TOTAL_AMOUNTS_DECIMALS - tokenDecimals
    )
    const precision = this.amountToBN('1', 18)

    return totalRewardsPerDay
      .mul(rewardTokenUsdPriceBn)
      .mul(precision)
      .div(stakedTotal18d.mul(tokenUsdPriceBn))
      .mul(oneYearDays)
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

  async isRewardsExpired (timestamp: BigNumber) {
    const expirationDate = Number(timestamp.toString())
    const now = (Date.now() / 1000) | 0
    return now > expirationDate
  }
}

export default AprStats
