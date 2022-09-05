import path from 'path'
import fs from 'fs'
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
  gnosisArchiveRpc,
  polygonRpc,
  optimismRpc,
  arbitrumRpc,
  etherscanApiKeys
} from './config'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { erc20Abi } from '@hop-protocol/core/abi'
import { createObjectCsvWriter } from 'csv-writer'
import { chunk } from 'lodash'
import { parse } from 'comment-json'

const jsonData = parse(
  fs
    .readFileSync(path.resolve(__dirname, 'data/bonder_profits.json'))
    .toString()
) as any

const {
  arbitrumAliases,
  oldArbitrumAliases
} = require('./data/arbitrum_alises.json')
const { wethAddresses } = require('./data/weth_addresses.json')

const etherscanUrls: Record<string, string> = {
  ethereum: 'https://api.etherscan.io',
  polygon: 'https://api.polygonscan.com',
  optimism: 'https://api-optimistic.etherscan.io',
  arbitrum: 'https://api.arbiscan.io',
  gnosis: 'https://blockscout.com/poa/xdai'
}

const wait = (t: number) =>
  new Promise(resolve => setTimeout(() => resolve(null), t))

const allProviders: Record<string, any> = {
  ethereum: new providers.StaticJsonRpcProvider(ethereumRpc),
  gnosis: new providers.StaticJsonRpcProvider(gnosisRpc),
  polygon: new providers.StaticJsonRpcProvider(polygonRpc),
  optimism: new providers.StaticJsonRpcProvider(optimismRpc),
  arbitrum: new providers.StaticJsonRpcProvider(arbitrumRpc)
}

const allArchiveProviders: Record<string, any> = {
  gnosis: gnosisArchiveRpc
    ? new providers.StaticJsonRpcProvider(gnosisArchiveRpc)
    : undefined
}

type Options = {
  days?: number
  offsetDays?: number
  startDate?: string
  endDate?: string
  tokens?: string[]
  trackBonderProfit?: boolean
  trackBonderFees?: boolean
  trackBonderTxFees?: boolean
  writeCsv?: boolean
}

class BonderStats {
  db = new Db()
  days: number = 1
  offsetDays: number = 0
  startDate?: DateTime
  endDate?: DateTime
  tokens: string[] = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'WBTC']
  chains = ['ethereum', 'polygon', 'gnosis', 'optimism', 'arbitrum']
  trackOnlyProfit = false
  trackOnlyTxFees = false
  trackOnlyFees = false
  writeCsv = false

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
    if (options.offsetDays) {
      this.offsetDays = options.offsetDays
    }
    if (options.startDate) {
      this.startDate = DateTime.fromISO(options.startDate)
        .toUTC()
        .startOf('day')
    }
    if (options.endDate) {
      this.endDate = DateTime.fromISO(options.endDate)
        .toUTC()
        .startOf('day')
    }
    if (this.startDate && this.endDate) {
      this.offsetDays = 0
      this.days = this.endDate.diff(this.startDate, ['days']).days
      if (this.days < 0) {
        throw new Error('invalid date range')
      }
    }
    if (options.tokens) {
      this.tokens = options.tokens
    }

    this.trackOnlyProfit = !!options.trackBonderProfit
    this.trackOnlyTxFees = !!options.trackBonderTxFees
    this.trackOnlyFees = !!options.trackBonderFees

    console.log(
      `trackOnlyProfit: ${this.trackOnlyProfit}, trackOnlyTxFees: ${this.trackOnlyTxFees}, trackOnlyFees: ${this.trackOnlyFees}`
    )

    if (options.writeCsv) {
      this.writeCsv = options.writeCsv
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
    // console.log('closing db')
    // this.db.close()
  }

  async trackBonderFee () {
    for (const token of this.tokens) {
      const days = Array(this.days)
        .fill(0)
        .map((n, i) => n + i)
      const chunkSize = 10
      const allChunks = chunk(days, chunkSize)
      const csv: any[] = []
      for (const chunks of allChunks) {
        csv.push(
          ...(await Promise.all(
            chunks.map(async (day: number) => {
              return this.trackBonderFeeDay(day, token)
            })
          ))
        )
      }
    }
  }

  async trackBonderFeeDay (day: number, token: string) {
    const now = DateTime.utc()
    const date = now.minus({ days: day }).startOf('day')
    const startDate = Math.floor(date.toSeconds())
    const endDate = Math.floor(date.endOf('day').toSeconds())
    const isoDate = date.toISO()

    const dbData: Record<string, any> = {}
    let totalFees = BigNumber.from(0)
    for (const chain of this.chains) {
      let chainFees = BigNumber.from(0)
      if (chain === 'ethereum') {
        continue
      }
      const items = await this.fetchTransferSents(
        chain,
        token,
        startDate,
        endDate
      )
      for (const { bonderFee } of items) {
        chainFees = chainFees.add(BigNumber.from(bonderFee))
      }
      totalFees = totalFees.add(chainFees)
      const chainFeesFormatted = Number(
        formatUnits(chainFees, this.tokenDecimals[token])
      )
      dbData[`${chain}FeesAmount`] = chainFeesFormatted
      console.log(day, 'chain bonder fees', isoDate, chain, chainFeesFormatted)
    }
    const totalFeesFormatted = Number(
      formatUnits(totalFees, this.tokenDecimals[token])
    )
    dbData.totalFeesAmount = totalFeesFormatted
    console.log(day, 'total bonder fees', isoDate, totalFeesFormatted)

    try {
      await this.db.upsertBonderFees(
        token,
        dbData.polygonFeesAmount,
        dbData.gnosisFeesAmount,
        dbData.arbitrumFeesAmount,
        dbData.optimismFeesAmount,
        dbData.ethereumFeesAmount,
        dbData.totalFeesAmount,
        startDate
      )
      console.log(
        day,
        'upserted',
        token,
        startDate,
        DateTime.fromSeconds(startDate).toISO()
      )
    } catch (err) {
      if (!err.message.includes('UNIQUE constraint failed')) {
        throw err
      }
    }
  }

  async run () {
    while (true) {
      try {
        if (this.trackOnlyProfit) {
          await this.trackProfit()
        } else if (this.trackOnlyTxFees) {
          await this.trackBonderTxFees()
        } else if (this.trackOnlyFees) {
          await this.trackBonderFee()
        } else {
          await Promise.all([
            this.trackProfit(),
            this.trackBonderFee(),
            this.trackBonderTxFees()
          ])
        }
        break
      } catch (err) {
        console.error(err)
      }
    }
  }

  async trackBonderTxFeeDay (day: number, token: string) {
    const now = DateTime.utc()
    const date = now.minus({ days: day }).startOf('day')
    const startDate = Math.floor(date.toSeconds())
    const endDate = Math.floor(date.endOf('day').toSeconds())
    const isoDate = date.toISO()
    const address = Object.keys(jsonData[token])[0]
    if (!address) {
      throw new Error(`no address found for token "${token}"`)
    }

    const prices = await this.getTokenPrices()
    const priceMap: any = {}
    for (const _token in prices) {
      const dates = prices[_token].reverse().map((x: any) => x[0])
      const nearest = this.nearestDate(dates, startDate)
      const price = prices[_token][nearest][1]
      priceMap[_token] = price
    }

    const dbData: Record<string, any> = {}
    await Promise.all(
      this.chains.map(async (chain: string) => {
        let chainFees = BigNumber.from(0)
        const gasFees = await this.fetchBonderTxFees(
          address,
          chain,
          startDate,
          endDate
        )
        const chainFeesFormatted = Number(formatEther(gasFees))
        dbData[`${chain}TxFees`] = chainFeesFormatted
        console.log(chain, chainFeesFormatted)
      })
    )

    const ethPrice = priceMap.ETH
    const maticPrice = priceMap.MATIC
    const xdaiPrice = 1
    dbData.ethPrice = ethPrice
    dbData.maticPrice = maticPrice
    dbData.xdaiPrice = xdaiPrice
    dbData.totalFees =
      Number(dbData.polygonTxFees || 0) * maticPrice +
      Number(dbData.gnosisTxFees || 0) * xdaiPrice +
      (Number(dbData.arbitrumTxFees || 0) +
        Number(dbData.optimismTxFees || 0) +
        Number(dbData.ethereumTxFees || 0)) *
        ethPrice
    console.log(dbData.totalFees)

    try {
      await this.db.upsertBonderTxFees(
        token,
        dbData.polygonTxFees,
        dbData.gnosisTxFees,
        dbData.arbitrumTxFees,
        dbData.optimismTxFees,
        dbData.ethereumTxFees,
        dbData.totalFees,
        dbData.ethPrice,
        dbData.maticPrice,
        dbData.xdaiPrice,
        startDate
      )
      console.log(day, 'upserted', token, startDate)
    } catch (err) {
      if (!err.message.includes('UNIQUE constraint failed')) {
        throw err
      }
    }
  }

  async trackBonderTxFees () {
    for (const token of this.tokens) {
      console.log('tracking bonder tx fees', token)
      const days = Array(this.days)
        .fill(0)
        .map((n, i) => n + i)
      for (const day of days) {
        await this.trackBonderTxFeeDay(day, token)
      }
    }
  }

  async getTokenPrices () {
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

    return prices
  }

  async trackProfitDay (day: number, token: string, prices: any) {
    for (const bonderAddress in jsonData[token]) {
      const bonderData = jsonData[token][bonderAddress]

      console.log('day:', day)
      let now = this.endDate ?? DateTime.utc()
      let date = now.minus({ days: day + this.offsetDays }).startOf('day')
      console.log('date:', date.toISO())
      const timestamp = Math.floor(date.toSeconds())
      const isoDate = date.toISO()
      console.log('date:', isoDate)

      const priceMap: any = {}
      for (const _token in prices) {
        const dates = prices[_token].reverse().map((x: any) => x[0])
        const nearest = this.nearestDate(dates, timestamp)
        const price = prices[_token][nearest][1]
        priceMap[_token] = price
      }

      const { bonderBalances, dbData } = await this.fetchBonderBalances(
        token,
        timestamp,
        priceMap
      )

      const initialAggregateBalanceInAssetToken = BigNumber.from(0)
      const initialAggregateNativeBalance = BigNumber.from(0)

      const initialCanonicalAmounts = bonderData.initialCanonicalAmounts ?? {}
      let initialCanonicalAmount = BigNumber.from(0)
      for (const date in initialCanonicalAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(
            initialCanonicalAmounts[date],
            token
          )
          for (const amount of amounts) {
            initialCanonicalAmount = initialCanonicalAmount.add(amount)
            console.log(
              ts,
              'subtract initial canonical amount',
              amount.toString()
            )
          }
        }
      }

      const depositAmounts = bonderData.depositAmounts ?? {}
      let depositAmount = BigNumber.from(0)
      let depositEvent: any = null
      for (const date in depositAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(depositAmounts[date], token)
          for (const amount of amounts) {
            depositAmount = depositAmount.add(amount)
            if (ts === timestamp) {
              if (!depositEvent) {
                depositEvent = BigNumber.from(0)
              }
              depositEvent = depositEvent.add(amount)
            }
            console.log(ts, 'subtract deposit amount', amount.toString())
          }
        }
      }

      const stakedAmounts = bonderData.stakedAmounts ?? {}
      let stakedAmount = BigNumber.from(0)
      for (const date in stakedAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(stakedAmounts[date], token)
          for (const amount of amounts) {
            stakedAmount = stakedAmount.add(amount)
            console.log(ts, 'subtract staked amount', amount.toString())
          }
        }
      }

      const unstakedAmounts = bonderData.unstakedAmounts ?? {}
      let unstakedAmount = BigNumber.from(0)
      for (const date in unstakedAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(unstakedAmounts[date], token)
          for (const amount of amounts) {
            unstakedAmount = unstakedAmount.add(amount)
            console.log(ts, 'subtract unstaked amount', amount.toString())
          }
        }
      }

      const unstakedEthAmounts = bonderData.unstakedEthAmounts ?? {}
      let unstakedEthAmount = BigNumber.from(0)
      for (const date in unstakedEthAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(unstakedEthAmounts[date], 'ETH')
          for (const amount of amounts) {
            unstakedEthAmount = unstakedEthAmount.add(amount)
            console.log(ts, 'subtract unstaked amount ETH', amount.toString())
          }
        }
      }

      const restakedProfits = bonderData.restakedProfits ?? {}
      let restakedAmount = BigNumber.from(0)
      for (const date in restakedProfits) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(restakedProfits[date], token)
          for (const amount of amounts) {
            restakedAmount = restakedAmount.add(amount)
            console.log(ts, 'add restaked amount', amount.toString())
          }
        }
      }

      const restakedEthProfits = bonderData.restakedEthProfits ?? {}
      let restakedEthAmount = BigNumber.from(0)
      for (const date in restakedEthProfits) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(restakedEthProfits[date], token)
          for (const amount of amounts) {
            restakedEthAmount = restakedEthAmount.add(amount)
            console.log(ts, 'add restaked eth amount', amount.toString())
          }
        }
      }

      const withdrawnAmounts = bonderData.withdrawnAmounts ?? {}
      let withdrawnAmount = BigNumber.from(0)
      let withdrawEvent: any = null
      for (const date in withdrawnAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          const amounts = this.amountsToArray(withdrawnAmounts[date], token)
          for (const amount of amounts) {
            withdrawnAmount = withdrawnAmount.add(amount)
            if (ts === timestamp) {
              if (!withdrawEvent) {
                withdrawEvent = BigNumber.from(0)
              }
              withdrawEvent = withdrawEvent.add(amount)
            }
            console.log(ts, 'subtract withdrawn amount', amount.toString())
          }
        }
      }

      const { resultFormatted } = await this.computeResult({
        token,
        initialAggregateBalanceInAssetToken,
        initialAggregateNativeBalance,
        restakedAmount,
        unstakedAmount,
        bonderBalances,
        priceMap
      })

      const {
        resultFormatted: result2Formatted,
        ethAmountsFormatted
      } = await this.computeResult2({
        token,
        initialAggregateBalanceInAssetToken,
        initialAggregateNativeBalance,
        restakedAmount,
        unstakedAmount,
        unstakedEthAmount,
        bonderBalances,
        priceMap
      })

      dbData.unstakedAmount = Number(
        formatUnits(unstakedAmount, this.tokenDecimals[token])
      )

      dbData.unstakedEthAmount = Number(formatEther(unstakedEthAmount))

      dbData.restakedAmount = Number(
        formatUnits(restakedAmount, this.tokenDecimals[token])
      )

      dbData.restakedEthAmount = Number(
        formatUnits(restakedEthAmount, this.tokenDecimals[token])
      )

      dbData.depositAmount = Number(
        formatUnits(depositAmount, this.tokenDecimals[token])
      )

      dbData.withdrawnAmount = Number(
        formatUnits(withdrawnAmount, this.tokenDecimals[token])
      )

      dbData.stakedAmount = Number(
        formatUnits(stakedAmount, this.tokenDecimals[token])
      )

      dbData.initialCanonicalAmount = Number(
        formatUnits(initialCanonicalAmount, this.tokenDecimals[token])
      )

      dbData.bonderAddress = bonderAddress.toLowerCase()

      dbData.xdaiPriceUsd = 1

      const initialEthNativeAmounts = bonderData.initialNativeAmounts?.ETH ?? {}
      let initialEthAmount = 0
      for (const date in initialEthNativeAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          initialEthAmount = Number(initialEthNativeAmounts[date])
        }
      }

      dbData.initialEthAmount = initialEthAmount

      const initialMaticNativeAmounts =
        bonderData.initialNativeAmounts?.MATIC ?? {}
      let initialMaticAmount = 0
      for (const date in initialMaticNativeAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          initialMaticAmount = Number(initialMaticNativeAmounts[date])
        }
      }

      dbData.initialMaticAmount = initialMaticAmount

      const initialxDaiNativeAmounts =
        bonderData.initialNativeAmounts?.XDAI ?? {}
      let initialxDaiAmount = 0
      for (const date in initialxDaiNativeAmounts) {
        const ts = this.parseConfigDateToStartOfNextDayUnix(date)
        if (ts <= timestamp) {
          initialxDaiAmount = Number(initialxDaiNativeAmounts[date])
        }
      }

      dbData.initialxDaiAmount = initialxDaiAmount

      const { resultFormatted: result3Formatted } = await this.computeResult3({
        token,
        dbData
      })

      console.log('result3', token, timestamp, result3Formatted)

      if (depositEvent) {
        depositEvent = Number(
          formatUnits(depositEvent, this.tokenDecimals[token])
        )
      }

      if (withdrawEvent) {
        withdrawEvent = Number(
          formatUnits(withdrawEvent, this.tokenDecimals[token])
        )
      }

      try {
        await this.db.upsertBonderBalances(
          token,
          dbData.polygonBlockNumber,
          dbData.polygonCanonicalAmount,
          dbData.polygonHTokenAmount,
          dbData.polygonNativeAmount,
          dbData.gnosisBlockNumber,
          dbData.gnosisCanonicalAmount,
          dbData.gnosisHTokenAmount,
          dbData.gnosisNativeAmount,
          dbData.arbitrumBlockNumber,
          dbData.arbitrumCanonicalAmount,
          dbData.arbitrumHTokenAmount,
          dbData.arbitrumNativeAmount,
          dbData.arbitrumAliasAmount,
          dbData.optimismBlockNumber,
          dbData.optimismCanonicalAmount,
          dbData.optimismHTokenAmount,
          dbData.optimismNativeAmount,
          dbData.ethereumBlockNumber,
          dbData.ethereumCanonicalAmount,
          dbData.ethereumNativeAmount,
          dbData.unstakedAmount,
          dbData.restakedAmount,
          dbData.ethPriceUsd,
          dbData.maticPriceUsd,
          resultFormatted,
          timestamp,
          result2Formatted,
          ethAmountsFormatted,
          dbData.xdaiPriceUsd,
          dbData.depositAmount,
          dbData.stakedAmount,
          dbData.initialCanonicalAmount,
          result3Formatted,
          dbData.arbitrumWethAmount,
          dbData.withdrawnAmount,
          dbData.unstakedEthAmount,
          dbData.bonderAddress,
          depositEvent,
          dbData.restakedEthAmount,
          dbData.initialEthAmount,
          dbData.initialMaticAmount,
          dbData.initialxDaiAmount,
          withdrawEvent,
          dbData.messengerWrapperAmount
        )
        console.log(
          day,
          'upserted bonder balance',
          token,
          timestamp,
          DateTime.fromSeconds(timestamp).toISO(),
          result3Formatted
        )
      } catch (err) {
        if (!err.message.includes('UNIQUE constraint failed')) {
          throw err
        }
      }

      return dbData
    }
  }

  async trackProfit () {
    console.log('days:', this.days)
    console.log('chains:', this.chains)
    console.log('tokens:', this.tokens)

    const prices = await this.getTokenPrices()

    for (const token of this.tokens) {
      const days = Array(this.days)
        .fill(0)
        .map((n, i) => n + i)
      const chunkSize = 10
      const allChunks = chunk(days, chunkSize)
      const csv: any[] = []
      for (const chunks of allChunks) {
        csv.push(
          ...(await Promise.all(
            chunks.map(async (day: number) => {
              return this.trackProfitDay(day, token, prices)
            })
          ))
        )
      }

      const data = Object.values(csv)
      const headers = Object.keys(data[0])
      const rows = Object.values(data)
      const csvPath = path.resolve(__dirname, '../', `${token}.csv`)
      const csvWriter = createObjectCsvWriter({
        path: csvPath,
        header: headers.map(id => {
          return { id, title: id }
        })
      })

      if (this.writeCsv) {
        await csvWriter.writeRecords(rows)
        console.log(`wrote ${csvPath}`)
      }
    }
  }

  async fetchBonderBalances (token: string, timestamp: number, priceMap: any) {
    let retries = 0
    while (true) {
      try {
        const bonders = (mainnetAddresses as any).bonders
        const bonderMap = bonders[token]
        const bonderBalances: any = {}
        const dbData: any = {}
        const chainPromises: any[] = []

        for (const sourceChain in bonderMap) {
          for (const destinationChain in bonderMap[sourceChain]) {
            chainPromises.push(
              new Promise(async (resolve, reject) => {
                try {
                  const chain = destinationChain
                  let provider = allProviders[chain]
                  const archiveProvider = allArchiveProviders[chain] || provider
                  const bonder = bonderMap[sourceChain][destinationChain]
                  if (bonderBalances[chain]) {
                    resolve(null)
                    return
                  }
                  if (!bonderBalances[chain]) {
                    bonderBalances[chain] = {
                      canonical: BigNumber.from(0),
                      hToken: BigNumber.from(0),
                      native: BigNumber.from(0),
                      alias: BigNumber.from(0),
                      messengerWrapper: BigNumber.from(0)
                    }
                  }
                  const bridgeMap = (mainnetAddresses as any).bridges[token][
                    chain
                  ]
                  const tokenAddress =
                    bridgeMap.l2CanonicalToken ?? bridgeMap.l1CanonicalToken
                  const hTokenAddress = bridgeMap.l2HopBridgeToken
                  const tokenContract = new Contract(
                    tokenAddress,
                    erc20Abi,
                    archiveProvider
                  )
                  const hTokenContract = hTokenAddress
                    ? new Contract(hTokenAddress, erc20Abi, archiveProvider)
                    : null

                  console.log(
                    `fetching daily bonder balance stat, chain: ${chain}, token: ${token}, timestamp: ${timestamp}`
                  )

                  const blockDater = new BlockDater(provider)
                  const date = DateTime.fromSeconds(timestamp).toJSDate()
                  const info = await blockDater.getDate(date)
                  if (!info) {
                    throw new Error('no info')
                  }
                  const blockTag = info.block
                  const balancePromises: Promise<any>[] = []

                  if (tokenAddress !== constants.AddressZero) {
                    balancePromises.push(
                      tokenContract.balanceOf(bonder, {
                        blockTag
                      })
                    )
                  } else {
                    balancePromises.push(Promise.resolve(0))
                  }

                  if (hTokenContract) {
                    balancePromises.push(
                      hTokenContract.balanceOf(bonder, {
                        blockTag
                      })
                    )
                  } else {
                    balancePromises.push(Promise.resolve(0))
                  }

                  balancePromises.push(
                    archiveProvider.getBalance(bonder, blockTag)
                  )

                  if (chain === 'arbitrum') {
                    let aliasAddress = arbitrumAliases[token]
                    if (token === 'DAI' && timestamp < 1650092400) {
                      aliasAddress = oldArbitrumAliases[token]
                    }
                    if (token === 'ETH' && timestamp < 1650067200) {
                      aliasAddress = oldArbitrumAliases[token]
                    }
                    balancePromises.push(
                      archiveProvider.getBalance(aliasAddress, blockTag)
                    )
                  } else {
                    balancePromises.push(Promise.resolve(0))
                  }

                  if (chain === 'arbitrum') {
                    const ethereumArchiveProvider = allArchiveProviders['ethereum']
                    const messengerWrapperAddress = bridgeMap.l1MessengerWrapper
                    balancePromises.push(
                      ethereumArchiveProvider.getBalance(messengerWrapperAddress, blockTag)
                    )
                  } else {
                    balancePromises.push(Promise.resolve(0))
                  }

                  const [
                    balance,
                    hBalance,
                    native,
                    aliasBalance,
                    messengerWrapperBalance
                  ] = await Promise.all(balancePromises)

                  bonderBalances[chain].canonical = balance
                  bonderBalances[chain].hToken = hBalance
                  bonderBalances[chain].native = native
                  bonderBalances[chain].alias = aliasBalance
                  bonderBalances[chain].messengerWrapper = messengerWrapperBalance

                  dbData[`${chain}BlockNumber`] = blockTag
                  dbData[`${chain}CanonicalAmount`] = balance
                    ? Number(
                        formatUnits(
                          balance.toString(),
                          this.tokenDecimals[token]
                        )
                      )
                    : 0
                  dbData[`${chain}NativeAmount`] = native
                    ? Number(formatEther(native.toString()))
                    : 0

                  dbData.ethPriceUsd = Number(priceMap['ETH'])
                  dbData.maticPriceUsd = Number(priceMap['MATIC'])
                  if (chain !== 'ethereum') {
                    dbData[`${chain}HTokenAmount`] = hBalance
                      ? Number(
                          formatUnits(
                            hBalance.toString(),
                            this.tokenDecimals[token]
                          )
                        )
                      : 0
                  }
                  if (chain === 'arbitrum') {
                    dbData[`${chain}AliasAmount`] = aliasBalance
                      ? Number(formatEther(aliasBalance.toString()))
                      : 0
                    console.log(
                      `${chain} ${token} alias balance`,
                      Number(formatEther(aliasBalance.toString()))
                    )
                  }
                  if (chain === 'arbitrum') {
                    dbData[`${chain}MessengerWrapperAmount`] = messengerWrapperBalance
                      ? Number(formatEther(messengerWrapperBalance.toString()))
                      : 0
                    console.log(
                      `${chain} ${token} messenger wrapper balance`,
                      Number(formatEther(messengerWrapperBalance.toString()))
                    )
                  }

                  if (chain === 'arbitrum') {
                    const wethAddress = wethAddresses[chain]
                    const wethContract = new Contract(
                      wethAddress,
                      erc20Abi,
                      provider
                    )

                    const wethBalance = await wethContract.balanceOf(bonder, {
                      blockTag
                    })

                    dbData[`${chain}WethAmount`] = Number(
                      formatEther(wethBalance.toString())
                    )
                  }

                  // NOTE: this is to account for offset issue with unstake/stake timestamps
                  // TODO: move to config
                  if (
                    token === 'USDT' &&
                    timestamp > 1657177200 &&
                    timestamp < 1657350000 &&
                    dbData.ethereumCanonicalAmount > 228588.2
                  ) {
                    dbData.ethereumCanonicalAmount =
                      dbData.ethereumCanonicalAmount - 228588.2
                  }

                  // NOTE: this is to account for offset issue with unstake/stake timestamps
                  // TODO: move to config
                  if (
                    token === 'USDC' &&
                    timestamp > 1654239600 &&
                    timestamp < 1654412400 &&
                    dbData.ethereumCanonicalAmount > 1998270.56
                  ) {
                    dbData.ethereumCanonicalAmount =
                      dbData.ethereumCanonicalAmount - 1998270.56
                  }

                  // NOTE: this is to account for offset issue with unstake/stake timestamps
                  // TODO: move to config
                  if (
                    token === 'DAI' &&
                    timestamp > 1656486000 &&
                    timestamp < 1656658800 &&
                    dbData.ethereumCanonicalAmount < 1500000
                  ) {
                    dbData.ethereumCanonicalAmount =
                      dbData.ethereumCanonicalAmount + 1500000
                  }

                  console.log(
                    `done fetching daily bonder fee stat, chain: ${chain}`
                  )

                  resolve(null)
                } catch (err) {
                  reject(err)
                }
              })
            )
          }
        }

        await Promise.all(chainPromises)

        console.log('done fetching timestamp balances')
        return { bonderBalances, dbData }
      } catch (err) {
        console.error('fetch balances error', err.message)
        const shouldRetry = this.shouldRetry(err.message)
        if (!shouldRetry) {
          throw err
        }
        if (retries > 10) {
          throw new Error('max retries reached')
        }
        console.log('retrying')
        await wait(2 * 1000)
      }
      retries++
    }
  }

  // TODO: remove this
  async computeResult (data: any = {}) {
    const {
      token,
      initialAggregateBalanceInAssetToken,
      initialAggregateNativeBalance,
      restakedAmount,
      unstakedAmount,
      bonderBalances,
      priceMap
    } = data
    let aggregateBalance = initialAggregateBalanceInAssetToken
      .sub(unstakedAmount)
      .add(restakedAmount)
    const nativeBalances: Record<string, any> = {}
    for (const chain of this.chains) {
      nativeBalances[chain] = BigNumber.from(0)
    }

    for (const chain in bonderBalances) {
      const { canonical, hToken, native, alias, messengerWrapper } = bonderBalances[chain]
      aggregateBalance = aggregateBalance.add(canonical).add(hToken)
      nativeBalances[chain] = native.add(alias)
      nativeBalances[chain] = native.add(messengerWrapper)
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

    return {
      result,
      resultFormatted
    }
  }

  // TODO: remove this
  async computeResult2 (data: any = {}) {
    const {
      token,
      initialAggregateBalanceInAssetToken,
      initialAggregateNativeBalance,
      restakedAmount,
      unstakedAmount,
      unstakedEthAmount,
      bonderBalances,
      priceMap
    } = data
    let aggregateBalanceToken = initialAggregateBalanceInAssetToken
      .sub(unstakedAmount)
      .add(restakedAmount)
    const nativeBalances: Record<string, any> = {}
    for (const chain of this.chains) {
      nativeBalances[chain] = BigNumber.from(0)
    }

    for (const chain in bonderBalances) {
      const { canonical, hToken, native, alias, messengerWrapper } = bonderBalances[chain]
      aggregateBalanceToken = aggregateBalanceToken.add(canonical).add(hToken)
      nativeBalances[chain] = native.add(alias)
      nativeBalances[chain] = native.add(messengerWrapper)
    }
    const nativeTokenDiffs: Record<string, any> = {}
    for (const chain of this.chains) {
      nativeTokenDiffs[chain] = nativeBalances[chain].sub(
        initialAggregateNativeBalance?.[chain] ?? 0
      )
    }

    let ethAmounts = BigNumber.from(0).sub(unstakedEthAmount)

    const nonEthNativeTokenDiffsInToken: Record<string, any> = {}
    for (const chain of this.chains) {
      const multiplier = parseEther('1')
      const nativeSymbol = this.getChainNativeTokenSymbol(chain)
      if (nativeSymbol === 'ETH') {
        ethAmounts = ethAmounts.add(nativeTokenDiffs[chain])
        continue
      }
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
      nonEthNativeTokenDiffsInToken[chain] = resultInToken.sub(
        initialAggregateNativeBalance?.[chain] ?? 0
      )
    }

    let nonEthNativeTokenDiffSum = BigNumber.from(0)
    for (const chain of this.chains) {
      nonEthNativeTokenDiffSum = nonEthNativeTokenDiffSum.add(
        nonEthNativeTokenDiffsInToken[chain] ?? BigNumber.from(0)
      )
    }

    let result = aggregateBalanceToken.add(nonEthNativeTokenDiffSum)
    if (result.lt(0)) {
      result = BigNumber.from(0)
    }
    const resultFormatted = Number(
      formatUnits(result.toString(), this.tokenDecimals[token])
    )

    const ethAmountsFormatted = Number(formatUnits(ethAmounts.toString(), 18))

    return {
      result,
      resultFormatted,
      ethAmounts,
      ethAmountsFormatted
    }
  }

  // this is the final "profit" result
  async computeResult3 (data: any = {}) {
    const { token, dbData } = data

    const totalBalances =
      dbData.restakedAmount +
      dbData.polygonCanonicalAmount +
      dbData.polygonHTokenAmount +
      dbData.gnosisCanonicalAmount +
      dbData.gnosisHTokenAmount +
      dbData.arbitrumCanonicalAmount +
      dbData.arbitrumHTokenAmount +
      dbData.optimismCanonicalAmount +
      dbData.optimismHTokenAmount +
      dbData.ethereumCanonicalAmount +
      (dbData.stakedAmount - dbData.unstakedAmount) -
      dbData.initialCanonicalAmount -
      dbData.unstakedEthAmount * dbData.ethPriceUsd
    const totalDeposits = dbData.depositAmount - dbData.withdrawnAmount

    let nativeStartingTokenAmount = 0
    if (token === 'DAI' || token === 'USDC' || token === 'USDT') {
      nativeStartingTokenAmount =
        dbData.initialEthAmount * dbData.ethPriceUsd +
        dbData.initialMaticAmount * dbData.maticPriceUsd +
        dbData.initialxDaiAmount * dbData.xdaiPriceUsd
    }
    if (token === 'ETH') {
      nativeStartingTokenAmount =
        (dbData.initialMaticAmount * dbData.maticPriceUsd) /
          dbData.ethPriceUsd +
        (dbData.initialxDaiAmount * dbData.xdaiPriceUsd) / dbData.ethPriceUsd +
        dbData.initialEthAmount
    }
    let nativeTokenDebt =
      dbData.polygonNativeAmount * dbData.maticPriceUsd +
      dbData.gnosisNativeAmount * dbData.xdaiPriceUsd +
      (dbData.ethereumNativeAmount +
        dbData.optimismNativeAmount +
        dbData.arbitrumNativeAmount +
        dbData.arbitrumAliasAmount +
        dbData.arbitrumMessengerWrapperAmount) *
        dbData.ethPriceUsd

    if (token === 'ETH') {
      nativeTokenDebt =
        (dbData.polygonNativeAmount * dbData.maticPriceUsd) /
          dbData.ethPriceUsd +
        (dbData.gnosisNativeAmount * dbData.xdaiPriceUsd) / dbData.ethPriceUsd +
        (dbData.ethereumNativeAmount +
          dbData.optimismNativeAmount +
          dbData.arbitrumNativeAmount +
          dbData.arbitrumAliasAmount +
          dbData.arbitrumMessengerWrapperAmount)
    }

    nativeTokenDebt = nativeStartingTokenAmount - nativeTokenDebt
    const result = totalBalances - totalDeposits - nativeTokenDebt
    const resultFormatted = result

    return {
      resultFormatted
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

  getGraphUrl (chain: string) {
    if (chain == 'gnosis') {
      chain = 'xdai'
    }

    return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
  }

  async queryFetch (url: string, query: string, variables?: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      })
    })
    const jsonRes = await res.json()
    if (!jsonRes.data) {
      throw new Error(jsonRes.errors[0].message)
    }
    return jsonRes.data
  }

  async fetchTransferSents (
    chain: string,
    token: string,
    startDate: number,
    endDate: number
  ) {
    const query = `
      query TransferSents($token: String, $startDate: Int, $endDate: Int) {
        transferSents(
          where: {
            token: $token,
            timestamp_gte: $startDate,
            timestamp_lt: $endDate
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1000
        ) {
          id
          token
          bonderFee
        }
      }
    `
    const url = this.getGraphUrl(chain)
    const data = await this.queryFetch(url, query, {
      token,
      startDate,
      endDate
    })

    if (!data) {
      return []
    }

    return data.transferSents
  }

  async fetchBonderTxFees (
    address: string,
    chain: string,
    startDate: number,
    endDate: number
  ) {
    const provider = allProviders[chain]
    const blockDater = new BlockDater(provider)
    const date = DateTime.fromSeconds(startDate - 86400).toJSDate()
    let retries = 0
    while (true) {
      try {
        const info = await blockDater.getDate(date)
        if (!info) {
          throw new Error('no info')
        }
        const startBlock = info.block
        const endBlock = 99999999
        const url = this.getEtherscanUrl(chain, address, startBlock, endBlock)

        const res = await fetch(url)
        const json = await res.json()
        if (json.message === 'NOTOK') {
          throw new Error(json.result)
        }

        let totalGasCost = BigNumber.from(0)
        for (const key in json.result) {
          const tx = json.result[key]
          const timestamp = Number(tx.timeStamp)
          if (!(timestamp >= startDate && timestamp < endDate)) {
            continue
          }
          if (tx.from.toLowerCase() !== address.toLowerCase()) {
            continue
          }
          const gasCost = BigNumber.from(tx.gasUsed).mul(tx.gasPrice)
          totalGasCost = totalGasCost.add(gasCost)
        }
        return totalGasCost
      } catch (err) {
        console.error('fetch error', err.message)
        const shouldRetry = this.shouldRetry(err.message)
        if (!shouldRetry) {
          throw err
        }
        if (retries > 10) {
          throw new Error('max retries reached')
        }
        console.log('retrying')
        await wait(2 * 1000)
      }
      retries++
    }
  }

  shouldRetry (errMsg: string) {
    const rateLimitErrorRegex = /(rate limit|too many concurrent requests|exceeded|socket hang up)/i
    const timeoutErrorRegex = /(timeout|time-out|time out|timedout|timed out)/i
    const connectionErrorRegex = /(ETIMEDOUT|ENETUNREACH|ECONNRESET|ECONNREFUSED|SERVER_ERROR)/i
    const badResponseErrorRegex = /(bad response|response error|missing response|processing response error|invalid json response body)/i
    const revertErrorRegex = /revert/i

    const isRateLimitError = rateLimitErrorRegex.test(errMsg)
    const isTimeoutError = timeoutErrorRegex.test(errMsg)
    const isConnectionError = connectionErrorRegex.test(errMsg)
    const isBadResponseError = badResponseErrorRegex.test(errMsg)

    // a connection error, such as 'ECONNREFUSED', will cause ethers to return a "missing revert data in call exception" error,
    // so we want to exclude server connection errors from actual contract call revert errors.
    const isRevertError =
      revertErrorRegex.test(errMsg) && !isConnectionError && !isTimeoutError

    const shouldRetry =
      (isRateLimitError ||
        isTimeoutError ||
        isConnectionError ||
        isBadResponseError) &&
      !isRevertError

    return shouldRetry
  }

  getEtherscanUrl (
    chain: string,
    address: string,
    startBlock: number,
    endBlock: number
  ) {
    const baseUrl = etherscanUrls[chain]
    const url = `${baseUrl}/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${etherscanApiKeys[
      chain
    ] || ''}`
    return url
  }

  parseConfigDateToStartOfNextDayUnix (date: string) {
    return Math.floor(
      DateTime.fromISO(date)
        .toUTC()
        .plus({ days: 1 })
        .startOf('day')
        .toSeconds()
    )
  }

  amountsToArray (amount: string | string[], token: string) {
    let arr = [amount]
    if (Array.isArray(amount)) {
      arr = amount
    }

    return arr.map((value: string) =>
      parseUnits(value, this.tokenDecimals[token])
    )
  }
}

export default BonderStats
