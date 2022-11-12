import fetch from 'node-fetch'
import { etherscanApiKeys, etherscanApiUrls } from 'src/config'

async function getBlockNumberFromDate (chain: string, timestamp: number): Promise<number> {
  const apiKey = etherscanApiKeys[chain]
  const baseUrl = etherscanApiUrls[chain]
  const url = baseUrl + `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`
  const res = await fetch(url)
  const resJson = await res.json()

  if (resJson.status !== '1') {
    throw new Error(`could not retrieve block number for timestamp ${timestamp}: ${JSON.stringify(resJson)}`)
  }

  return Number(resJson.result)
}

export default getBlockNumberFromDate
