import { getDbSet } from 'src/db'
import {
  config as globalConfig,
  parseConfigFile,
  setDbPath,
  setGlobalConfigFromConfigFile
} from 'src/config'

import { logger, program } from './shared'

program
  .command('db-dump')
  .option(
    '--db <string>',
    'Name of db. Options are "transfers", "transfer-roots", "sync-state", "token-prices", "gas-cost"'
  )
  .option('--db-path <string>', 'Path to leveldb.')
  .option('--token <string>', 'Token symbol')
  .option('--config <string>', 'Config file to use.')
  .option('--chain <string>', 'Chain')
  .option('--nearest <string>', 'Nearest timestamp')
  .option('--from-date <string>', 'From date timestamp')
  .option('--to-date <string>', 'To date timestamp')
  .description('Dump leveldb database')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      if (source.dbPath) {
        setDbPath(source.dbPath)
      }
      const tokenSymbol = source.token
      if (!tokenSymbol) {
        throw new Error('token is required')
      }
      const dbName = source.db || 'transfers'
      const db = getDbSet(tokenSymbol)
      const chain = source.chain
      const nearest = Number(source.nearest)
      const fromDate = Number(source.fromDate)
      const toDate = Number(source.toDate)
      let items: any[] = []
      if (dbName === 'transfer-roots') {
        items = await db.transferRoots.getTransferRoots({
          fromUnix: fromDate,
          toUnix: toDate
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
      process.exit(0)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
