import minimist from 'minimist'
import pgp from 'pg-promise'
import { BundleCommitted } from './events/BundleCommitted.js'
import { BundleForwarded } from './events/BundleForwarded.js'
import { BundleReceived } from './events/BundleReceived.js'
import { BundleSet } from './events/BundleSet.js'
import { FeesSentToHub } from './events/FeesSentToHub.js'
import { MessageBundled } from './events/MessageBundled.js'
import { MessageExecuted } from './events/MessageExecuted.js'
import { MessageSent } from './events/MessageSent.js'
import { postgresConfig } from '#config/index.js'

const argv = minimist(process.argv.slice(2))

export class PgDb {
  db: any
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
      BundleCommitted: new BundleCommitted(this.db),
      BundleForwarded: new BundleForwarded(this.db),
      BundleReceived: new BundleReceived(this.db),
      BundleSet: new BundleSet(this.db),
      FeesSentToHub: new FeesSentToHub(this.db),
      MessageBundled: new MessageBundled(this.db),
      MessageExecuted: new MessageExecuted(this.db),
      MessageSent: new MessageSent(this.db)
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
