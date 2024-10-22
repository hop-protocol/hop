import { StateMachineDB } from '#state-machine/index.js'
import { OnchainEventIndexerDB } from '#indexer/index.js'
import { RelayerDB } from '#relayer/index.js'
import { Logger } from '#logger/index.js'
import { Argument, Command } from 'commander'
import { getClientNameFromCommand, parseString } from '../../utils.js'

type ShowDBOptions = {
  dbType: DBTypes
  state?: string
}

enum DBTypes {
  StateMachine = 'StateMachine',
  OnchainEventIndexer = 'OnchainEventIndexer',
  Relayer = 'Relayer'
}

export const program = new Command()

const dbTypeArgument = new Argument('db-type', 'Name of the DB')
  .choices(Object.values(DBTypes))
  .argParser(parseString)
  .argRequired()

program
  .name('show-db')
  .description('Show the contents of a DB')
  .description('Show DB contents')
  .addArgument(dbTypeArgument)
  .option('--state <state>', 'Desired state item (when querying state machine DB)', parseString)
  .action(run)

async function run (dbType: DBTypes): Promise<void> {
  const logger = new Logger(program.name())
  const { state } = program.opts<ShowDBOptions>()

  if (!Object.values(DBTypes).includes(dbType)) {
    throw new Error(`Invalid db type: ${dbType}. Did you mean one of the following: ${Object.values(DBTypes).join(', ')}?`)
  }

  // The name of the parent command is the name of the DB
  const name = getClientNameFromCommand(program)

  switch (dbType) {
    case DBTypes.StateMachine:
      await dumpStateMachineDB(logger, name, state)
      break
    case DBTypes.OnchainEventIndexer:
      await dumpOnchainEventIndexerDB(logger, name)
      break
    case DBTypes.Relayer:
      await dumpTxRelayDB(logger, name)
      break
    default:
      throw new Error('Invalid db type')
  }
}

async function dumpStateMachineDB (logger: Logger, name: string, state?: string) {
  if (!state) {
    throw new Error('State is required when querying state machine DB')
  }

  const db = new StateMachineDB(name)
  let count = 0
  for await (const [key, value] of db.getItemsInState(state)) {
    count++
    logger.debug(key, value)
  }
  logger.debug('Showed all items in state:', state, '. Total:', count)
}

async function dumpOnchainEventIndexerDB (logger: Logger, name: string) {
  const db = new OnchainEventIndexerDB(name)
  let count = 0
  for await (const [key, value] of db.iterator()) {
    count++
    logger.debug(key, value)
  }
  logger.debug('Showed all items in DB. Total:', count)
}

async function dumpTxRelayDB (logger: Logger, name: string) {
  const db = new RelayerDB(name)
  let count = 0
  for await (const [key,] of db.iterator()) {
    // The key is the item itself and the value is simply a boolean indicating existence
    count++
    logger.debug(key)
  }
  logger.debug('Showed all items in DB. Total:', count)
}
