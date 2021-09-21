import BaseDb from './BaseDb'
import nearest from 'nearest-date'
import { BigNumber } from 'ethers'
import { DateTime } from 'luxon'
import { normalizeDbItem } from './utils'

export type GasPrice = {
  chain: string
  timestamp: number // in seconds
  gasPrice: BigNumber
}

class GasPricesDb extends BaseDb {
  async update (key: string, data: GasPrice) {
    return super.update(key, data)
  }

  async addGasPrice (data: GasPrice) {
    const key = `${data.chain}:${data.timestamp}`
    return this.update(key, data)
  }

  async getNearest (chain: string, timestampSeconds: number): Promise<GasPrice> {
    const keys = await this.getKeys()
    const items = await Promise.all(
      keys.map((key: string) => {
        return this.getById(key)
      })
    )

    const target = DateTime.fromSeconds(timestampSeconds)
    const dates = items.filter(item => item.chain === chain).map(item => DateTime.fromSeconds(item.timestamp).toJSDate())
    const index = nearest(dates, target.toJSDate())
    if (index === -1) {
      return null
    }
    const item = normalizeDbItem(items[index])
    const varianceSeconds = 10 * 60
    const isTooFar = Math.abs(item.timestamp - timestampSeconds) > varianceSeconds
    if (isTooFar) {
      return null
    }
    return item
  }
}

export default GasPricesDb
