import getBlockNumberFromDate from './utils/getBlockNumberFromDate'
import { BigNumber, providers, Contract, constants } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import { db } from './Db'
import { timestampPerBlockPerChain } from './constants'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { erc20Abi } from '@hop-protocol/core/abi'
import { PriceFeed } from './PriceFeed'
import { getTokenDecimals } from './utils/getTokenDecimals'
import { enabledTokens, enabledChains, rpcUrls, archiveRpcUrls } from './config'
import { nearestDate } from './utils/nearestDate'

function sumAmounts (items: any) {
  let sum = BigNumber.from(0)
  for (let item of items) {
    const amount = BigNumber.from(item.amount)
    sum = sum.add(amount)
  }
  return sum
}

type Options = {
  regenesis?: boolean
  days?: number
}

class TvlStats {
  db = db
  regenesis: boolean = false
  days: number = 365
  blockTags: Record<string, Record<number, number>> = {}
  priceFeed: PriceFeed
  allProviders: Record<string, any> = {}
  allArchiveProviders: Record<string, any> = {}

  constructor (options: Options = {}) {
    if (options.regenesis) {
      this.regenesis = options.regenesis
    }
    if (options.days) {
      this.days = options.days
    }

    this.blockTags = timestampPerBlockPerChain
    this.priceFeed = new PriceFeed()

    for (const chain in rpcUrls) {
      this.allProviders[chain] = new providers.StaticJsonRpcProvider({
        allowGzip: true,
        url: rpcUrls[chain]
      })
    }

    for (const chain in archiveRpcUrls) {
      this.allArchiveProviders[chain] = new providers.StaticJsonRpcProvider(
        archiveRpcUrls[chain]
      )
    }
  }

  async trackTvl () {
    const daysN = this.days
    console.log('fetching prices')

    const prices: Record<string, any> = {}

    for (const token of enabledTokens) {
      prices[token] = await this.priceFeed.getPriceHistory(token, daysN)
    }

    console.log('done fetching prices')

    console.log('upserting prices')
    for (let token in prices) {
      for (let data of prices[token]) {
        const price = data[1]
        const timestamp = data[0]
        try {
          this.db.upsertPrice(token, price, timestamp)
        } catch (err) {
          if (!err.message.includes('UNIQUE constraint failed')) {
            throw err
          }
        }
      }
    }
    console.log('done upserting prices')

    let tokens = enabledTokens
    let chains = enabledChains
    if (this.regenesis) {
      chains = ['optimism']
    }
    const now = DateTime.utc()

    // Get block tags per day and store them in memory
    for (const chain of chains) {
      if (!this.blockTags[chain]) this.blockTags[chain] = {}
      console.log(`getting block tags for chain ${chain}`)
      for (let day = 0; day < daysN; day++) {
        const endDate = day === 0 ? now : now.minus({ days: day }).endOf('day')
        const endTimestamp = Math.floor(endDate.toSeconds())
        if (this.blockTags?.[chain]?.[endTimestamp]) continue
        const provider = this.allProviders[chain]
        const blockTag = await getBlockNumberFromDate(
          chain,
          provider,
          endTimestamp
        )
        console.log(`${chain} ${endTimestamp} ${blockTag} ${day}`)
        this.blockTags[chain][endTimestamp] = blockTag
      }
    }

    const cachedData: any = await this.db.getTvlPoolStats()
    const promises: Promise<any>[] = []
    for (let token of tokens) {
      promises.push(
        new Promise(async (resolve, reject) => {
          await Promise.all(
            chains.map(async (chain: string) => {
              try {
                const provider = this.allProviders[chain]
                const archiveProvider =
                  this.allArchiveProviders[chain] || provider
                const config = (mainnetAddresses as any).bridges?.[token]?.[
                  chain
                ]
                if (!config) {
                  return
                }
                const tokenAddress =
                  config?.l2CanonicalToken ?? config.l1CanonicalToken
                if (!tokenAddress) {
                  return
                }
                const spender = config.l2SaddleSwap ?? config.l1Bridge
                const tokenContract = new Contract(
                  tokenAddress,
                  erc20Abi,
                  archiveProvider
                )

                for (let day = 0; day < daysN; day++) {
                  const endDate =
                    day === 0 ? now : now.minus({ days: day }).endOf('day')
                  const startDate = endDate.startOf('day')
                  const endTimestamp = Math.floor(endDate.toSeconds())
                  const startTimestamp = Math.floor(startDate.toSeconds())

                  const isCached = this.isItemCached(
                    cachedData,
                    chain,
                    token,
                    startTimestamp
                  )
                  if (isCached) {
                    return
                  }

                  console.log(
                    `fetching daily tvl stats, chain: ${chain}, token: ${token}, day: ${day}`
                  )

                  const blockTag = this.blockTags[chain][endTimestamp]
                  let balance: BigNumber = BigNumber.from(0)
                  try {
                    const isContractDeployed =
                      blockTag >=
                      (mainnetAddresses as any)?.bridges[token]?.[chain]
                        ?.bridgeDeployedBlockNumber

                    if (
                      tokenAddress === constants.AddressZero &&
                      chain === 'ethereum'
                    ) {
                      balance = await archiveProvider.getBalance(
                        spender,
                        blockTag
                      )
                    } else {
                      if (isContractDeployed) {
                        balance = await tokenContract.balanceOf(spender, {
                          blockTag
                        })
                      }
                    }
                  } catch (err) {
                    console.error(
                      `tvl promise error ${chain} ${token} ${err.message}`
                    )
                    throw err
                  }

                  console.log('balance', balance, blockTag)
                  const decimals = getTokenDecimals(token)
                  const formattedAmount = Number(
                    formatUnits(balance.toString(), decimals)
                  )

                  const dates = prices[token].reverse().map((x: any) => x[0])
                  const nearest = nearestDate(dates, endDate)
                  const price = prices[token][nearest][1]

                  const usdAmount = price * formattedAmount
                  try {
                    this.db.upsertTvlPoolStat(
                      chain,
                      token,
                      formattedAmount,
                      usdAmount,
                      startTimestamp
                    )
                    console.log('upserted')
                  } catch (err) {
                    if (!err.message.includes('UNIQUE constraint failed')) {
                      throw err
                    }
                  }
                  console.log(`done fetching daily tvl stats, chain: ${chain}`)
                }
              } catch (err) {
                reject(err)
              }
            })
          )
          resolve(null)
        })
      )
    }
    console.log('done fetching tvl')
  }

  isItemCached (
    cachedData: any,
    chain: string,
    token: string,
    startTimestamp: number
  ): boolean {
    for (const cachedEntry of cachedData) {
      if (
        cachedEntry.chain === chain &&
        cachedEntry.token === token &&
        cachedEntry.timestamp === startTimestamp
      ) {
        return true
      }
    }
    return false
  }
}

export default TvlStats
