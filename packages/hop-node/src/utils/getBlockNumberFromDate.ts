import BlockDater from 'ethereum-block-by-date'
import { getRpcProvider } from '@hop-protocol/hop-node-core/utils'
import { DateTime } from 'luxon'
import { etherscanApiKeys, etherscanApiUrls } from '@hop-protocol/hop-node-core/config'

export async function getBlockNumberFromDate (chain: string, timestamp: number): Promise<number> {
  const useEtherscan = etherscanApiKeys[chain]
  if (useEtherscan) {
    return getBlockNumberFromDateUsingEtherscan(chain, timestamp)
  }

  return getBlockNumberFromDateUsingLib(chain, timestamp)
}

async function getBlockNumberFromDateUsingEtherscan (chain: string, timestamp: number): Promise<number> {
  const apiKey = etherscanApiKeys[chain]
  if (!apiKey) {
    throw new Error('Please add an etherscan api key for ' + chain)
  }

  const baseUrl = etherscanApiUrls[chain]
  const url = baseUrl + `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`
  const res = await fetch(url)
  const resJson: any = await res.json()

  if (resJson.status !== '1') {
    throw new Error(`could not retrieve block number for timestamp ${timestamp}: ${JSON.stringify(resJson)}`)
  }

  return Number(resJson.result)
}

async function getBlockNumberFromDateUsingLib (chain: string, timestamp: number): Promise<number> {
  const provider = getRpcProvider(chain)
  const blockDater = new BlockDater(provider)
  const date = DateTime.fromSeconds(timestamp).toJSDate()

  let retryCount = 0
  let info
  while (true) {
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
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
