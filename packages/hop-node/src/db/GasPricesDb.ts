import BaseDb, { BaseItem, KeyFilter } from './BaseDb'
import nearest from 'nearest-date'
import wait from 'src/utils/wait'
import { BigNumber } from 'ethers'
import { OneHourMs, OneHourSeconds, OneWeekMs } from 'src/constants'
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
    return this._update(key, data)
  }

  async addGasPrice (data: GasPrice) {
    const key = `${data.chain}:${data.timestamp}`
    return this.update(key, data)
  }

  async getItems (filter?: KeyFilter):Promise<GasPrice[]> {
    const items : GasPrice[] = await this.getValues(filter)
    return items.filter(x => x)
  }

  async getNearest (chain: string, targetTimestamp: number, staleCheck: boolean = true): Promise<GasPrice | null> {
    const startTimestamp = targetTimestamp - OneHourSeconds
    const endTimestamp = targetTimestamp + OneHourSeconds
    const filter = {
      gte: `${chain}:${startTimestamp}`,
      lte: `${chain}:${endTimestamp}~`
    }
    const items : GasPrice[] = (await this.getItems(filter)).filter((item: GasPrice) => item.chain === chain && item.timestamp)

    const dates = items.map((item: GasPrice) => item.timestamp)
    const index = nearest(dates, targetTimestamp)
    if (index === -1) {
      return null
    }
    const item = normalizeDbItem(items[index])
    const isStale = Math.abs(item.timestamp - targetTimestamp) > varianceSeconds
    if (staleCheck && isStale) {
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
