import { Chain } from 'src/constants'
import {
  getEnabledNetworks,
  getEnabledTokens,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

import getTransferRootsCount from 'src/theGraph/getTransferRootsCount'

program
  .command('transfer-roots-count')
  .description('Get transfer roots count')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }

      const chains = getEnabledNetworks()
      const tokens = getEnabledTokens()
      const counts: Record<string, Record<string, number>> = {}
      let total = 0
      for (const chain of chains) {
        if (chain === Chain.Ethereum) {
          continue
        }
        for (const token of tokens) {
          console.log(`fetching ${chain}.${token} count`)
          const count = await getTransferRootsCount(chain, token)
          if (!counts[chain]) {
            counts[chain] = {}
          }
          if (!counts[chain][token]) {
            counts[chain][token] = 0
          }
          counts[chain][token] += count
          total += count
        }
      }
      console.log(JSON.stringify(counts, null, 2))
      console.log(`total: ${total}`)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
