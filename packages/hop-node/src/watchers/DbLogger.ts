import Logger from 'src/logger'
import { Db, getDbSet } from 'src/db'
import { State } from 'src/db/SyncStateDb'
import { Transfer } from 'src/db/TransfersDb'
import { TransferRoot } from 'src/db/TransferRootsDb'
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
      transfers.forEach((transfer: Transfer) => {
        const logger = this.logger.create({ id: transfer.transferId })
        logger.debug(JSON.stringify(transfer))
      })

      const transferRoots = await this.db.transferRoots.getTransferRoots()
      transferRoots.forEach((transferRoot: TransferRoot) => {
        const logger = this.logger.create({ root: transferRoot.transferRootHash })
        logger.debug(JSON.stringify(transferRoot))
      })

      const syncState = await this.db.syncState.getItems()
      syncState.forEach((item: State) => {
        const logger = this.logger.create({ id: 'syncState' })
        logger.debug(JSON.stringify(item))
      })

      await wait(this.pollIntervalMs)
    }
  }
}

export default DbLogger
