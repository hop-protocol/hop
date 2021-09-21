import BaseDb from './BaseDb'
import nearest from 'nearest-date'
import { BigNumber } from 'ethers'
import { normalizeDbItem } from './utils'

export const varianceSeconds = 10 * 60

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

  async getNearest (chain: string, targetTimestamp: number): Promise<GasPrice> {
    const keys = await this.getKeys()
    const items = (await Promise.all(
      keys.map((key: string) => {
        return this.getById(key)
      })
    )).filter(item => item.chain === chain && item.timestamp)

    const dates = items.map(item => item.timestamp)
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
}

export default GasPricesDb
