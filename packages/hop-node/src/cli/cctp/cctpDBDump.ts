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
  await dumpTxRelayDB(dbName)
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
  for await (const [, value] of db.iterator()) {
    console.log(value)
  }
} 

async function dumpTxRelayDB (dbName: string) {
  const db = new TxRelayDB(dbName)
  for await (const [key,] of db.iterator()) {
    // The key is the item itself and the value is simply a boolean indicating existence
    console.log(key)
  }
}
