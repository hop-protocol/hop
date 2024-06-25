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
import { PathTable } from './paths/paths.js'
import { TokenTable } from './tokens/tokens.js'
import { EventContextTable } from './eventContext/eventContext.js'
import { MigrationTable } from './migrations/migrations.js'
import { postgresConfig } from '#config/index.js'
import { Pgp } from './pgDbTypes.js'
import { MigrationManager } from './migrations/MigrationManager.js'

export class PgDb {
  db: Pgp
  events: any = {}
  nonEventTables: any = {}
  migrationTable: any = {}
  migrationManager: any

  constructor () {
    const initOptions: any = {}
    const maxConnections = postgresConfig.maxConnections
    const opts = {
      max: maxConnections
    }

    const db = pgp(initOptions)({ ...postgresConfig, ...opts })
    this.db = db

    this.nonEventTables = {
      Path: new PathTable(this.db),
      Token: new TokenTable(this.db),
      EventContext: new EventContextTable(this.db),
    }

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
      TransferBonded: new TransferBondedTable(this.db)
    }

    this.migrationTable = new MigrationTable(this.db)
    this.migrationManager = new MigrationManager(this.migrationTable)

    this.init().catch((err: any) => {
      console.error('pg db error', err)
      process.exit(1)
    }).then(() => {
      console.log('pg db init done')
    })
  }

  async init () {
    await this.migrationTable.createTable()
    await this.migrationTable.createIndexes()

    await this.migrationManager.runMigrations(1)

    for (const event in this.nonEventTables) {
      await this.nonEventTables[event].createTable()
      await this.nonEventTables[event].createIndexes()
    }

    for (const event in this.events) {
      await this.events[event].createTable()
      await this.events[event].createIndexes()
    }
  }
}

export const pgDb = new PgDb()
