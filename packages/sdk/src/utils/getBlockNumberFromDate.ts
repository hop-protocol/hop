// @ts-expect-error No types as of 20240128
import BlockDater from 'ethereum-block-by-date'
import { providers } from 'ethers'
import { fetchJsonOrThrow, getChain } from '@hop-protocol/sdk-core'

export async function getBlockNumberFromDate (provider: providers.Provider, timestamp: number, etherscanApiKey?: string): Promise<number> {
  if (etherscanApiKey) {
    const network = await provider.getNetwork()
    return getBlockNumberFromDateUsingEtherscan(network.name, timestamp, etherscanApiKey)
  }

  return getBlockNumberFromDateUsingLib(provider, timestamp)
}

export async function getBlockNumberFromDateUsingEtherscan (chain: string, timestamp: number, etherscanApiKey: string): Promise<number> {
  const baseUrl = getEtherscanApiUrl(chain)
  if (!baseUrl) {
    throw new Error(`etherscan base url not found for chain ${chain}`)
  }
  const url = baseUrl + `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${etherscanApiKey}`
  const json = await fetchJsonOrThrow(url)

  if (json.status !== '1') {
    throw new Error(`could not retrieve block number for timestamp ${timestamp}: ${JSON.stringify(json)}`)
  }

  return Number(json.result)
}

export async function getBlockNumberFromDateUsingLib (provider: providers.Provider, timestamp: number): Promise<number> {
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

function getEtherscanApiUrl (chain: string) {
  return getChain(chain).etherscanApiUrl
}