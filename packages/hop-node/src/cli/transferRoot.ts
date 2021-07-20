import getTransferRoot from 'src/theGraph/getTransferRoot'
import {
  Config,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from './shared/config'
import { logger, program } from './shared'

program
  .command('transfer-root')
  .description('Get transfer root info')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const transferRootHash = source.args[0]
      const showInfo = source.info
      if (!chain) {
        throw new Error('chain is required')
      }
      const transferRoot = await getTransferRoot(
        chain,
        transferRootHash
      )
      console.log(JSON.stringify(transferRoot, null, 2))
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
