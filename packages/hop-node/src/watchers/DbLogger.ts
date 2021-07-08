import Logger from 'src/logger'
import db from 'src/db'
import { wait } from 'src/utils'

class DbLogger {
  logger: Logger
  pollIntervalSec: number = 60 * 60 * 1000

  constructor () {
    this.logger = new Logger('DbLogger')
  }

  start () {
    this.poll()
  }

  async poll () {
    while (true) {
      const transfers = await db.transfers.getTransfers()
      this.logger.debug('transfers dump:', JSON.stringify(transfers))
      const transferRoots = await db.transferRoots.getTransferRoots()
      this.logger.debug('transferRoots dump:', JSON.stringify(transferRoots))
      await wait(this.pollIntervalSec)
    }
  }
}

export default DbLogger
