import chalk from 'chalk'
import getTransfer from 'src/theGraph/getTransfer.js'
import getTransfers from 'src/theGraph/getTransfers.js'
import { actionHandler, parseBool, parseString, root } from './shared/index.js'

root
  .command('transfers-table')
  .description('Get unsettled transfers')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--unbonded [boolean]', 'Return only unbonded transfers', parseBool)
  .option('--uncommitted [boolean]', 'Return only uncommitted transfers', parseBool)
  .option('--unconfirmed [boolean]', 'Return only unconfirmed transfers', parseBool)
  .option('--confirmed [boolean]', 'Return only confirmed transfers', parseBool)
  .option('--unsettled [boolean]', 'Return only unsettled transfers', parseBool)
  .option('--transfer-id <id>', 'Transfer ID', parseString)
  .option('--from-date <datetime>', 'Start date in ISO format', parseString)
  .option('--to-date <datetime>', 'End date in ISO format', parseString)
  .option('--order <direction>', 'Order direction. Options are "desc", "asc"', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, transferId, order: orderDirection, fromDate: startDate, toDate: endDate, confirmed, unbonded, uncommitted, unconfirmed, unsettled } = source
  const filters = {
    unbonded: unbonded,
    uncommitted: uncommitted,
    unconfirmed: unconfirmed,
    unsettled: unsettled
  }
  if (!chain) {
    throw new Error('chain is required')
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
    const { transferId, formattedAmount, token, sourceChain, destinationChain, bonded, committed, settled, transferRoot, timestampRelative } = transfer
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
    let color: typeof chalk.Color | undefined
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
    if (confirmed !== undefined) {
      if (!confirmed) {
        return false
      }
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
}
