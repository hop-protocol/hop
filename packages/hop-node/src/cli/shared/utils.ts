import { BigNumber, providers } from 'ethers'
import { Chain } from 'src/constants'
import { DateTime } from 'luxon'

import getTransferSentToL2 from 'src/theGraph/getTransferSentToL2'
import getTransferFromL1Completed from 'src/theGraph/getTransferFromL1Completed'

export async function getHistoricalUnrelayedL1ToL2Transfers (
  token: string,
  chain: string,
  endTimestamp: number
): Promise<BigNumber> {
  // It is not possible to get Optimism pre-regenesis data from TheGraph. However, there are no unrelayed messages
  // from pre-regenesis, so we can return 0
  if (chain === Chain.Optimism) {
    return BigNumber.from('0')
  }

  const startTimestamp = 0
  const l1ToL2TransfersReceived = await getTransferFromL1Completed(chain, token, startTimestamp, endTimestamp)
  
  // For historical data, we want to ignore the in-flight transfers at the time of the snapshot, since we are
  // not concerned with that level of granularity
  const thirtyMinutesSeconds = 30 * 60
  endTimestamp = endTimestamp - thirtyMinutesSeconds
  const l1ToL2TransfersSent = await getTransferSentToL2(Chain.Ethereum, token, startTimestamp, endTimestamp)

  return getUnrelayedL1ToL2Transfers(chain, l1ToL2TransfersSent, l1ToL2TransfersReceived)
}

export async function getRecentUnrelayedL1ToL2Transfers (
  token: string,
  chain: string,
  l1EndTimestamp: number,
  l2EndTimestamp: number
): Promise<BigNumber> {
  const now = DateTime.now().toUTC()
  const startTimestamp = now.minus({ minutes: 30 })
  const startTimestampSeconds = Math.floor(startTimestamp.toSeconds())

  const l1ToL2TransfersReceived = await getTransferFromL1Completed(chain, token, startTimestampSeconds, l2EndTimestamp)
  const l1ToL2TransfersSent = await getTransferSentToL2(Chain.Ethereum, token, startTimestampSeconds, l1EndTimestamp)

  return getUnrelayedL1ToL2Transfers(chain, l1ToL2TransfersSent, l1ToL2TransfersReceived)
}

async function getUnrelayedL1ToL2Transfers (
  chain: string,
  l1ToL2TransfersSent: any,
  l1ToL2TransfersReceived: any
): Promise<BigNumber> {
  // Track the index of transfers we've seen. There may be transfers that have identical fields, but different indexes
  // since the indexes are not relevant to on-chain data
  const seenIndexes: number[] = []
  let inFlightL1ToL2Transfers: BigNumber = BigNumber.from('0')
  for (const l1ToL2TransferSent of l1ToL2TransfersSent) {
    if (l1ToL2TransferSent.destinationChain !== chain) continue

    let isSeen = false
    for (const [index, l1ToL2TransferReceived] of l1ToL2TransfersReceived.entries()) {
      // Note: There is no transferId, so we have to match on other fields
      if (
        l1ToL2TransferSent.recipient === l1ToL2TransferReceived.recipient &&
        l1ToL2TransferSent.amount === l1ToL2TransferReceived.amount &&
        l1ToL2TransferSent.amountOutMin === l1ToL2TransferReceived.amountOutMin &&
        l1ToL2TransferSent.deadline === l1ToL2TransferReceived.deadline
      ) {
        if (seenIndexes.includes(index)) {
          continue
        }

        isSeen = true
        seenIndexes.push(index)
        break
      }
    }

    if (isSeen) continue

    inFlightL1ToL2Transfers = inFlightL1ToL2Transfers.add(l1ToL2TransferSent.amount)
  }

  return inFlightL1ToL2Transfers
}