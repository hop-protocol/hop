import BaseDb, { BaseItem } from './BaseDb'
import nearest from 'nearest-date'
import wait from 'src/utils/wait'
import { OneHourMs, OneWeekMs } from 'src/constants'
import { normalizeDbItem } from './utils'

export const varianceSeconds = 10 * 60

export type TokenPrice = BaseItem & {
  token: string
  timestamp: number // in seconds
  price: number
}

class TokenPricesDb extends BaseDb {
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

  async update (key: string, data: TokenPrice) {
    return super.update(key, data)
  }

  async addTokenPrice (data: TokenPrice) {
    const key = `${data.token}:${data.timestamp}`
    return this.update(key, data)
  }

  async getItems ():Promise<TokenPrice[]> {
    const keys = await this.getKeys()
    const items: TokenPrice[] = (await Promise.all(
      keys.map((key: string) => {
        return this.getById(key)
      })))

    return items.filter(item => !!item)
  }

  async getNearest (token: string, targetTimestamp: number, staleCheck: boolean = true): Promise<TokenPrice | null> {
    const items : TokenPrice[] = (await this.getItems()).filter((item: TokenPrice) => item.token === token && item.timestamp)

    const dates = items.map((item: TokenPrice) => item.timestamp)
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

  private async getOldEntries (): Promise<TokenPrice[]> {
    const oneWeekAgo = Math.floor((Date.now() - OneWeekMs) / 1000)
    const items = (await this.getItems())
      .filter((item: TokenPrice) => item.timestamp < oneWeekAgo)

    return items
  }

  private async prune (): Promise<void> {
    const items = await this.getOldEntries()
    for (const { _id } of items) {
      await this.deleteById(_id)
    }
  }
}

export default TokenPricesDb
