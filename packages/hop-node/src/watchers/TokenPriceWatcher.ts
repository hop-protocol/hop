import Logger from 'src/logger'
import wait from 'src/utils/wait'
import { Db, getTokenPricesDb } from 'src/db'
import { PriceFeed } from 'src/priceFeed'

type Config = {
  token: string
}

class TokenPriceWatcher {
  token: string
  priceFeed: PriceFeed
  db: Db
  intervalMs : number = 30 * 1000
  logger: Logger

  constructor (config: Config) {
    this.token = config.token
    this.priceFeed = new PriceFeed()
    this.db = getTokenPricesDb()
    this.logger = new Logger({
      tag: 'TokenPricesWatcher',
      prefix: `${this.token}`
    })
  }

  start () {
    this.poll()
  }

  async poll () {
    while (true) {
      try {
        const token = this.token
        const price = await this.priceFeed.getPriceByTokenSymbol(token)
        const timestamp = Math.floor(Date.now() / 1000)
        await this.db.addTokenPrice({
          token,
          price,
          timestamp
        })
      } catch (err) {
        this.logger.error(`poll error: ${err.message}`)
      }
      await wait(this.intervalMs)
    }
  }
}

export default TokenPriceWatcher
