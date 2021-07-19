import chalk from 'chalk'
import getTransfer from 'src/theGraph/getTransfer'
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
  .option('--transfer-id <string>', 'Transfer ID')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const transferId = source.transferId
      if (!chain) {
        throw new Error('chain is required')
      }
      const headers = [
        'transfer ID'.padEnd(68, ' '),
        'bonded'.padEnd(10, ' '),
        'committed'.padEnd(10, ' '),
        'confirmed'.padEnd(10, ' '),
        'rootSet'.padEnd(10, ' '),
        'settled'.padEnd(10, ' '),
        'amount'.padEnd(14, ' '),
        'source'.padEnd(10, ' '),
        'destination'.padEnd(12, ' '),
        'timestamp'.padEnd(10, ' ')
      ]
      console.log(headers.join(' '))
      const printTransfer = (transfer: any) => {
        const { transferId, formattedAmount, sourceChain, destinationChain, bonded, committed, settled, transferRoot, timestampRelative } = transfer
        if (settled) {
          return
        }
        const confirmed = !!transferRoot?.rootConfirmed
        const rootSet = !!transferRoot?.rootSet
        const needsSettlement = !!(bonded && confirmed && !settled)
        const completed = !!(bonded && confirmed && settled)
        const fields = [
          `${transferId}`.padEnd(68, ' '),
          `${bonded}`.padEnd(10, ' '),
          `${committed}`.padEnd(10, ' '),
          `${confirmed}`.padEnd(10, ' '),
          `${rootSet}`.padEnd(10, ' '),
          `${settled}`.padEnd(10, ' '),
          `${formattedAmount}`.padEnd(14, ' '),
          `${sourceChain}`.padEnd(10, ' '),
          `${destinationChain}`.padEnd(12, ' '),
          `${timestampRelative}`.padEnd(10, ' ')
        ]
        const str = fields.join(' ')
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
      }
      if (transferId) {
        const transfer = await getTransfer(chain, transferId)
        printTransfer(transfer)
      } else {
        await getTransfers(chain, (transfer: any) => {
          printTransfer(transfer)
        })
        console.log('done')
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
