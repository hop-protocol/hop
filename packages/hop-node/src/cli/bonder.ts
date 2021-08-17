import {
  FileConfig,
  defaultEnabledWatchers,
  parseConfigFile,
  setConfigByNetwork
  , setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, parseArgList, program } from './shared'
import { printHopArt } from './shared/art'

import { startWatchers } from 'src/watchers/watchers'

program
  .command('bonder')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-o, --order <number>', 'Bonder order')
  .option(
    '-t, --tokens <string>',
    'List of token by symbol to bond, comma separated'
  )
  .option('--l1-network <network>', 'L1 network')
  .option('-c, --chains <network>', 'List of chains to bond, comma separated')
  .description('Start the bonder watchers')
  .action(async source => {
    try {
      printHopArt()
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      if (source.l1Network) {
        logger.info(`network: "${source.l1Network}"`)
        setConfigByNetwork(source.l1Network)
      }
      const order = Number(source.order || 0)
      logger.info('order:', order)
      const tokens = parseArgList(source.tokens).map((value: string) =>
        value.toUpperCase()
      )
      const networks = parseArgList(source.chains).map((value: string) =>
        value.toLowerCase()
      )
      const enabledWatchers: { [key: string]: boolean } = Object.assign(
        {},
        defaultEnabledWatchers
      )
      startWatchers({
        enabledWatchers: Object.keys(enabledWatchers).filter(
          key => enabledWatchers[key]
        ),
        order,
        tokens,
        networks
      })
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
