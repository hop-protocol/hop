import Logger from 'src/logger'
import wait from 'src/utils/wait'
import { Db, getDbSet } from 'src/db'
import { State } from 'src/db/SyncStateDb'
import { Transfer } from 'src/db/TransfersDb'
import { TransferRoot } from 'src/db/TransferRootsDb'

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
      try {
        this.logger.debug('starting transfers db log')
        const transfers = await this.db.transfers.getTransfersFromWeek()
        this.logger.debug(`transfers count: ${transfers.length}`)
        transfers.forEach((transfer: Transfer) => {
          const logger = this.logger.create({ id: transfer.transferId })
          logger.debug(JSON.stringify(transfer))
        })

        this.logger.debug('starting transferRoots db log')
        const transferRoots = await this.db.transferRoots.getTransferRoots()
        this.logger.debug(`transfer roots count: ${transferRoots.length}`)
        transferRoots.forEach((transferRoot: TransferRoot) => {
          const logger = this.logger.create({ root: transferRoot.transferRootHash })
          logger.debug(JSON.stringify(transferRoot))
        })

        this.logger.debug('starting syncState db log')
        const syncState = await this.db.syncState.getItems()
        this.logger.debug(`sync state count: ${syncState.length}`)
        syncState.forEach((item: State) => {
          const logger = this.logger.create({ id: 'syncState' })
          logger.debug(JSON.stringify(item))
        })
      } catch (err) {
        this.logger.error(`poll error: ${err.message}`)
      }

      await wait(this.pollIntervalMs)
    }
  }
}

export default DbLogger
