import getUnbondedTransferRoots from 'src/theGraph/getUnbondedTransferRoots'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

program
  .command('unbonded-transfer-roots')
  .description('Get unbonded transfer roots')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--source-chain <string>', 'Source chain')
  .option('--token <string>', 'Token')
  .option('--destination-chain <string>', 'Destination chain')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const sourceChain = source.sourceChain
      const token = source.token
      const destinationChain = source.destinationChain
      if (!sourceChain) {
        throw new Error('source chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }
      if (!destinationChain) {
        throw new Error('destination chain is required')
      }
      const transferRoot = await getUnbondedTransferRoots(
        sourceChain,
        token,
        destinationChain
      )
      console.log(JSON.stringify(transferRoot, null, 2))
    } catch (err) {
      logger.error(err)
    }
  })
