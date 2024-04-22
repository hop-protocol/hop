// @ts-expect-error No types as of 20240128
import BlockDater from 'ethereum-block-by-date'
import { Chain } from '@hop-protocol/sdk-core'

export async function getBlockNumberFromDate (chain: Chain, timestamp: number): Promise<number> {
  const chainProvider = chain.provider
  return getBlockNumberFromDateUsingLib(chainProvider, timestamp)
}

export async function getBlockNumberFromDateUsingLib (provider: any, timestamp: number): Promise<number> {
  const blockDater = new BlockDater(provider)
  const date = new Date(timestamp * 1000)

  let retryCount = 0
  let info
  while (true) {
    try {
      info = blockDater.getDate(date)
      if (!info) {
        throw new Error('could not retrieve block number')
      }
    } catch (err) {
      retryCount++
      // console.warn(`getBlockNumberFromDate: retrying ${retryCount}`)
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
