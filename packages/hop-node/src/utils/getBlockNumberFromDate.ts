import BlockDater from 'ethereum-block-by-date'
import { DateTime } from 'luxon'
import { etherscanApiKeys } from '#config/index.js'
import { getRpcProvider } from '#utils/getRpcProvider.js'
import { ChainSlug } from '@hop-protocol/sdk'

export const etherscanApiUrls: Record<string, string> = {
  [ChainSlug.Ethereum]: 'https://api.etherscan.io',
  [ChainSlug.Polygon]: 'https://api.polygonscan.com',
  [ChainSlug.Optimism]: 'https://api-optimistic.etherscan.io',
  [ChainSlug.Arbitrum]: 'https://api.arbiscan.io',
  [ChainSlug.Gnosis]: 'https://api.gnosisscan.io',
  [ChainSlug.Nova]: 'https://api-nova.arbiscan.io',
  [ChainSlug.Base]: 'https://api.basescan.org',
  [ChainSlug.Linea]: 'https://api.lineascan.build',
  [ChainSlug.PolygonZk]: 'https://api-zkevm.polygonscan.com'
}

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
  const provider = getRpcProvider(chain as ChainSlug)
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
