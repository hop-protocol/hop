import { actionHandler, parseBool, parseNumber, root } from './shared'
import { getInvalidBondWithdrawals } from 'src/theGraph/getInvalidBondWithdrawals'
import { DateTime } from 'luxon'

root
  .command('invalid-bond-withdrawals')
  .description('Invalid bond withdrawal')
  .option('--start-timestamp <timestamp>', 'Starting timestamp in seconds', parseNumber)
  .option('--end-timestamp <timestamp>', ' Ending timestamp in seconds', parseNumber)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  let { startTimestamp, endTimestamp } = source

  if (!startTimestamp) {
    startTimestamp = 0
  }

  if (!endTimestamp) {
    const now = DateTime.now().toUTC()
    endTimestamp = Math.floor(now.toSeconds())
  }

  if (startTimestamp > endTimestamp) {
    throw new Error('startTimestamp must be less than endTimestamp')
  }

  const optimismRegenesisTimestamp = 1636704000
  if (startTimestamp < optimismRegenesisTimestamp) {
    throw new Error('startTimestamp must be greater than or equal to optimism regenesis timestamp. data prior to this time is not available.')
  }

  let count = 0
  const items = await getInvalidBondWithdrawals(startTimestamp, endTimestamp)
  items.map((item: any) => {
    const {
      transferId,
      amount,
      transactionHash,
      transactionIndex,
      timestamp,
      blockNumber,
      contractAddress,
      token,
      destinationChain,
     from 
    } = item
    console.log({
      transferId,
      amount,
      transactionHash,
      transactionIndex,
      timestamp,
      blockNumber,
      contractAddress,
      token,
      from,
      destinationChain
    })
    count++
  })

  console.log('\nCount:', count)
}
