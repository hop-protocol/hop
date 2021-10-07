import { BigNumber, utils } from 'ethers'
import find from 'lodash/find'
import { eventTopics } from '@hop-protocol/sdk'
import { EventNames } from 'src/constants'

export function findTransferSentLog(logs) {
  const tsLog = find(logs, log => log.topics[0] === eventTopics.transferSentTopic)
  return tsLog
}

export function getTransferSentDetailsFromLogs(logs) {
  const log = findTransferSentLog(logs)

  if (!log) {
    return
  }

  const [topic, transferId, chainId, recipient] = log.topics

  return {
    eventName: EventNames.TransferSent,
    topic,
    transferId,
    chainId: BigNumber.from(chainId).toString(),
    recipient: utils.hexStripZeros(recipient),
  }
}

export function findMatchingTransferIdEvent(events, transferId) {
  const matchingEvent = find(events, ['args.transferId', transferId])
  return matchingEvent
}
