import getRpcUrl from 'src/utils/getRpcUrl'
import { actionHandler, parseString, root } from '../shared'
import getRpcProvider from 'src/utils/getRpcProvider'
import fetch from 'node-fetch'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { nativeChainTokens } from 'src/constants'
import { CoingeckoApiKey } from 'src/config'
import {
  coingeckoCoinIds,
  hopAccountAddresses,
  networks,
  possibleYears,
  tokenDataForYear,
  tokenDecimals
} from 'src/cli/metrics/sharedMetrics'

root
  .command('bonder-tx-cost')
  .description('Tx costs for a bonder for a given year')
  .option('--year <YYYY>', 'The desired year', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  let { year } = source
  year = Number(year)

  if (!year) {
    throw new Error('year is required')
  }

  if (!possibleYears.includes(year)) {
    throw new Error(`year must be one of ${possibleYears}`)
  }

  const tokenData = tokenDataForYear[year]
  console.log(`Using token data for ${year} with tokenData = ${JSON.stringify(tokenData, null, 2)}`)

  const tokenDataPriorYear = tokenDataForYear[year - 1]
  for (const hopAccountAddress of hopAccountAddresses) {

    for (const network of networks) {
      let perChainSpend = 0
      const startBlockNumber = tokenDataPriorYear.blockNumbers[network]
      const endBlockNumber = tokenData.blockNumbers[network]
      const txHashes: string[] = await getUserTransactionsForDate(network, startBlockNumber, endBlockNumber, hopAccountAddress)

      for (const txHash of txHashes) {
        const gasCost = await getGasCost(network, txHash)
        perChainSpend += gasCost
      }

      console.log(`Chain spend on ${network} for ${hopAccountAddress} is $${perChainSpend}`)
    }
  }
}

async function getUserTransactionsForDate (chain: string, startBlockNumber: number, endBlockNumber: number, fromAddress: string) {
  const params = {
    fromBlock: '0x' + startBlockNumber.toString(16),
    toBlock: '0x' + endBlockNumber.toString(16),
    fromAddress: fromAddress.toLowerCase(),
    category: [
      'external'
    ],
    excludeZeroValue: false
  }

  const query = {
    id: 1,
    jsonrpc: '2.0',
    method: 'alchemy_getAssetTransfers',
    params: [params]
  }

  const rpcUrl = getRpcUrl(chain)!
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(query)
  })

  const jsonRes = await res.json()
  if (!jsonRes?.result) {
    const errMessages: Record<string, string> = {
      quickNode: 'Method alchemy_getAssetTransfers is not supported'.toLowerCase(),
      infura: 'The method alchemy_getAssetTransfers does not exist'.toLowerCase(),
      alchemy: 'Provided network base_mainnet does not support these requested categories'.toLowerCase()
    }
    if (
      jsonRes?.error?.message.toLowerCase().includes(errMessages.quickNode) ||
      jsonRes?.error?.message.toLowerCase().includes(errMessages.infura) ||
      jsonRes?.error?.message.toLowerCase().includes(errMessages.alchemy)
    ) {
      // No Alchemy endpoint exists
      return []
    }
    throw new Error(`alchemy_getAssetTransfers failed: ${JSON.stringify(jsonRes)}`)
  }
  return jsonRes.result.transfers.map((tx: any) => tx.hash)
}

async function getGasCost (chain: string, txHash: string): Promise<number> {
  const receipt = await getRpcProvider(chain)!.getTransactionReceipt(txHash)
  const block = await getRpcProvider(chain)!.getBlock(receipt.blockNumber)
  const nativeToken = nativeChainTokens[chain]

  // Get bond gas data
  // Pre-bedrock Optimism had a fixed gasPrice of 0.001 Gwei
  const gasPrice = receipt.effectiveGasPrice || parseUnits('0.001', 'gwei')
  const gasUsed = receipt.gasUsed
  const l1GasCost = await getL1GasCost(chain, txHash)
  const gasCost = (BigNumber.from(gasUsed).mul(gasPrice)).add(l1GasCost)

  const decimals = tokenDecimals[nativeToken]
  const gasCostFormatted: string = formatUnits(gasCost, decimals)
  const nativeTokenPriceUsd = await getPriceByTimestamp(nativeToken, block.timestamp)
  return Number(gasCostFormatted) * nativeTokenPriceUsd
}

async function getL1GasCost (chain: string, txHash: string): Promise<BigNumber> {
  if (chain !== 'optimism' &&  chain!== 'base') {
    return BigNumber.from(0)
  }

  const rpcUrl = getRpcUrl(chain)!
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 1
    })
  })
  const json = await res.json()
  return BigNumber.from(json.result.l1Fee)
}

async function getPriceByTimestamp (token: string, unixTimestamp: number): Promise<number> {
  if (token === 'DAI' || token === 'xDAI') {
    return 1
  }

  const date = new Date(unixTimestamp * 1000)
  const dmyOfDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  const coinId = coingeckoCoinIds[token]
  const baseUrl = 'https://pro-api.coingecko.com'
  const url = `${baseUrl}/api/v3/coins/${coinId}/history?date=${dmyOfDate}&x_cg_pro_api_key=${CoingeckoApiKey}`

  const res = await fetch(url)
  const price: number = (await res.json())?.market_data?.current_price?.usd
  if (!price) {
    throw new Error(`Failed to get price at ${dmyOfDate}`)
  }

  return price
}
