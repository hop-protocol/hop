import chalk from 'chalk'
import getTransfer from 'src/theGraph/getTransfer'
import getTransfers from 'src/theGraph/getTransfers'
import {
  FileConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { logger, program } from './shared'

program
  .command('transfers-table')
  .description('Get unsettled transfers')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--chain <string>', 'Chain')
  .option('--token <string>', 'Token')
  .option('--unbonded', 'Return only unbonded transfers')
  .option('--uncommitted', 'Return only uncommitted transfers')
  .option('--unconfirmed', 'Return only unconfirmed transfers')
  .option('--unsettled', 'Return only unsettled transfers')
  .option('--transfer-id <string>', 'Transfer ID')
  .option('--from-date <string>', 'Start date in ISO format')
  .option('--to-date <string>', 'End date in ISO format')
  .option('--order <string>', 'Order direction. Options are "desc", "asc"')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const chain = source.chain
      const token = source.token
      const transferId = source.transferId
      const orderDirection = source.order
      const startDate = source.fromDate
      const endDate = source.toDate
      const filters = {
        unbonded: !!source.unbonded,
        uncommitted: !!source.uncommitted,
        unconfirmed: !!source.unconfirmed,
        unsettled: !!source.unsettled
      }
      if (!chain) {
        throw new Error('chain is required')
      }
      if (!token) {
        throw new Error('token is required')
      }
      const printHeaders = () => {
        const headers = [
          'transfer ID'.padEnd(68, ' '),
          'bonded'.padEnd(10, ' '),
          'committed'.padEnd(10, ' '),
          'confirmed'.padEnd(10, ' '),
          'rootSet'.padEnd(10, ' '),
          'settled'.padEnd(10, ' '),
          'amount'.padEnd(14, ' '),
          'token'.padEnd(6, ' '),
          'source'.padEnd(10, ' '),
          'destination'.padEnd(12, ' '),
          'timestamp'.padEnd(18, ' '),
          'root'.padEnd(68, ' ')
        ]
        console.log(headers.join(' '))
      }
      const printTransfer = (transfer: any) => {
        const { transferId, formattedAmount, sourceChain, destinationChain, bonded, committed, settled, transferRoot, timestampRelative } = transfer
        const root = transferRoot?.rootHash
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
          `${token}`.padEnd(6, ' '),
          `${sourceChain}`.padEnd(10, ' '),
          `${destinationChain}`.padEnd(12, ' '),
          `${timestampRelative}`.padEnd(18, ' '),
          `${root || ''}`.padEnd(68, ' ')
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
        if (filters.unbonded && bonded) {
          return false
        }
        if (filters.uncommitted && committed) {
          return false
        }
        if (filters.unconfirmed && confirmed) {
          return false
        }
        if (filters.unsettled && settled) {
          return false
        }
        console.log(color ? chalk[color](str) : str)
      }
      if (transferId) {
        const transfer = await getTransfer(chain, token, transferId)
        printHeaders()
        printTransfer(transfer)
      } else {
        console.log('searching all transfers. This will take a few minutes to complete.')
        printHeaders()
        await getTransfers(chain, token, (transfer: any) => {
          printTransfer(transfer)
        }, {
          startDate,
          endDate,
          orderDesc: orderDirection !== 'asc'
        })
        console.log('done')
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
