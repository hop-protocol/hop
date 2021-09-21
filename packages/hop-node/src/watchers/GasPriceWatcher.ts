import getRpcProvider from 'src/utils/getRpcProvider'
import wait from 'src/utils/wait'
import { Db, getGasPricesDb } from 'src/db'
import { providers } from 'ethers'

type Config = {
  chainSlug: string
}

class GasPriceWatcher {
  chainSlug: string
  provider: providers.Provider
  db: Db
  intervalMs : number = 30 * 1000

  constructor (config: Config) {
    this.chainSlug = config.chainSlug
    this.provider = getRpcProvider(this.chainSlug)
    this.db = getGasPricesDb()
  }

  start () {
    this.poll()
  }

  async poll () {
    while (true) {
      const gasPrice = await this.provider.getGasPrice()
      const timestamp = Math.floor(Date.now() / 1000)
      await this.db.addGasPrice({
        chain: this.chainSlug,
        gasPrice,
        timestamp
      })
      await wait(this.intervalMs)
    }
  }
}

export default GasPriceWatcher
