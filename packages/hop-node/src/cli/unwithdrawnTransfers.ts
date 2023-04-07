import bridgeAbi from '@hop-protocol/core/abi/generated/Bridge.json'
import chainSlugToId from 'src/utils/chainSlugToId'
import getRpcProvider from 'src/utils/getRpcProvider'
import getTransferRootSet from 'src/theGraph/getTransferRootSet'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import { BigNumber, Contract } from 'ethers'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'
import {
  actionHandler,
  parseString,
  root
} from './shared'
import { config as globalConfig } from 'src/config'

interface TransferRootsToChain {
  rootHash: string
  totalAmount: string
}

root
  .command('unwithdrawn-transfers')
  .description('Get all transfers that have not been withdrawn')
  .option('--chain <slug>', 'Destination chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .action(actionHandler(main))

export async function main (source: any) {
  let { chain: destinationChain, token, startTimestamp, endTimestamp } = source
  if (!destinationChain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }

  if (!startTimestamp) {
    startTimestamp = 0
  }

  if (!endTimestamp) {
    const now = DateTime.now().toUTC()
    endTimestamp = Math.floor(now.toSeconds())
  }

  const addresses = globalConfig.addresses[token]
  if (!addresses) {
    throw new Error('addresses not found')
  }

  // Get contracts
  let bridgeAddress = ''
  if (destinationChain === Chain.Ethereum) {
    bridgeAddress = addresses[destinationChain].l1Bridge
  } else {
    bridgeAddress = addresses[destinationChain].l2Bridge
  }

  // Get transfer roots to chain
  // NOTE: For most chains, we can look up the roots that have been set on the chain. For chains with a regenesis,
  // we need to look up the roots that have been committed to the chain.
  const transferRootsToChain: TransferRootsToChain[] = await getTransferRootsToChain(
    destinationChain,
    token,
    startTimestamp,
    endTimestamp
  )

  const provider = getRpcProvider(destinationChain)!
  const contract = new Contract(bridgeAddress, bridgeAbi, provider)
  let amountUnwithdrawnTotal: BigNumber = BigNumber.from('0')
  for (const transferRootToChain of transferRootsToChain) {
    const rootHash = transferRootToChain.rootHash
    const totalAmount = transferRootToChain.totalAmount
    const transferRoot = await contract.getTransferRoot(rootHash, totalAmount)
    const amountUnwithdrawn = transferRoot.total.sub(transferRoot.amountWithdrawn)
    amountUnwithdrawnTotal = amountUnwithdrawnTotal.add(amountUnwithdrawn)
  }

  return amountUnwithdrawnTotal
}

async function getTransferRootsToChain (
  destinationChain: Chain,
  token: string,
  startTimestamp: number,
  endTimestamp: number
): Promise<TransferRootsToChain[]> {
  const transferRootsToChain: TransferRootsToChain[] = []
  if (destinationChain === Chain.Optimism) {
    const destinationChainId = chainSlugToId(destinationChain)
    const sourceChains: string[] = []
    for (const chain in globalConfig.addresses[token]) {
      if (
        chain === Chain.Ethereum ||
        chain === Chain.Optimism
      ) continue
      sourceChains.push(chain)
    }

    for (const sourceChain of sourceChains) {
      if (!Number.isNaN(endTimestamp)) {
        // Roots can be committed up to 3 hours before they are set on the destination chain, so we need to ignore
        // any roots that were committed within the last 3 hours.
        const threeHoursSeconds = 3 * 60 * 60
        endTimestamp = endTimestamp - threeHoursSeconds
        if (startTimestamp > endTimestamp) {
          throw new Error('startTimestamp must be less than the adjusted endTimestamp')
        }
      }
      const rootsCommitted = await getTransfersCommitted(sourceChain, token, destinationChainId, startTimestamp, endTimestamp)
      for (const rootCommitted of rootsCommitted) {
        transferRootsToChain.push({
          rootHash: rootCommitted.rootHash,
          totalAmount: rootCommitted.totalAmount
        })
      }
    }
  } else {
    const setTransferRoots = await getTransferRootSet(destinationChain, token, startTimestamp, endTimestamp)
    for (const setTransferRoot of setTransferRoots) {
      transferRootsToChain.push({
        rootHash: setTransferRoot.rootHash,
        totalAmount: setTransferRoot.totalAmount
      })
    }
  }

  return transferRootsToChain
}