import { BigNumber } from 'ethers'
import { Chain } from 'src/constants'

import getTransferSentToL2 from 'src/theGraph/getTransferSentToL2'
import getTransferFromL1Completed from 'src/theGraph/getTransferFromL1Completed'

export async function getUnrelayedL1ToL2Transfers (
  token: string,
  chain: string,
  startTimestamp: number,
  endTimestamp: number,
  shouldIncludeInFlightTransfers: boolean = false
): Promise<BigNumber> {
  // Note: shouldIncludeInFlightTransfers represents transfers that have been sent in the last 30 minutes and
  // might not have yet been relayed. If this is false, then we will adjust the endTimestamp to ignore transfers
  // that have been sent 30 minutes prior to the endTimestamp of when transfers were sent from L1 as if to ignore
  // these transfers, since we are then only looking for unrelayed transfers in the past.

  const l1ToL2TransfersReceived = await getTransferFromL1Completed(chain, token, startTimestamp, endTimestamp)

  // Ignore transfers sent in the last 30 minutes, since they might not have been relayed yet
  if (!shouldIncludeInFlightTransfers) {
    const thirtyMinutesSeconds = 30 * 60
    endTimestamp = endTimestamp - thirtyMinutesSeconds
  }
  const l1ToL2TransfersSent = await getTransferSentToL2(Chain.Ethereum, token, startTimestamp, endTimestamp)

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