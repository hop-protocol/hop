import getUnbondedTransferRoots from 'src/theGraph/getUnbondedTransferRoots'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

program
  .command('unbonded-transfer-roots')
  .description('Get unbonded transfer roots')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--token <string>', 'Token')
  .option('--destChain <string>', 'Destination Chain')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const destinationChain = source.destChain
      if (!chain) {
        throw new Error('chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }
      if (!destinationChain) {
        throw new Error('destination chain is required')
      }
      const transferRoot = await getUnbondedTransferRoots(
        chain,
        token,
        destinationChain
      )
      console.log(JSON.stringify(transferRoot, null, 2))
    } catch (err) {
      logger.error(err)
    }
  })
