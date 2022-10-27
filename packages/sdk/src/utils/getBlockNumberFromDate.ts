import BlockDater from 'ethereum-block-by-date'
import { TProvider } from '../types'

// BlockDater.getDate() recursively calls itself until it finds the block number. Depending on the parameters
// this may cause a call stack size error. ORUs with short block times may be more susceptible to this.
// Retrying is necessary to avoid this error until a better solution is implemented.

async function getBlockNumberFromDate (provider: TProvider, date: Date) {
  const blockDater = new BlockDater(provider)

  let retryCount = 0
  let info
  while (true) {
    try {
      info = await blockDater.getDate(date)
      if (!info) {
        throw new Error('could not retrieve block number')
      }
    } catch (err) {
      retryCount++
      console.log(`getBlockNumberFromDate: retrying ${retryCount}`)
      if (retryCount < 5) continue
      break
    }
    break
  }

  if (!info) {
    throw new Error('could not retrieve block number')
  }
  return info.block
}

export default getBlockNumberFromDate
