import Logger from 'src/logger'
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
  logger: Logger

  constructor (config: Config) {
    this.chainSlug = config.chainSlug
    this.provider = getRpcProvider(this.chainSlug)
    this.db = getGasPricesDb()
    this.logger = new Logger({
      tag: 'GasPricesWatcher',
      prefix: `${this.chainSlug}`
    })
  }

  start () {
    this.poll()
  }

  async poll () {
    while (true) {
      try {
        const gasPrice = await this.provider.getGasPrice()
        const timestamp = Math.floor(Date.now() / 1000)
        await this.db.addGasPrice({
          chain: this.chainSlug,
          gasPrice,
          timestamp
        })
      } catch (err) {
        this.logger.error(`poll error: ${err.message}`)
      }
      await wait(this.intervalMs)
    }
  }
}

export default GasPriceWatcher
