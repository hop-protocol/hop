import BaseDb, { DateFilterWithKeyPrefix, DbItemsFilter } from './BaseDb'
import nearest from 'nearest-date'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { GasCostTransactionType, OneHourMs, OneHourSeconds, OneWeekMs } from 'src/constants'

const varianceSeconds = 20 * 60

type GasCost = {
  id?: string
  chain: string
  token: string
  timestamp: number // in seconds
  transactionType: GasCostTransactionType
  gasCost: BigNumber
  gasCostInToken: BigNumber
  gasPrice: BigNumber
  gasLimit: BigNumber
  tokenPriceUsd: number
  nativeTokenPriceUsd: number
  minBonderFeeAbsolute: BigNumber
}

// structure:
// key: `<chain>:<token>:<timestamp>:<transactionType>`
// value: `{ ...GasCost }`
class GasCostDb extends BaseDb<GasCost> {
  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)
    this.startPrunePoller()
  }

  private async startPrunePoller () {
    await this.tilReady()
    while (true) {
      try {
        await this.#prune()
        await wait(OneHourMs)
      } catch (err) {
        this.logger.error(`prune poller error: ${err.message}`)
      }
    }
  }

  async update (key: string, data: GasCost): Promise<void> {
    await this._put(key, data)
  }

  async getKeyFromValue (value: GasCost): Promise<string> {
    const { chain, token, timestamp, transactionType } = value
    return `${chain}:${token}:${timestamp}:${transactionType}`
  }
  async getNearest (chain: string, token: string, transactionType: GasCostTransactionType, targetTimestamp: number): Promise<GasCost | null> {
    await this.tilReady()
    const dateFilterWithKeyPrefix: DateFilterWithKeyPrefix = {
      keyPrefix: `${chain}:${token}`,
      fromUnix: targetTimestamp - OneHourSeconds,
      toUnix: targetTimestamp + OneHourSeconds
    }

    const isRelevantItem = (key: string, value: GasCost): GasCost | null => {
      const isRelevant = (
        !!(value.chain === chain) &&
        !!(value.token === token) &&
        !!(value.transactionType === transactionType) &&
        !!(value.timestamp)
      )
      return isRelevant ? value : null
    }

    const filters: DbItemsFilter<GasCost> = {
      dateFilterWithKeyPrefix,
      cbFilterGet: isRelevantItem
    }

    const values: GasCost[] = await this._getValues(filters)
    const dates = values.map((item: GasCost) => item.timestamp)
    const index = nearest(dates, targetTimestamp)
    if (index === -1) {
      return null
    }
    const item = values[index]
    const isTooFar = Math.abs(item.timestamp - targetTimestamp) > varianceSeconds
    if (isTooFar) {
      return null
    }
    return item
  }

  async #prune (): Promise<void> {
    await this.tilReady()

    const getStaleValues: GasCost[] = await this.#getStaleValues()
    this.logger.debug(`items to prune: ${getStaleValues.length}`)
    for (const { chain, token, timestamp, id } of getStaleValues) {
      try {
        if (!id) {
          throw new Error(`id not found for ${chain}:${token}:${timestamp}`)
        }
        await this._del(id)
      } catch (err) {
        this.logger.error(`error pruning db item: ${err.message}`)
      }
    }
  }

  async #getStaleValues (): Promise<GasCost[]> {
    await this.tilReady()

    const oneWeekAgo = Math.floor((Date.now() - OneWeekMs) / 1000)
    const isStaleItem = (key: string, value: GasCost): GasCost | null => {
      const item: GasCost = { ...value, id: key }
      return item.timestamp < oneWeekAgo ? item : null
    }
    const filters: DbItemsFilter<GasCost> = {
      cbFilterGet: isStaleItem
    }
    const staleItems: GasCost[] = await this._getValues(filters)
    return staleItems
  }
}

export default GasCostDb
