import db from 'src/db'
import {
  Config,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from './shared/config'
import { db as dbConfig } from 'src/config'
import { logger, program } from './shared'

program
  .command('db-dump')
  .option(
    '--db <string>',
    'Name of db. Options are "transfers", "transfer-roots"'
  )
  .option('--db-path <string>', 'Path to leveldb.')
  .option('--config <string>', 'Config file to use.')
  .description('Dump leveldb database')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      if (source.dbPath) {
        dbConfig.path = source.dbPath
      }
      const dbName = source.db || 'transfers'
      logger.debug(`dumping ${dbName} db located at ${dbConfig.path}`)

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
