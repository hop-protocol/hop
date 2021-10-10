import {
  FileConfig,
  config as globalConfig,
  parseConfigFile,
  setDbPath,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { getDbSet } from 'src/db'

import { logger, program } from './shared'

program
  .command('db-dump')
  .option(
    '--db <string>',
    'Name of db. Options are "transfers", "transfer-roots"'
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
        const config: FileConfig = await parseConfigFile(configPath)
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
      let items : any[] = []
      if (dbName === 'transfer-roots') {
        items = await db.transferRoots.getTransferRoots()
      } else if (dbName === 'transfers') {
        items = await db.transfers.getTransfers({
          fromUnix: fromDate,
          toUnix: toDate
        })
      } else if (dbName === 'sync-state') {
        items = await db.syncState.getItems()
      } else if (dbName === 'gas-prices') {
        if (chain && nearest) {
          items = [await db.gasPrices.getNearest(chain, nearest, false)]
        } else {
          items = await db.gasPrices.getItems()
        }
      } else if (dbName === 'token-prices') {
        if (tokenSymbol && nearest) {
          items = [await db.tokenPrices.getNearest(tokenSymbol, nearest, false)]
        } else {
          items = await db.tokenPrices.getItems()
        }
      } else {
        throw new Error(`the db "${dbName}" does not exist. Options are: transfers, transfer-roots, sync-state, gas-prices, token-prices`)
      }

      logger.debug(`count: ${items.length}`)
      logger.debug(`dumping ${dbName} db located at ${globalConfig.db.path}`)
      console.log(JSON.stringify(items, null, 2))
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
