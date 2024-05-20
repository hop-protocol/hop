import find from 'lodash/find'
import isBoolean from 'lodash/isBoolean'
import { BigNumber, BigNumberish, Event, providers, utils } from 'ethers'
import { EventNames } from 'src/utils/constants'
import { eventTopics } from '@hop-protocol/sdk'
import { isSameAddress } from './addresses'

// Convert BNs, booleans -> strings
function parseString(name: string, argValue: any) {
  if (BigNumber.isBigNumber(argValue) || isBoolean(argValue)) {
    return argValue.toString()
  }

  return argValue
}

// List of Wei args to convert (to Eth)
export const weiArgsToConvert = ['amount', 'amountOutMin', 'bonderFee', 'destinationAmountOutMin']

export function formatArgValues(arg, value) {
  // Convert to string
  value = parseString(arg, value)

  // Convert Wei -> Eth
  // if (weiArgsToConvert.includes(arg)) {
  //   value = utils.formatUnits(value)
  // }

  return value
}

// Filter and format event args
export function formatLogArgs(args): any {
  const formatted = Object.keys(args).reduce((acc, arg) => {
    // Filter numerical keys
    if (Number.isInteger(parseInt(arg)) || arg === 'log') {
      return acc
    }

    // Format all event args -> string
    const argValue = formatArgValues(arg, args[arg])

    return {
      ...acc,
      [arg]: argValue,
    }
  }, {})
  return formatted
}

export function getLastLog(logs: any[]) {
  if (logs.length > 0) {
    return logs[logs.length - 1]
  }
}

export function findTransferSentLog(logs: providers.Log[]) {
  return find(logs, log => log.topics[0] === eventTopics.transferSentTopic)
}

export function findTransferFromL1CompletedLog(
  logs: Event[],
  recipient: string,
  amount: BigNumberish,
  deadline: BigNumberish
) {
  return find<Event>(
    logs,
    (log: Event) =>
      log.topics[0] === eventTopics.transferFromL1CompletedTopic &&
      isSameAddress(log.args?.recipient, recipient) &&
      log.args?.amount?.eq(amount) &&
      log.args?.deadline?.eq(deadline)
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
