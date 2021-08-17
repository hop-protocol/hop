import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

program
  .command('show-config')
  .description('Update config file')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      const config: FileConfig = await parseConfigFile(configPath)
      if (configPath) {
        await setGlobalConfigFromConfigFile(config)
      }
      console.log(JSON.stringify(config, null, 2))
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
