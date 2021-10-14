import getIncompleteSettlements from 'src/theGraph/getIncompleteSettlements'
import { logger, program } from './shared'
import {
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'

program
  .command('incomplete-settlements')
  .description('Get incomplete settlements')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--source-chain <string>', 'Source chain')
  .option('--destination-chain <string>', 'Destination Chain')
  .option('--token <string>', 'Token')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const sourceChain = source.sourceChain
      const destinationChain = source.destinationChain
      const token = source.token
      if (!token) {
        throw new Error('token is required')
      }
      if (!sourceChain) {
        throw new Error('source chain is required')
      }
      if (!destinationChain) {
        throw new Error('destination chain is required')
      }
      const transferRoot = await getIncompleteSettlements(
        token,
        sourceChain,
        destinationChain
      )
      console.log(JSON.stringify(transferRoot, null, 2))
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  })
