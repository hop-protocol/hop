import BlockDater from 'ethereum-block-by-date'
import { Chain } from '../models/Chain'
import { DateTime } from 'luxon'
import { etherscanApiKeys, etherscanApiUrls } from '../config'
import { fetchJsonOrThrow } from './fetchJsonOrThrow'

export async function getBlockNumberFromDate (chain: Chain, timestamp: number): Promise<number> {
  const chainSlug = chain.slug
  const chainProvider = chain.provider
  const useEtherscan = etherscanApiKeys[chainSlug]
  if (useEtherscan) {
    return getBlockNumberFromDateUsingEtherscan(chainSlug, timestamp)
  }

  return getBlockNumberFromDateUsingLib(chainProvider, timestamp)
}

export async function getBlockNumberFromDateUsingEtherscan (chain: string, timestamp: number): Promise<number> {
  const apiKey = etherscanApiKeys[chain]
  if (!apiKey) {
    throw new Error('Please add an etherscan api key for ' + chain)
  }

  const baseUrl = etherscanApiUrls[chain]
  const url = baseUrl + `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`
  const json = await fetchJsonOrThrow(url)

  if (json.status !== '1') {
    throw new Error(`could not retrieve block number for timestamp ${timestamp}: ${JSON.stringify(json)}`)
  }

  return Number(json.result)
}

export async function getBlockNumberFromDateUsingLib (provider: any, timestamp: number): Promise<number> {
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

export default getBlockNumberFromDate
