import { etherscanApiKeys, etherscanApiUrls } from '../config'

const wait = (t: number) =>
  new Promise(resolve => setTimeout(() => resolve(null), t))

async function getBlockNumberFromDate (chain: string, timestamp: number): Promise<number> {
  const apiKey = etherscanApiKeys[chain]
  if (!apiKey) {
    throw new Error('Please add an etherscan api key for ' + chain)
  }

  const baseUrl = etherscanApiUrls[chain]
  const url = baseUrl + `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`

  let retryCount = 0
  while (true) {
    try {
      const res = await fetch(url)
      const resJson = await res.json()

      if (resJson.status !== '1') {
        throw new Error(`could not retrieve block number ${JSON.stringify(resJson)}`)
      }

      return Number(resJson.result)
    } catch (err) {
      console.error(`getBlockNumberFromDate try number ${retryCount} err: ${err.message}`)
      retryCount++
      if (retryCount < 5) continue
      // Add variability so that runs in parallel don't all fail at the same time
      const waitTimeSec = Math.floor(Math.random() * 5)
      await wait(waitTimeSec * 1000)
      break
    }
  }

  throw new Error('could not retrieve block number')
}

export default getBlockNumberFromDate