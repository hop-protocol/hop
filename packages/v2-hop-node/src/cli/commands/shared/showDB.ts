import { StateMachineDB } from '#state-machine/index.js'
import { OnchainEventIndexerDB } from '#indexer/index.js'
import { RelayerDB } from '#relayer/index.js'
import { Logger } from '#logger/index.js'
import { Argument, Command } from 'commander'
import { parseString } from '../../utils.js'

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
  const name = program.parent?.name()
  if (!name) {
    throw new Error('Parent command name is required')
  }

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
  for await (const [key, value] of db.getItemsInState(state)) {
    logger.debug(key, value)
  }
}

async function dumpOnchainEventIndexerDB (logger: Logger, name: string) {
  const db = new OnchainEventIndexerDB(name)
  for await (const [key, value] of db.iterator()) {
    logger.debug(key, value)
  }
}

async function dumpTxRelayDB (logger: Logger, name: string) {
  const db = new RelayerDB(name)
  for await (const [key,] of db.iterator()) {
    // The key is the item itself and the value is simply a boolean indicating existence
    logger.debug(key)
  }
}
