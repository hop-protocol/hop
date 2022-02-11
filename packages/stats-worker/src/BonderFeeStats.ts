import BlockDater from 'ethereum-block-by-date'
import { BigNumber, providers, Contract, constants } from 'ethers'
import {
  formatUnits,
  parseEther,
  formatEther,
  parseUnits
} from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db from './Db'
import {
  ethereumRpc,
  gnosisRpc,
  polygonRpc,
  optimismRpc,
  arbitrumRpc
} from './config'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { erc20Abi } from '@hop-protocol/core/abi'

const allProviders: any = {
  ethereum: new providers.StaticJsonRpcProvider(ethereumRpc),
  gnosis: new providers.StaticJsonRpcProvider(gnosisRpc),
  polygon: new providers.StaticJsonRpcProvider(polygonRpc),
  optimism: new providers.StaticJsonRpcProvider(optimismRpc),
  arbitrum: new providers.StaticJsonRpcProvider(arbitrumRpc)
}

function nearestDate (dates: any[], target: any) {
  if (!target) {
    target = Date.now()
  } else if (target instanceof Date) {
    target = target.getTime()
  }

  var nearest = Infinity
  var winner = -1

  dates.forEach(function (date, index) {
    if (date instanceof Date) date = date.getTime()
    var distance = Math.abs(date - target)
    if (distance < nearest) {
      nearest = distance
      winner = index
    }
  })

  return winner
}

const tokenDecimals: any = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18
}

function sumAmounts (items: any) {
  let sum = BigNumber.from(0)
  for (let item of items) {
    const amount = BigNumber.from(item.amount)
    sum = sum.add(amount)
  }
  return sum
}

type Options = {
  days?: number
}

class BonderFeeStats {
  db = new Db()
  days: number = 1

  constructor (options: Options = {}) {
    if (options.days) {
      this.days = options.days
    }

    process.once('uncaughtException', async err => {
      console.error('uncaughtException:', err)
      this.cleanUp()
      process.exit(0)
    })

    process.once('SIGINT', () => {
      this.cleanUp()
    })
  }

  cleanUp () {
    console.log('closing db')
    this.db.close()
  }

  async getPriceHistory (coinId: string, days: number) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    return fetch(url)
      .then(res => res.json())
      .then(json =>
        json.prices.map((data: any[]) => {
          data[0] = Math.floor(data[0] / 1000)
          return data
        })
      )
  }

  async track () {
    const initialAggregateBalances: any = {
      USDC: parseUnits('6026000', 6),
      USDT: parseUnits('2121836', 6),
      DAI: parseUnits('5000000', 18),
      ETH: parseUnits('3984', 18),
      MATIC: parseUnits('731948.94', 18)
    }

    const initialAggregateNativeBalances: any = {
      USDC: {
        ethereum: parseUnits('14', 18)
      }
    }

    const initialUnstakedAmounts: any = {
      USDC: parseUnits('0', 6),
      USDT: parseUnits('0', 6),
      DAI: parseUnits('0', 18),
      ETH: parseEther('0'),
      MATIC: parseUnits('0', 18)
    }

    const restakedProfits: any = {
      USDC: {
        1627628400: parseUnits('9000', 6),
        1642838400: parseUnits('2998.70', 6)
      },
      USDT: {},
      DAI: {},
      ETH: {
        1643184000: parseEther('10')
      },
      MATIC: {}
    }

    const daysN = this.days
    console.log('daysN', daysN)
    const now = DateTime.utc()

    for (let day = 0; day < daysN; day++) {
      console.log('day', day)
      const timestamp = now.minus({ days: day }).toSeconds() | 0
      const datas = await this.fetchData(timestamp)
      const { data, pricesMap } = datas[0]

      const tokens = ['USDC', 'USDT', 'DAI', 'ETH', 'MATIC']
      for (const token of tokens) {
        const initialAggregateBalance = initialAggregateBalances[token]
        const initialUnstakedAmount = initialUnstakedAmounts[token]
        const initialAggregateNativeBalance =
          initialAggregateNativeBalances?.[token]

        let profits = BigNumber.from(0)
        for (const ts in restakedProfits[token]) {
          if (Number(ts) < timestamp) {
            profits = profits.add(restakedProfits[token][ts])
          }
        }

        const { resultFormatted, resultUsd } = await this.computeResult({
          data,
          token,
          initialAggregateBalance,
          initialUnstakedAmount,
          initialAggregateNativeBalance,
          profits,
          prices: pricesMap
        })
        console.log('results', timestamp, token, resultFormatted, resultUsd)

        try {
          this.db.upsertBonderBalanceStat(
            token,
            resultFormatted,
            resultUsd,
            timestamp
          )
          console.log('upserted')
        } catch (err) {
          if (!err.message.includes('UNIQUE constraint failed')) {
            throw err
          }
        }
      }
    }
  }

  async fetchData (timestamp: number) {
    const now = DateTime.utc()
    let tokens = ['USDC', 'USDT', 'DAI', 'MATIC', 'ETH']
    let chains = ['polygon', 'gnosis', 'arbitrum', 'optimism', 'ethereum']

    const daysN = 180
    const pricesArr = await Promise.all([
      this.getPriceHistory('usd-coin', daysN),
      this.getPriceHistory('tether', daysN),
      this.getPriceHistory('dai', daysN),
      this.getPriceHistory('ethereum', daysN),
      this.getPriceHistory('matic-network', daysN),
      this.getPriceHistory('wrapped-bitcoin', daysN)
    ])
    const prices: any = {
      USDC: pricesArr[0],
      USDT: pricesArr[1],
      DAI: pricesArr[2],
      ETH: pricesArr[3],
      MATIC: pricesArr[4],
      WBTC: pricesArr[5]
    }

    const datas: any = {}

    const bonders = (mainnetAddresses as any).bonders
    const data: any = {}
    const pricesMap: any = {}
    const promises: Promise<any>[] = []

    for (const token in bonders) {
      const promise = new Promise(async resolve => {
        for (const sourceChain in bonders[token]) {
          for (const destinationChain in bonders[token][sourceChain]) {
            const chain = destinationChain
            const provider = allProviders[chain]
            const bonder = bonders[token][sourceChain][destinationChain]
            if (data?.[bonder]?.[token]?.[chain]) {
              continue
            }
            if (!data[bonder]) {
              data[bonder] = {}
            }
            if (!data[bonder][token]) {
              data[bonder][token] = {}
            }
            if (!data[bonder][token][chain]) {
              data[bonder][token][chain] = {}
            }
            if (!data[bonder][token][chain].canonical) {
              data[bonder][token][chain].canonical = BigNumber.from(0)
            }
            if (!data[bonder][token][chain].hToken) {
              data[bonder][token][chain].hToken = BigNumber.from(0)
            }
            if (!data[bonder][token][chain].native) {
              data[bonder][token][chain].native = BigNumber.from(0)
            }
            const bridge = (mainnetAddresses as any).bridges[token][chain]
            const tokenAddress =
              bridge.l2CanonicalToken ?? bridge.l1CanonicalToken
            const hTokenAddress = bridge.l2HopBridgeToken
            const tokenContract = new Contract(tokenAddress, erc20Abi, provider)
            const hTokenContract = hTokenAddress
              ? new Contract(hTokenAddress, erc20Abi, provider)
              : null

            const endDate = DateTime.fromSeconds(timestamp).endOf('day')
            // const endDate = now.minus({ days: day }).endOf('day')
            const startDate = endDate.startOf('day')
            const endTimestamp = Math.floor(endDate.toSeconds())
            const startTimestamp = Math.floor(startDate.toSeconds())

            const dates = prices[token].reverse().map((x: any) => x[0])
            const nearest = nearestDate(dates, endDate)
            const price = prices[token][nearest][1]
            pricesMap[token] = price

            console.log(
              `fetching daily bonder fee stats, chain: ${chain}, token: ${token}, timestamp: ${timestamp}`
            )

            const blockDater = new BlockDater(provider)
            const date = DateTime.fromSeconds(endTimestamp).toJSDate()
            const info = await blockDater.getDate(date)
            if (!info) {
              throw new Error('no info')
            }
            const blockTag = info.block
            let balance: any
            let hBalance: any
            let native: any
            try {
              if (
                tokenAddress === constants.AddressZero &&
                chain === 'ethereum'
              ) {
                balance = await provider.getBalance(bonder, blockTag)
              } else {
                balance = await tokenContract.balanceOf(bonder, {
                  blockTag
                })
              }
              if (hTokenContract) {
                hBalance = await hTokenContract.balanceOf(bonder, {
                  blockTag
                })
              }

              native = await provider.getBalance(bonder, blockTag)
            } catch (err) {
              console.error(`${chain} ${token} ${err.message}`)
              throw err
            }

            if (balance) {
              data[bonder][token][chain].canonical = balance
            }
            if (hBalance) {
              data[bonder][token][chain].hToken = hBalance
            }
            if (native) {
              data[bonder][token][chain].native = native
            }

            console.log(`done fetching daily bonder fee stats, chain: ${chain}`)
            // console.log(JSON.stringify(data, null, 2))
          }
        }
        resolve(null)
      })
      promises.push(promise)
    }
    await Promise.all(promises)
    datas[0] = { data, pricesMap }

    // console.log(JSON.stringify(data, null, 2))
    console.log('all done')
    return datas
  }

  async computeResult (config: any) {
    const {
      data,
      token,
      initialAggregateBalance,
      initialUnstakedAmount,
      initialAggregateNativeBalance,
      profits,
      prices
    } = config
    const chains = ['ethereum', 'polygon', 'gnosis', 'optimism', 'arbitrum']
    let aggregateBalance = BigNumber.from(0)
    const nativeBalances: Record<string, any> = {}
    for (const chain of chains) {
      nativeBalances[chain] = BigNumber.from(0)
    }
    aggregateBalance = aggregateBalance.sub(initialUnstakedAmount).add(profits)
    for (const bonder in data) {
      for (const chain in data[bonder][token]) {
        const info = data[bonder][token][chain]
        const canonical = BigNumber.from(info.canonical)
        const hToken = BigNumber.from(info.hToken)
        const native = BigNumber.from(info.native)
        aggregateBalance = aggregateBalance.add(canonical).add(hToken)
        nativeBalances[chain] = native
      }
    }
    const nativeTokenDiffs: Record<string, any> = {}
    for (const chain of chains) {
      nativeTokenDiffs[chain] = nativeBalances[chain].sub(
        initialAggregateNativeBalance?.[chain] ?? 0
      )
    }
    const nativeTokenDiffsInToken: Record<string, any> = {}
    for (const chain of chains) {
      const multiplier = parseEther('1')
      const nativeSymbol = getChainNativeTokenSymbol(chain)
      const nativeTokenPriceUsdWei = parseEther(prices[nativeSymbol].toString())
      const tokenPriceUsdWei = parseEther(prices[token].toString())
      const nativeTokenDecimals = tokenDecimals[nativeSymbol]
      const rate = nativeTokenPriceUsdWei.mul(multiplier).div(tokenPriceUsdWei)
      const exponent = nativeTokenDecimals - tokenDecimals[token]

      const diff = nativeTokenDiffs[chain]
      const resultInTokenWei = diff.mul(rate).div(multiplier)
      const resultInToken = resultInTokenWei.div(
        BigNumber.from(10).pow(exponent)
      )
      nativeTokenDiffsInToken[chain] = resultInToken
    }
    let nativeTokenDiffSum = BigNumber.from(0)
    for (const chain of chains) {
      nativeTokenDiffSum = nativeTokenDiffSum.add(
        nativeTokenDiffsInToken[chain]
      )
    }
    const result = aggregateBalance.add(nativeTokenDiffSum)
    const resultFormatted = Number(
      formatUnits(result.toString(), tokenDecimals[token])
    )
    const resultUsd = resultFormatted * prices[token]

    return {
      token,
      resultFormatted,
      resultUsd
    }
  }
}

export default BonderFeeStats

function getChainNativeTokenSymbol (chain: string) {
  if (chain === 'polygon') {
    return 'MATIC'
  } else if (chain === 'gnosis') {
    return 'DAI'
  }

  return 'ETH'
}
