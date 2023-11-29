import BaseDb, { DateFilterWithKeyPrefix, DbBatchOperation, DbItemsFilter, DbOperations } from './BaseDb'
import nearest from 'nearest-date'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { GasCostTransactionType, OneHourMs, OneHourSeconds } from 'src/constants'

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
  private readonly prunePollerIntervalMs = 6 * OneHourMs
  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)
    this.startPrunePoller()
  }

  private async startPrunePoller () {
    while (true) {
      try {
        await this.prune()
        await wait(this.prunePollerIntervalMs)
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

  protected async prune (): Promise<void> {
    const staleValues: GasCost[] = await this.getStaleValues()
    this.logger.debug(`items to prune: ${staleValues.length}`)

    // There is a possibility that this will exceed memory limits. This would only occur in the case
    // of a serious issue where the prune poller is not running and the db is not being pruned. If
    // that happens, introduce a limit and prune in batches.
    let dbBatchOperations: DbBatchOperation[] = []
    for (const { chain, token, timestamp, id } of staleValues) {
      if (!id) {
        this.logger.error(`error pruning db item id not found for ${chain}:${token}:${timestamp}`)
        continue
      }
      dbBatchOperations.push({
        type: DbOperations.Del,
        key: id
      })
    }

    if (dbBatchOperations.length) {
      await this._batch(dbBatchOperations)
    }
  }

  protected async getStaleValues (): Promise<GasCost[]> {
    // Cannot use date filter since the filter is based on the token and chain but we don't have
    // that context here

    // Stale items should be a multiple of the prune poller interval to ensure we don't prune
    // items that are still relevant
    const staleItemLookbackMs = this.prunePollerIntervalMs * 4
    const staleItemCutoffSec = Math.floor((Date.now() - staleItemLookbackMs) / 1000)

    const isStaleItem = (key: string, value: GasCost): GasCost | null => {
      const item: GasCost = { ...value, id: key }
      return item.timestamp < staleItemCutoffSec ? item : null
    }
    const filters: DbItemsFilter<GasCost> = {
      cbFilterGet: isStaleItem
    }
    return this._getValues(filters)
  }
}

export default GasCostDb
