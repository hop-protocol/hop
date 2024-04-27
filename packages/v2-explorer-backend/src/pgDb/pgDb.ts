import minimist from 'minimist'
import pgp from 'pg-promise'
import { BundleCommittedTable } from './events/messenger/BundleCommitted.js'
import { BundleForwardedTable } from './events/messenger/BundleForwarded.js'
import { BundleReceivedTable } from './events/messenger/BundleReceived.js'
import { BundleSetTable } from './events/messenger/BundleSet.js'
import { FeesSentToHubTable } from './events/messenger/FeesSentToHub.js'
import { MessageBundledTable } from './events/messenger/MessageBundled.js'
import { MessageExecutedTable } from './events/messenger/MessageExecuted.js'
import { MessageSentTable } from './events/messenger/MessageSent.js'
import { TransferSentTable } from './events/railsGateway/TransferSent.js'
import { TransferBondedTable } from './events/railsGateway/TransferBonded.js'
import { postgresConfig } from '#config/index.js'
import { Pgp } from './pgDbTypes.js'

const argv = minimist(process.argv.slice(2))

export class PgDb {
  db: Pgp
  events: any = {}

  constructor () {
    const initOptions: any = {}
    const maxConnections = postgresConfig.maxConnections
    const opts = {
      max: maxConnections
    }

    const db = pgp(initOptions)({ ...postgresConfig, ...opts })
    this.db = db

    this.events = {
      BundleCommitted: new BundleCommittedTable(this.db),
      BundleForwarded: new BundleForwardedTable(this.db),
      BundleReceived: new BundleReceivedTable(this.db),
      BundleSet: new BundleSetTable(this.db),
      FeesSentToHub: new FeesSentToHubTable(this.db),
      MessageBundled: new MessageBundledTable(this.db),
      MessageExecuted: new MessageExecutedTable(this.db),
      MessageSent: new MessageSentTable(this.db),
      TransferSent: new TransferSentTable(this.db),
      TransferBonded: new TransferBondedTable(this.db),
    }

    this.init().catch((err: any) => {
      console.error('pg db error', err)
      process.exit(1)
    }).then(() => {
      console.log('pg db init done')
    })
  }

  async init () {
    const resetDb = argv.reset
    if (resetDb) {
      await this.db.query('DROP TABLE IF EXISTS events')
    }

    const migration = argv.migration
    if (migration) {
      // await this.db.query(`
      //   ALTER TABLE events ADD COLUMN IF NOT EXISTS test BOOLEAN
      // `)
    }

    for (const event in this.events) {
      await this.events[event].createTable()
      await this.events[event].createIndexes()
    }
  }
}

export const pgDb = new PgDb()
