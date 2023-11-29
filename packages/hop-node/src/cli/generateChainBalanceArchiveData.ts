import { BigNumber } from 'ethers'
import {
  Chain,
  ChainBalanceArchiveData,
  Token
} from 'src/constants'
import { actionHandler, parseString, root } from './shared'
import { getHistoricalUnrelayedL1ToL2Transfers } from './shared/utils'
import { main as getUnwithdrawnTransfers } from './unwithdrawnTransfers'
import { config as globalConfig } from 'src/config'

root
  .command('generate-chain-balance-archive-data')
  .description('Generate chain balance archive data from before a given timestamp')
  .option('--token <symbol>', 'Token', parseString)
  .option('--timestamp <timestamp>', 'Timestamp in seconds', parseString)
  .action(actionHandler(main))

enum ArchiveType {
  UnwithdrawnTransfers = 'UnwithdrawnTransfers',
  InFlightL1ToL2Transfers = 'InFlightL1ToL2Transfers',
  L1TokensSentDirectlyToBridge = 'L1TokensSentDirectlyToBridge',
  L1InvalidRoot = 'L1InvalidRoot'
}

async function main (source: any) {
  const { token, timestamp } = source

  if (!token) {
    throw new Error('token is required')
  }

  if (!timestamp) {
    throw new Error('timestamp is required')
  }

  // If the timestamp is within the last hour, throw
  if (Date.now() / 1000 - Number(timestamp) < 3600) {
    throw new Error('timestamp must be at least 1 hour in the past')
  }

  console.log(`\nRetrieving archive data for token ${token}. This may take up to an hour to run.`)

  const supportedChainsForToken: string[] = []
  for (const chain in globalConfig.addresses[token]) {
    supportedChainsForToken.push(chain)
  }

  const promises: Array<Promise<void>> = []
  for (const supportedChainForToken of supportedChainsForToken) {
    promises.push(getArchiveData(
      token as Token,
      supportedChainForToken as Chain,
      Number(timestamp)
    ))
  }
  await Promise.all([...promises])
}

async function getArchiveData (token: Token, chain: Chain, timestamp: number): Promise<void> {
  if (chain === Chain.Ethereum) {
    return getL1ArchiveData(token, timestamp)
  }
  return getL2ArchiveData(token, chain, timestamp)
}

async function getL1ArchiveData (token: Token, timestamp: number): Promise<void> {
  // Unwithdrawn Transfers
  const l1UnwithdrawnTransfers = await getUnwithdrawnTransfers({
    token,
    chain: Chain.Ethereum,
    startDate: 0,
    endDate: timestamp
  })
  const expected = ChainBalanceArchiveData.UnwithdrawnTransfers?.[token]?.[Chain.Ethereum] ?? '0'
  compare(ArchiveType.UnwithdrawnTransfers, Chain.Ethereum, expected, l1UnwithdrawnTransfers)

  // L1 tokens sent directly to bridge contract
  // Data from Dune - https://gist.github.com/shanefontaine/2da8c8c997a173f000f2906518c4e03a
  // NOTE: Does not work for ETH. To retrieve ETH values, you must look at incoming transfers, self-destructed transfers,
  // block rewards, etc.

  // L1 invalid root
  // Data from archive Arbitrum RPC endpoint
}

async function getL2ArchiveData (token: Token, chain: Chain, timestamp: number): Promise<void> {
  const l2UnwithdrawnTransfers = await getUnwithdrawnTransfers({
    token,
    chain,
    endDate: timestamp
  })
  let expected = ChainBalanceArchiveData.UnwithdrawnTransfers?.[token]?.[chain] ?? '0'
  compare(ArchiveType.UnwithdrawnTransfers, chain, expected, l2UnwithdrawnTransfers)

  const endTimestamp = timestamp
  const inFlightL1ToL2Transfers: BigNumber = await getHistoricalUnrelayedL1ToL2Transfers(token, chain, endTimestamp)
  expected = ChainBalanceArchiveData.InFlightL1ToL2Transfers?.[token]?.[chain] ?? '0'
  compare(ArchiveType.InFlightL1ToL2Transfers, chain, expected, inFlightL1ToL2Transfers)
}

function compare (type: ArchiveType, chain: string, expected: string, actual: BigNumber): void {
  const expectedBn: BigNumber = BigNumber.from(expected)
  if (!expectedBn.eq(actual)) {
    console.log(`(${chain}) ${type}: Expected: ${expected}, Actual: ${actual}`)
  }
}
