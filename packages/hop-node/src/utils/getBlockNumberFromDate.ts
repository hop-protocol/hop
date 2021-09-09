import BlockDater from 'ethereum-block-by-date'
import getRpcProvider from 'src/utils/getRpcProvider'
import { DateTime } from 'luxon'

async function getBlockNumberFromDate (chain: string, timestamp: number) {
  const provider = getRpcProvider(chain)
  const blockDater = new BlockDater(provider)
  const date = DateTime.fromSeconds(timestamp).toJSDate()
  const info = await blockDater.getDate(date)
  if (!info) {
    throw new Error('could not retrieve block number')
  }

  return info.block
}

export default getBlockNumberFromDate
