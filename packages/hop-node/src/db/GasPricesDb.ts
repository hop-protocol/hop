import BaseDb, { BaseItem } from './BaseDb'
import nearest from 'nearest-date'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { OneHourMs, OneWeekMs } from 'src/constants'
import { normalizeDbItem } from './utils'

export const varianceSeconds = 10 * 60

export type GasPrice = BaseItem & {
  chain: string
  timestamp: number // in seconds
  gasPrice: BigNumber
}

class GasPricesDb extends BaseDb {
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

  async update (key: string, data: GasPrice) {
    return super.update(key, data)
  }

  async addGasPrice (data: GasPrice) {
    const key = `${data.chain}:${data.timestamp}`
    return this.update(key, data)
  }

  async getItems ():Promise<GasPrice[]> {
    const keys = await this.getKeys()
    const items: GasPrice[] = (await Promise.all(
      keys.map((key: string) => {
        return this.getById(key)
      })))

    return items.filter(item => !!item)
  }

  async getNearest (chain: string, targetTimestamp: number): Promise<GasPrice | null> {
    const items : GasPrice[] = (await this.getItems()).filter((item: GasPrice) => item.chain === chain && item.timestamp)

    const dates = items.map((item: GasPrice) => item.timestamp)
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

  private async getOldEntries (): Promise<GasPrice[]> {
    const oneWeekAgo = Math.floor((Date.now() - OneWeekMs) / 1000)
    const items = (await this.getItems())
      .filter((item: GasPrice) => item.timestamp < oneWeekAgo)

    return items
  }

  private async prune (): Promise<void> {
    const items = await this.getOldEntries()
    for (const { _id } of items) {
      await this.deleteById(_id)
    }
  }
}

export default GasPricesDb
