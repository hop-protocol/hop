import chalk from 'chalk'
import getTransfers from 'src/theGraph/getTransfers'
import {
  Config,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from './shared/config'
import { logger, program } from './shared'

program
  .command('transfers-table')
  .description('Get unsettled transfers')
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
      if (!chain) {
        throw new Error('chain is required')
      }
      console.log('transfer ID\t\t\t\t\t\t\t\tbonded\t\tcomitted\tconfirmed\tsettled\t\ttimestamp')
      await getTransfers(chain, (transfer: any) => {
        const { transferId, bonded, committed, settled, transferRoot, timestampRelative } = transfer
        if (settled) {
          return
        }
        const confirmed = !!transferRoot?.rootConfirmed
        const needsSettlement = !!(bonded && confirmed && !settled)
        const completed = !!(bonded && confirmed && settled)
        const str = `${transferId}\t${bonded}\t\t${committed}\t\t${confirmed}\t\t${settled}\t\t${timestampRelative}`
        let color : string
        if (needsSettlement) {
          color = 'magenta'
        } else if (!bonded) {
          color = 'yellow'
        } if (!committed) {
          color = 'white'
        } else if (completed) {
          color = 'green'
        }
        console.log(color ? chalk[color](str) : str)
      })
      console.log('done')
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
