import Logger from 'src/logger'
import { Db, getDbSet } from 'src/db'
import { wait } from 'src/utils'

class DbLogger {
  db: Db
  logger: Logger
  token: string
  pollIntervalMs: number = 60 * 60 * 1000

  constructor (token: string) {
    this.logger = new Logger({
      tag: 'DbLogger',
      prefix: token
    })
    this.token = token
    this.db = getDbSet(token)
  }

  start () {
    this.poll()
  }

  async poll () {
    while (true) {
      const transfers = await this.db.transfers.getTransfers()
      this.logger.debug('transfers dump:', JSON.stringify(transfers))
      const transferRoots = await this.db.transferRoots.getTransferRoots()
      this.logger.debug('transferRoots dump:', JSON.stringify(transferRoots))
      const syncState = await this.db.syncState.getItems()
      this.logger.debug('syncState dump:', JSON.stringify(syncState))
      await wait(this.pollIntervalMs)
    }
  }
}

export default DbLogger
