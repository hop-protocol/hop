import { StateMachineDB } from '#state-machine/index.js'
import { OnchainEventIndexerDB } from '#indexer/index.js'
import { RelayerDB } from '#relayer/index.js'

import { actionHandler, parseString, root } from '../shared/index.js'

enum DBTypes {
  StateMachine = 'StateMachine',
  OnchainEventIndexer = 'OnchainEventIndexer',
  Relayer = 'Relayer'
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

  const name = 'cctp'
  switch (dbType) {
    case DBTypes.StateMachine:
      await dumpStateMachineDB(name, state)
      break
    case DBTypes.OnchainEventIndexer:
      await dumpOnchainEventIndexerDB(name)
      break
    case DBTypes.Relayer:
      await dumpTxRelayDB(name)
      break
  }
}

async function dumpStateMachineDB (name: string, state: string) {
  const db = new StateMachineDB(name)
  for await (const [key, value] of db.getItemsInState(state)) {
    console.log(key, value)
  }
}

async function dumpOnchainEventIndexerDB (name: string) {
  const db = new OnchainEventIndexerDB(name)
  for await (const [key, value] of db.iterator()) {
    console.log(key, value)
  }
}

async function dumpTxRelayDB (name: string) {
  const db = new RelayerDB(name)
  for await (const [key,] of db.iterator()) {
    // The key is the item itself and the value is simply a boolean indicating existence
    console.log(key)
  }
}
