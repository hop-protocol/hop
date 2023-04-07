import { actionHandler, parseString, root } from './shared'
import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'
import { config as globalConfig } from 'src/config'
import { main as getUnwithdrawnTransfers } from './unwithdrawnTransfers'
import { getHistoricalUnrelayedL1ToL2Transfers } from './shared/utils'

root
  .command('generate-chain-balance-archive-data')
  .description('Generate chain balance archive data from before a given timestamp')
  .option('--token <symbol>', 'Token', parseString)
  .option('--timestamp <timestamp>', 'Timestamp in seconds', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  let { token, timestamp } = source

  if (!token) {
    throw new Error('token is required')
  }

  if (!timestamp) {
    throw new Error('timestamp is required')
  }

  console.log(`\nRetrieving archive data for token ${token}. This may take up to an hour to run.`)

  const supportedChainsForToken: string[] = []
  for (const chain in globalConfig.addresses[token]) {
    supportedChainsForToken.push(chain)
  }

  const promises: Array<Promise<void>> = []
  for (const supportedChainForToken of supportedChainsForToken) {
    promises.push(getArchiveData(
      token,
      supportedChainForToken,
      Number(timestamp)
    ))
  }
  await Promise.all([...promises])
}

async function getArchiveData (token: string, chain: string, timestamp: number): Promise<void> {
  if (chain === Chain.Ethereum) {
    return getL1ArchiveData(token, timestamp)
  }
  return getL2ArchiveData(token, chain, timestamp)
}

async function getL1ArchiveData (token: string, timestamp: number): Promise<void> {
  // Unwithdrawn Transfers
  const l1UnwithdrawnTransfers = await getUnwithdrawnTransfers({
    token,
    chain: Chain.Ethereum,
    startDate: 0,
    endDate: timestamp
  })
  console.log(`${Chain.Ethereum} l1UnwithdrawnTransfers: ${l1UnwithdrawnTransfers.toString()}`)

  // L1 tokens sent directly to bridge contract
  // Data from Dune - https://gist.github.com/shanefontaine/2da8c8c997a173f000f2906518c4e03a
  // NOTE: Does not work for ETH. To retrieve ETH values, you must look at incoming transfers, self-destructed transfers,
  // block rewards, etc.
  console.log(`${Chain.Ethereum} l1TokensSentDirectlyToBridge: (Run attached Dune query)`)

  // L1 invalid root
  // Data from archive Arbitrum RPC endpoint
  console.log(`${Chain.Ethereum} l1InvalidRoot: (Query archive RPC node)`)
}

async function getL2ArchiveData (token: string, chain: string, timestamp: number): Promise<void> {
  const l2UnwithdrawnTransfers = await getUnwithdrawnTransfers({
    token,
    chain: chain,
    endDate: timestamp
  })
  console.log(`${chain} l2UnwithdrawnTransfers: ${l2UnwithdrawnTransfers.toString()}`)

  const endTimestamp = timestamp
  const inFlightL1ToL2Transfers: BigNumber = await getHistoricalUnrelayedL1ToL2Transfers(token, chain, endTimestamp)
  console.log(`${chain} inFlightL1ToL2Transfers: ${inFlightL1ToL2Transfers.toString()}`)
}
