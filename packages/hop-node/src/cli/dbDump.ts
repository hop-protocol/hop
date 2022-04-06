import chainSlugToId from 'src/utils/chainSlugToId'
import { getDbSet } from 'src/db'
import {
  config as globalConfig,
  setDbPath
} from 'src/config'

import { actionHandler, logger, parseNumber, parseString, root } from './shared'

root
  .command('db-dump')
  .description('Dump leveldb database')
  .option(
    '--db <name>',
    'Name of db. Options are "transfers", "transfer-roots", "sync-state", "token-prices", "gas-cost"',
    parseString
  )
  .option('--db-path <path>', 'Path to leveldb.', parseString)
  .option('--token <symbol>', 'Token symbol', parseString)
  .option('--chain <slug>', 'Chain', parseString)
  .option('--nearest <timestamp>', 'Nearest timestamp in seconds', parseNumber)
  .option('--from-date <timestamp>', 'From date timestamp in seconds', parseNumber)
  .option('--to-date <timestamp>', 'To date timestamp in seconds', parseNumber)
  .action(actionHandler(main))

async function main (source: any) {
  const { dbPath, db: dbName, chain, token: tokenSymbol, nearest, fromDate, toDate } = source
  if (dbPath) {
    setDbPath(dbPath)
  }
  if (!tokenSymbol) {
    throw new Error('token is required')
  }
  const db = getDbSet(tokenSymbol)
  let items: any[] = []
  if (dbName === 'transfer-roots') {
    items = await db.transferRoots.getTransferRoots({
      fromUnix: fromDate,
      toUnix: toDate
    })
  } else if (dbName === 'unbonded-roots') {
    items = await db.transferRoots.getUnbondedTransferRoots({
      sourceChainId: chainSlugToId(chain)
    })
  } else if (dbName === 'transfers') {
    items = await db.transfers.getTransfers({
      fromUnix: fromDate,
      toUnix: toDate
    })
  } else if (dbName === 'sync-state') {
    items = await db.syncState.getItems()
  } else if (dbName === 'gas-cost') {
    if (tokenSymbol && nearest) {
      items = [
        await db.gasCost.getNearest(chain, tokenSymbol, false, nearest),
        await db.gasCost.getNearest(chain, tokenSymbol, true, nearest)
      ]
    } else {
      items = await db.gasCost.getItems()
    }
  } else {
    throw new Error(`the db "${dbName}" does not exist. Options are: transfers, transfer-roots, sync-state, gas-prices, token-prices`)
  }

  logger.debug(`dumping ${dbName} db located at ${globalConfig.db.path}`)
  console.log(JSON.stringify(items, null, 2))
  logger.debug(`count: ${items.length}`)
}
