import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

import getTransferId from 'src/theGraph/getTransfer'

program
  .command('transfer-id')
  .description('Get transfer ID info')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--token <string>', 'Token')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const transferId = source.args[0]
      const chain = source.chain
      const token = source.token
      if (!transferId) {
        throw new Error('transfer ID is required')
      }
      if (!chain) {
        throw new Error('chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }
      const transfer = await getTransferId(
        chain,
        token,
        transferId
      )
      const showInfo = source.info
      console.log(JSON.stringify(transfer, null, 2))
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
