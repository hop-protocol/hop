import BaseDb, { BaseItem } from './BaseDb'
import nearest from 'nearest-date'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { OneHourMs, OneWeekMs } from 'src/constants'
import { normalizeDbItem } from './utils'

export const varianceSeconds = 10 * 60

export type GasCost = BaseItem & {
  chain: string
  token: string
  timestamp: number // in seconds
  attemptSwap: boolean
  gasCost: BigNumber
  gasCostUsd: string
  gasPrice: BigNumber
  gasLimit: BigNumber
  tokenPrice: BigNumber
  nativeTokenPrice: BigNumber
}

class GasCostDb extends BaseDb {
  constructor (prefix: string, _namespace?: string) {
    super(prefix, _namespace)
    this.startPrunePoller()
  }

  private async startPrunePoller () {
    while (true) {
      try {
        await wait(OneHourMs)
        await this.prune()
      } catch (err) {
        this.logger.error(`prune poller error: ${err.message}`)
      }
    }
  }

  async update (key: string, data: GasCost) {
    return super.update(key, data)
  }

  async addGasCost (data: GasCost) {
    const key = `${data.chain}:${data.token}:${data.timestamp}`
    return this.update(key, data)
  }

  async getItems ():Promise<GasCost[]> {
    const keys = await this.getKeys()
    const items: GasCost[] = (await Promise.all(
      keys.map((key: string) => {
        return this.getById(key)
      })))

    return items
  }

  async getNearest (chain: string, token: string, attemptSwap: boolean, targetTimestamp: number): Promise<GasCost | null> {
    const items : GasCost[] = (await this.getItems()).filter((item: GasCost) => {
      return (
        item.chain === chain &&
        item.token === token &&
        item.attemptSwap === attemptSwap &&
        item.timestamp
      )
    })

    const dates = items.map((item: GasCost) => item.timestamp)
    const index = nearest(dates, targetTimestamp)
    if (index === -1) {
      return null
    }
    const item = normalizeDbItem(items[index])
    const isTooFar = Math.abs(item.timestamp - targetTimestamp) > varianceSeconds
    if (isTooFar) {
      return null
    }
    return item
  }

  private async getOldEntries (): Promise<GasCost[]> {
    const oneWeekAgo = Math.floor((Date.now() - OneWeekMs) / 1000)
    const items = (await this.getItems())
      .filter((item: GasCost) => item.timestamp < oneWeekAgo)

    return items
  }

  private async prune (): Promise<void> {
    const items = await this.getOldEntries()
    for (const { _id } of items) {
      await this.deleteById(_id)
    }
  }
}

export default GasCostDb
