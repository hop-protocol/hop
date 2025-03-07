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
import { ClaimPostedTable } from './events/railsGateway/ClaimPosted.js'
import { ClaimReaddedTable } from './events/railsGateway/ClaimReadded.js'
import { ClaimRemovedTable } from './events/railsGateway/ClaimRemoved.js'
// import { ClaimWithdrawnTable } from './events/railsGateway/ClaimWithdrawn.js'
import { BonderPreferenceTable } from './events/railsGateway/BonderPreference.js'
import { PriceTable } from './prices/index.js'
import { PathTable } from './paths/index.js'
import { TokenTable } from './tokens/index.js'
import { EventContextTable } from './eventContext/eventContext.js'
import { MigrationTable } from './migrations/migrations.js'
import { postgresConfig } from '#config/index.js'
import { Pgp } from './pgDbTypes.js'
import { MigrationManager } from './migrations/MigrationManager.js'

export class PgDb {
  db: Pgp
  events: any = {}
  nonEventTables: any = {}
  priceTable: any
  migrationTable: any = {}
  migrationManager: any
  initiated = false
  initialMigrationIndex = 0
  rollbackCount = 0
  skipMigrations = true

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
      TransferBonded: new TransferBondedTable(this.db),
      ClaimPosted: new ClaimPostedTable(this.db),
      ClaimReadded: new ClaimReaddedTable(this.db),
      ClaimRemoved: new ClaimRemovedTable(this.db),
      // ClaimWithdrawn: new ClaimWithdrawnTable(this.db),
      BonderPreference: new BonderPreferenceTable(this.db),
    }

    this.migrationTable = new MigrationTable(this.db)
    this.migrationManager = new MigrationManager(this.migrationTable)

    this.priceTable = new PriceTable(this.db)
  }

  async init () {
    if (this.initiated) {
      return
    }
    this.initiated = true
    await this.migrationTable.createTable()
    await this.migrationTable.createIndexes()

    await this.priceTable.createTable()
    await this.priceTable.createIndexes()

    for (const event in this.nonEventTables) {
      await this.nonEventTables[event].createTable()
    }

    for (const event in this.events) {
      await this.events[event].createTable()
    }

    if (!this.skipMigrations) {
      await this.migrationManager.runMigrations(this.rollbackCount)
    }

    for (const event in this.nonEventTables) {
      await this.nonEventTables[event].createIndexes()
    }

    for (const event in this.events) {
      await this.events[event].createIndexes()
    }
  }
}

export const pgDb = new PgDb()
