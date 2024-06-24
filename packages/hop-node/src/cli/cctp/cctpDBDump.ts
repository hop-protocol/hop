import { StateMachineDB } from '../../cctp/db/StateMachineDB.js'
import { OnchainEventIndexerDB } from '../../cctp/db/OnchainEventIndexerDB.js'
import { TxRelayDB } from '../../cctp/db/TxRelayDB.js'

import { actionHandler, root } from '../shared/index.js'

root
  .command('cctp-db-dump')
  .description('Dump CCTP DB')
  .action(actionHandler(main))

async function main (source: any) {

  /**
   *
   * TODO: For now, manually edit this file to switch between the different DBs
   *
   */

  const dbName = 'Message'
  // await dumpStateMachineDB(dbName)
  // await dumpOnchainEventIndexerDB(dbName)
  await dumpTxRelayDB()
}

async function dumpStateMachineDB (dbName: string) {
  const db = new StateMachineDB(dbName)
  const state = 'relayed'

  for await (const [key, value] of db.getItemsInState(state)) {
    console.log(key, value)
  }
}

async function dumpOnchainEventIndexerDB (dbName: string) {
  const db = new OnchainEventIndexerDB(dbName)
  for await (const [key, value] of db.iterator()) {
    console.log(value)
  }
} 

async function dumpTxRelayDB () {
  const db = new TxRelayDB()
  for await (const [key, value] of db.iterator()) {
    // The key is a txHash and the value is a boolean indicating if the txHash exists.
    console.log(key)
  }
}
