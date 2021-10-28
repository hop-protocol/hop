import { BigNumber, BigNumberish, utils, Event, providers } from 'ethers'
import find from 'lodash/find'
import { eventTopics } from '@hop-protocol/sdk'
import { EventNames } from 'src/constants'
import { isSameAddress } from './addresses'

export function findTransferSentLog(logs: providers.Log[]) {
  return find(logs, log => log.topics[0] === eventTopics.transferSentTopic)
}

export function findTransferFromL1CompletedLog(
  logs: Event[],
  amount: BigNumberish,
  recipient: string
) {
  return find<Event>(
    logs,
    (log: Event) =>
      log.topics[0] === eventTopics.transferFromL1CompletedTopic &&
      log.args?.amount.eq(amount) &&
      isSameAddress(log.args?.recipient, recipient)
  )
}

export function findTransferSentToL2Log(logs: providers.Log[]) {
  return find(logs, log => log.topics[0] === eventTopics.transferSentToL2Topic)
}

export function getTransferSentDetailsFromLogs(logs: providers.Log[]) {
  const sentLog = findTransferSentLog(logs)
  const sentToL2Log = findTransferSentToL2Log(logs)

  if (!sentLog && !sentToL2Log) {
    return
  }

  if (sentLog) {
    const [topic, transferId, chainId, recipient] = sentLog.topics

    return {
      eventName: EventNames.TransferSent,
      topic,
      transferId,
      chainId: BigNumber.from(chainId).toString(),
      recipient: utils.hexStripZeros(recipient),
      txHash: sentLog.transactionHash,
      log: sentLog,
    }
  }

  if (sentToL2Log) {
    const [topic, chainId, recipient, relayer] = sentToL2Log.topics

    return {
      eventName: EventNames.TransferSentToL2,
      topic,
      chainId: BigNumber.from(chainId).toString(),
      recipient: utils.hexStripZeros(recipient),
      relayer,
      txHash: sentToL2Log.transactionHash,
      log: sentToL2Log,
    }
  }
}

export function findMatchingTransferIdEvent(events, transferId) {
  const matchingEvent = find(events, ['args.transferId', transferId])
  return matchingEvent
}
