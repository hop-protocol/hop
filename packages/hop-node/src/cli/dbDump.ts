import { logger, program } from './shared'
import {
  setGlobalConfigFromConfigFile,
  Config,
  parseConfigFile
} from './shared/config'
import db from 'src/db'
import { startCommitTransferWatchers } from 'src/watchers/watchers'
import { db as dbConfig } from 'src/config'

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
      let dbName = source.db || 'transfers'
      logger.debug(`dumping ${dbName} db located at ${dbConfig.path}`)

      if (dbName === 'transfer-roots') {
        const transferRoots = await db.transferRoots.getTransferRoots()
        console.log(JSON.stringify(transferRoots, null, 2))
      } else {
        const transfers = await db.transfers.getTransfers()
        console.log(JSON.stringify(transfers, null, 2))
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
