import { StateMachineDB } from '../cctp/db/StateMachineDB.js'
import { OnchainEventIndexerDB } from '../cctp/db/OnchainEventIndexerDB.js'
import { TxRelayDB } from '../cctp/db/TxRelayDB.js'

import { actionHandler, parseBool, parseString, parseStringArray, root } from './shared/index.js'

root
  .command('cctp-db-dump')
  .description('Dump CCTP DB')
  .option(`--db-name <name>`, 'DB Name', parseString)
  .option('--db-filter <hash>', 'DB Filter', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  // validateInput(source)
  // const { dbName, dbFilter } = source

  /**
   *
   * TODO: For now, manually edit this file to switch between the different DBs
   *
   */

  const dbName = 'Message'
  switch ('StateMachine') {
  // switch (source.dbName) {
    case 'StateMachine':
      await dumpStateMachineDB(dbName)
      break
    // case 'OnchainEventIndexer':
    //   await dumpOnchainEventIndexerDB(dbName)
    //   break
    // case 'TxRelay':
    //   await dumpTxRelayDB()
    //   break
    default:
      throw new Error('DB Name not found')
  }
}

function validateInput (source: any) {
  const {
    dbName,
    dbFilter
  } = source

  if (!dbName) {
    throw new Error('DB Name is required')
  }

  if (!dbFilter) {
    throw new Error('DB Filter is required')
  }
}

async function dumpStateMachineDB (dbName: string) {
  const db = new StateMachineDB(dbName)
  const state = 'relayed'

  for await (const [key, value] of db.getItemsInState(state)) {
    console.log(key, value)
  }
}

async function dumpOnchainEventIndexerDB (dbName: string) {
  // const db = new OnchainEventIndexerDB(dbName)
  // for await (const item of db.getItemsInStateNull()) {
  //   console.log(item)
  // }
} 

async function dumpTxRelayDB () {
  // const db = new TxRelayDB()
  // for await (const item of db.getItemsInState()) {
  //   console.log(item)
  // }
}
