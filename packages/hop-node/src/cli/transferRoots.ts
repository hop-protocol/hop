import getTransferRoots from 'src/theGraph/getTransferRoots'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

program
  .command('transfer-roots')
  .description('Get transfer roots')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--token <string>', 'Token')
  .option('--info', 'Show transfer root info')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const showInfo = source.info
      if (!chain) {
        throw new Error('chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }
      const transferRoots = await getTransferRoots(
        chain,
        token
      )
      console.log(JSON.stringify(transferRoots.map((x: any) => {
        if (showInfo) {
          return x
        }
        return x.rootHash
      }), null, 2))
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
