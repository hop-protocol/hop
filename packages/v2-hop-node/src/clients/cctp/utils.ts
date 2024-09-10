import { StateMachineDB } from '#state-machine/StateMachineDB.js'
import { CCTPSDK } from './sdk/CCTPSDK.js'
import {
  CCTPMessageState,
  type ISentCCTPMessage
} from './state-machine/types.js'

export async function getUnrelayedMessages (): Promise<ISentCCTPMessage[]> {
  const dbName = 'cctp'
  const db = new StateMachineDB(dbName)

  // Retrieve all messages
  const unrelayedMessages: ISentCCTPMessage[] = []
  for await (const [, value] of db.getItemsInState(CCTPMessageState.Sent)) {
    unrelayedMessages.push(value as ISentCCTPMessage)
  }

  // Only return messages that have been unrelayed for long enough for the attestations to be available
  const unrelayedMessagesFiltered: ISentCCTPMessage[] = []
  for (const message of unrelayedMessages) {
    const { sourceChainId, txContext } = message
    const attestationWaitTimeMs = CCTPSDK.attestationAvailableTimestampMs(sourceChainId)
    if (txContext.timestampMs + attestationWaitTimeMs < Date.now()) {
      unrelayedMessagesFiltered.push(message)
    }
  }

  return unrelayedMessagesFiltered
}
