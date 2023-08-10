import BlockDater from 'ethereum-block-by-date'
import fetch from 'isomorphic-fetch'
import { DateTime } from 'luxon'
import { etherscanApiKeys } from '../config'
import { getEtherscanApiUrl } from '../utils/getEtherscanApiUrl'

export async function getBlockNumberFromDate (
  chain: string,
  provider: any,
  timestamp: number
): Promise<number> {
  try {
    const useEtherscan = etherscanApiKeys[chain]
    if (useEtherscan) {
      return await getBlockNumberFromDateUsingEtherscan(chain, timestamp)
    }

    return await getBlockNumberFromDateUsingLib(provider, timestamp)
  } catch (err) {
    return await getBlockNumberFromDateUsingLib(provider, timestamp)
  }
}

// note: the etherscan api can be unreliable because of rate limiting
async function getBlockNumberFromDateUsingEtherscan (
  chain: string,
  timestamp: number
): Promise<number> {
  const apiKey = etherscanApiKeys[chain]
  if (!apiKey) {
    throw new Error('Please add an etherscan api key for ' + chain)
  }

  const baseUrl = getEtherscanApiUrl(chain)
  const url =
    baseUrl +
    `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`
  const res = await fetch(url)
  const resJson: any = await res.json()

  if (resJson.status !== '1') {
    throw new Error(
      `could not retrieve block number for timestamp ${timestamp}: ${JSON.stringify(
        resJson
      )}`
    )
  }

  return Number(resJson.result)
}

async function getBlockNumberFromDateUsingLib (
  provider: any,
  timestamp: number
): Promise<number> {
  if (!provider) {
    throw new Error('provider is required')
  }
  const blockDater = new BlockDater(provider)
  const date = DateTime.fromSeconds(timestamp).toJSDate()

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
