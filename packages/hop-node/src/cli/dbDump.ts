import {
  FileConfig,
  config as globalConfig,
  parseConfigFile
  , setGlobalConfigFromConfigFile
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
  .description('Dump leveldb database')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      if (source.dbPath) {
        globalConfig.db.path = source.dbPath
      }
      const tokenSymbol = source.token
      if (!tokenSymbol) {
        throw new Error('token is required')
      }
      const dbName = source.db || 'transfers'
      logger.debug(`dumping ${dbName} db located at ${globalConfig.db.path}`)

      const db = getDbSet(tokenSymbol)
      if (dbName === 'transfer-roots') {
        const transferRoots = await db.transferRoots.getTransferRoots()
        console.log(JSON.stringify(transferRoots, null, 2))
      } else if (dbName === 'transfers') {
        const transfers = await db.transfers.getTransfers()
        console.log(JSON.stringify(transfers, null, 2))
      } else if (dbName === 'sync-state') {
        const syncState = await db.syncState.getItems()
        console.log(JSON.stringify(syncState, null, 2))
      } else {
        throw new Error(`the db "${db}" does not exist`)
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
