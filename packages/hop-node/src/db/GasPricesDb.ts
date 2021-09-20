import BaseDb from './BaseDb'
import nearest from 'nearest-date'
import { BigNumber } from 'ethers'
import { DateTime } from 'luxon'
import { normalizeDbItem } from './utils'

export type GasPrice = {
  chain?: string
  timestamp?: number
  gasPrice?: BigNumber
}

class GasPricesDb extends BaseDb {
  async update (key: string, data: Partial<GasPrice>) {
    return super.update(key, data)
  }

  async getNearest (chain: string, timestampSeconds: number): Promise<GasPrice> {
    const keys = await this.getKeys()
    const items = await Promise.all(
      keys.map((key: string) => {
        return this.getById(key)
      })
    )

    const target = DateTime.fromSeconds(timestampSeconds)
    const dates = items.map(item => DateTime.fromSeconds(item.timestamp).toJSDate())
    const index = nearest(dates, target.toJSDate())
    if (index === -1) {
      return null
    }
    return normalizeDbItem(items[index])
  }
}

export default GasPricesDb
