import { StateMachineDB } from '#cctp/db/StateMachineDB.js'
import { OnchainEventIndexerDB } from '#cctp/db/OnchainEventIndexerDB.js'
import { TxRelayDB } from '#cctp/db/TxRelayDB.js'

import { actionHandler, parseString, root } from '../shared/index.js'

enum DBTypes {
  StateMachine = 'StateMachine',
  OnchainEventIndexer = 'OnchainEventIndexer',
  TxRelay = 'TxRelay'
}

root
  .command('cctp-db-dump')
  .description('Dump CCTP DB')
  .option('--db-type <type>', 'Name of the DB', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { dbType } = source

  if (!Object.values(DBTypes).includes(dbType)) {
    throw new Error(`Invalid db type: ${dbType}. Did you mean one of the following: ${Object.values(DBTypes).join(', ')}?`)
  }

  /**
   * For now, you must manually update the StateMachineDB state below if you want to dump a different state.
   */
  const state = 'sent'

  const dbName = 'Message'
  switch (dbType) {
    case DBTypes.StateMachine:
      await dumpStateMachineDB(dbName, state)
      break
    case DBTypes.OnchainEventIndexer:
      await dumpOnchainEventIndexerDB(dbName)
      break
    case DBTypes.TxRelay:
      await dumpTxRelayDB(dbName)
      break
  }
}

async function dumpStateMachineDB (dbName: string, state: string) {
  const db = new StateMachineDB(dbName)
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
