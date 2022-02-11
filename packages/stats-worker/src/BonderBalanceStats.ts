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

// DATA /////////////////////////////////////////////
const arbitrumAliases: Record<string, string> = {
  USDC: '0xbdacabf20ef2338d7f4a152af43beddc80c6bf3b',
  USDT: '0x81B872dDc3413E3456E5A3b2c30cB749c9578e30',
  DAI: '0x36b6a48c35e75bd2eff53d94f0bb60d5a00e47fb',
  ETH: '0xfe0368be00308980b5b3fcd0975d47c4c8e1493b',
  WBTC: '0x22902f67cd7570e0e8fd30264f96ca39eebc2b6f'
}

const totalBalances: Record<string, BigNumber> = {
  USDC: parseUnits('6026000', 6),
  USDT: parseUnits('2121836', 6),
  DAI: parseUnits('5000000', 18),
  ETH: parseUnits('3984', 18),
  MATIC: parseUnits('731948.94', 18)
}

const initialAggregateBalances: Record<string, BigNumber> = {
  USDC: parseUnits('0', 6),
  USDT: parseUnits('58043.34', 6),
  DAI: parseUnits('0', 18),
  ETH: parseUnits('0', 18),
  MATIC: parseUnits('0', 18),
  WBTC: parseUnits('0', 8)
}

const initialAggregateNativeBalances: any = {
  USDC: {
    // ethereum: parseUnits('14', 18)
  }
}

const unstakedAmounts: Record<string, any> = {
  USDC: {
    1625036400: parseUnits('9955.84', 6) // 06/30/2021
  },
  USDT: {},
  DAI: {
    1637481600: parseEther('8752.88'), // 11/11/2021
    1637481601: parseEther('23422.52'), // 11/11/2021
    1643961600: parseUnits('300000', 18) // 02/4/2022
  },
  ETH: {
    1639555200: parseEther('6.07'), // 12/15/2021
    1639641600: parseEther('26') // 12/16/2021
  },
  MATIC: {},
  WBTC: {}
}

const restakedProfits: Record<string, any> = {
  USDC: {
    1627628400: parseUnits('9000', 6), // 7/30/2021
    1637395200: parseUnits('1340.36', 6), // 11/20/2021
    1643443200: parseUnits('2998.70', 6) // 01/29/2022
  },
  USDT: {},
  DAI: {
    1644220800: parseUnits('300000', 18), // 02/7/2022 // idle
    1644566400: parseUnits('8752.88', 18), // 02/11/2022
    1644566401: parseUnits('23422.52', 18) // 02/11/2022
  },
  ETH: {
    1640678400: parseEther('6.07'), // 12/28/2021
    1643184000: parseEther('10') // 01/26/2022
  },
  MATIC: {},
  WBTC: {}
}

/////////////////////////////////////////////////////

type Options = {
  days?: number
  skipDays?: number
  tokens?: string[]
}

class BonderBalanceStats {
  db = new Db()
  days: number = 1
  skipDays: number = 0
  tokens?: string[] = ['USDC', 'USDT', 'DAI', 'ETH', 'MATIC', 'WBTC']

  chains = ['ethereum', 'polygon', 'gnosis', 'optimism', 'arbitrum']

  allProviders: Record<string, any> = {
    ethereum: new providers.StaticJsonRpcProvider(ethereumRpc),
    gnosis: new providers.StaticJsonRpcProvider(gnosisRpc),
    polygon: new providers.StaticJsonRpcProvider(polygonRpc),
    optimism: new providers.StaticJsonRpcProvider(optimismRpc),
    arbitrum: new providers.StaticJsonRpcProvider(arbitrumRpc)
  }

  tokenDecimals: Record<string, number> = {
    USDC: 6,
    USDT: 6,
    DAI: 18,
    MATIC: 18,
    ETH: 18,
    WBTC: 8
  }

  constructor (options: Options = {}) {
    if (options.days) {
      this.days = options.days
    }
    if (options.skipDays) {
      this.skipDays = options.skipDays
    }
    if (options.tokens) {
      this.tokens = options.tokens
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
    //this.db.close()
  }

  async run () {
    try {
      await this.track()
    } catch (err) {
      console.error(err)
    }
  }

  async track () {
    console.log('days', this.days)
    console.log('skipDays', this.skipDays)
    console.log('chains', this.chains)
    console.log('tokens', this.tokens)

    const priceDays = 365
    const pricesArr = await Promise.all([
      this.getPriceHistory('usd-coin', priceDays),
      this.getPriceHistory('tether', priceDays),
      this.getPriceHistory('dai', priceDays),
      this.getPriceHistory('ethereum', priceDays),
      this.getPriceHistory('matic-network', priceDays),
      this.getPriceHistory('wrapped-bitcoin', priceDays)
    ])
    const prices: Record<string, any> = {
      USDC: pricesArr[0],
      USDT: pricesArr[1],
      DAI: pricesArr[2],
      ETH: pricesArr[3],
      MATIC: pricesArr[4],
      WBTC: pricesArr[5]
    }

    const now = DateTime.utc()
    const promises: Promise<any>[] = []
    for (let day = 0; day < this.days; day++) {
      const dayN = day + this.skipDays
      console.log('day', dayN)
      promises.push(
        new Promise(async resolve => {
          try {
            const timestamp = now.minus({ days: dayN }).toSeconds() | 0
            const { bonderBalances, priceMap } = await this.fetchBonderBalances(
              timestamp,
              prices
            )

            for (const token of this.tokens) {
              const initialAggregateBalance = initialAggregateBalances?.[token]
              const initialAggregateNativeBalance =
                initialAggregateNativeBalances?.[token]

              let restakedAmount = BigNumber.from(0)
              for (const ts in restakedProfits[token]) {
                if (Number(ts) <= timestamp) {
                  restakedAmount = restakedAmount.add(
                    restakedProfits[token][ts]
                  )
                  console.log(
                    'add profit',
                    restakedProfits[token][ts].toString()
                  )
                }
              }

              let unstakedAmount = BigNumber.from(0)
              for (const ts in unstakedAmounts[token]) {
                if (Number(ts) <= timestamp) {
                  unstakedAmount = unstakedAmount.add(
                    unstakedAmounts[token][ts]
                  )
                  console.log(
                    'subtract unstaked amount',
                    unstakedAmounts[token][ts].toString()
                  )
                }
              }

              const { resultFormatted, resultUsd } = await this.computeResult({
                bonderBalances,
                token,
                initialAggregateBalance,
                initialAggregateNativeBalance,
                restakedAmount,
                unstakedAmount,
                priceMap
              })

              console.log(
                'results',
                timestamp,
                token,
                resultFormatted,
                resultUsd
              )

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
          } catch (err) {
            console.error(err)
          }

          resolve(null)
        })
      )
    }
    await Promise.all(promises)
  }

  async fetchBonderBalances (timestamp: number, prices: any) {
    const now = DateTime.utc()

    const bonders = (mainnetAddresses as any).bonders
    const bonderBalances: any = {}
    const priceMap: any = {}
    const promises: Promise<any>[] = []

    for (const token in bonders) {
      const endDate = DateTime.fromSeconds(timestamp).endOf('day')
      const startDate = endDate.startOf('day')
      const endTimestamp = Math.floor(endDate.toSeconds())
      const startTimestamp = Math.floor(startDate.toSeconds())

      const dates = prices[token].reverse().map((x: any) => x[0])
      const nearest = this.nearestDate(dates, endDate)
      const price = prices[token][nearest][1]
      priceMap[token] = price

      const promise = new Promise(async resolve => {
        const chainPromises: any[] = []
        for (const sourceChain in bonders[token]) {
          if (!this.tokens.includes(token)) {
            continue
          }
          for (const destinationChain in bonders[token][sourceChain]) {
            chainPromises.push(
              new Promise(async resolve => {
                const chain = destinationChain
                const provider = this.allProviders[chain]
                const bonder = bonders[token][sourceChain][destinationChain]
                if (bonderBalances?.[bonder]?.[token]?.[chain]) {
                  resolve(null)
                  return
                }
                if (!bonderBalances[bonder]) {
                  bonderBalances[bonder] = {}
                }
                if (!bonderBalances[bonder][token]) {
                  bonderBalances[bonder][token] = {}
                }
                if (!bonderBalances[bonder][token][chain]) {
                  bonderBalances[bonder][token][chain] = {}
                }
                if (!bonderBalances[bonder][token][chain].canonical) {
                  bonderBalances[bonder][token][
                    chain
                  ].canonical = BigNumber.from(0)
                }
                if (!bonderBalances[bonder][token][chain].hToken) {
                  bonderBalances[bonder][token][chain].hToken = BigNumber.from(
                    0
                  )
                }
                if (!bonderBalances[bonder][token][chain].native) {
                  bonderBalances[bonder][token][chain].native = BigNumber.from(
                    0
                  )
                }
                const bridge = (mainnetAddresses as any).bridges[token][chain]
                const tokenAddress =
                  bridge.l2CanonicalToken ?? bridge.l1CanonicalToken
                const hTokenAddress = bridge.l2HopBridgeToken
                const tokenContract = new Contract(
                  tokenAddress,
                  erc20Abi,
                  provider
                )
                const hTokenContract = hTokenAddress
                  ? new Contract(hTokenAddress, erc20Abi, provider)
                  : null

                console.log(
                  `fetching daily bonder balance stat, chain: ${chain}, token: ${token}, timestamp: ${timestamp}`
                )

                const blockDater = new BlockDater(provider)
                const date = DateTime.fromSeconds(endTimestamp).toJSDate()
                const info = await blockDater.getDate(date)
                if (!info) {
                  throw new Error('no info')
                }
                const blockTag = info.block
                const balancePromises: any[] = []

                try {
                  if (
                    tokenAddress === constants.AddressZero &&
                    chain === 'ethereum'
                  ) {
                    balancePromises.push(provider.getBalance(bonder, blockTag))
                  } else {
                    balancePromises.push(
                      tokenContract.balanceOf(bonder, {
                        blockTag
                      })
                    )
                  }
                  if (hTokenContract) {
                    balancePromises.push(
                      hTokenContract.balanceOf(bonder, {
                        blockTag
                      })
                    )
                  } else {
                    balancePromises.push(Promise.resolve(null))
                  }

                  balancePromises.push(provider.getBalance(bonder, blockTag))

                  if (chain === 'arbitrum') {
                    balancePromises.push(
                      provider.getBalance(arbitrumAliases[token], blockTag)
                    )
                  } else {
                    balancePromises.push(Promise.resolve(null))
                  }
                } catch (err) {
                  console.error(`${chain} ${token} ${err.message}`)
                  throw err
                }

                const [
                  balance,
                  hBalance,
                  native,
                  aliasBalance
                ] = await Promise.all(balancePromises)

                if (balance) {
                  bonderBalances[bonder][token][chain].canonical = balance
                }
                if (hBalance) {
                  bonderBalances[bonder][token][chain].hToken = hBalance
                }
                if (native) {
                  bonderBalances[bonder][token][chain].native = native
                }
                if (aliasBalance) {
                  bonderBalances[bonder][token][chain].native = bonderBalances[
                    bonder
                  ][token][chain].native.add(aliasBalance)
                }

                console.log(
                  `done fetching daily bonder fee stat, chain: ${chain}`
                )
                resolve(null)
              })
            )
          }
        }
        await Promise.all(chainPromises)
        resolve(null)
      })
      promises.push(promise)
    }
    await Promise.all(promises)

    console.log('all done fetching bonder balances')
    return { bonderBalances, priceMap }
  }

  async computeResult (config: any) {
    const {
      bonderBalances,
      token,
      initialAggregateBalance,
      initialAggregateNativeBalance,
      restakedAmount,
      unstakedAmount,
      priceMap
    } = config
    let aggregateBalance = initialAggregateBalance
    const nativeBalances: Record<string, any> = {}
    for (const chain of this.chains) {
      nativeBalances[chain] = BigNumber.from(0)
    }
    aggregateBalance = aggregateBalance.add(restakedAmount).sub(unstakedAmount)
    for (const bonder in bonderBalances) {
      for (const chain in bonderBalances[bonder][token]) {
        const info = bonderBalances[bonder][token][chain]
        const canonical = BigNumber.from(info.canonical)
        const hToken = BigNumber.from(info.hToken)
        const native = BigNumber.from(info.native)
        aggregateBalance = aggregateBalance.add(canonical).add(hToken)
        nativeBalances[chain] = native
      }
    }
    const nativeTokenDiffs: Record<string, any> = {}
    for (const chain of this.chains) {
      nativeTokenDiffs[chain] = nativeBalances[chain].sub(
        initialAggregateNativeBalance?.[chain] ?? 0
      )
    }
    const nativeTokenDiffsInToken: Record<string, any> = {}
    for (const chain of this.chains) {
      const multiplier = parseEther('1')
      const nativeSymbol = this.getChainNativeTokenSymbol(chain)
      const nativeTokenPriceUsdWei = parseEther(
        priceMap[nativeSymbol].toString()
      )
      const tokenPriceUsdWei = parseEther(priceMap[token].toString())
      const nativeTokenDecimals = this.tokenDecimals[nativeSymbol]
      const rate = nativeTokenPriceUsdWei.mul(multiplier).div(tokenPriceUsdWei)
      const exponent = nativeTokenDecimals - this.tokenDecimals[token]

      const diff = nativeTokenDiffs[chain]
      const resultInTokenWei = diff.mul(rate).div(multiplier)
      const resultInToken = resultInTokenWei.div(
        BigNumber.from(10).pow(exponent)
      )
      nativeTokenDiffsInToken[chain] = resultInToken.sub(
        initialAggregateNativeBalance?.[chain] ?? 0
      )
    }
    let nativeTokenDiffSum = BigNumber.from(0)
    for (const chain of this.chains) {
      nativeTokenDiffSum = nativeTokenDiffSum.add(
        nativeTokenDiffsInToken[chain]
      )
    }
    let result = aggregateBalance.add(nativeTokenDiffSum)
    if (result.lt(0)) {
      result = BigNumber.from(0)
    }
    const resultFormatted = Number(
      formatUnits(result.toString(), this.tokenDecimals[token])
    )
    const resultUsd = resultFormatted * priceMap[token]

    return {
      token,
      resultFormatted,
      resultUsd
    }
  }

  async getPriceHistory (coinId: string, days: number) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    return fetch(url)
      .then(res => res.json())
      .then(json => {
        if (!json.prices) {
          console.log(json)
        }
        return json.prices.map((data: any[]) => {
          data[0] = Math.floor(data[0] / 1000)
          return data
        })
      })
  }

  getChainNativeTokenSymbol (chain: string) {
    if (chain === 'polygon') {
      return 'MATIC'
    } else if (chain === 'gnosis') {
      return 'DAI'
    }

    return 'ETH'
  }

  nearestDate (dates: any[], target: any) {
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
}

export default BonderBalanceStats
