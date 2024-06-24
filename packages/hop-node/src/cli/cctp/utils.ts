import { StateMachineDB } from '../../cctp/db/StateMachineDB.js'
import { MessageSDK } from '../../../src/cctp/cctp/sdk/MessageSDK.js'
import { MessageState, type ISentMessage } from '../../../src/cctp/cctp/types.js'

export async function getUnrelayedMessages (): Promise<ISentMessage[]> {
  const dbName = 'Message'
  const db = new StateMachineDB(dbName)

  // Retrieve all messages
  let unrelayedMessages: ISentMessage[] = []
  for await (const [, value] of db.getItemsInState(MessageState.Sent)) {
    unrelayedMessages.push(value as ISentMessage)
  }

  // Only return messages that have been unrelayed for long enough for the attestations to be available
  let unrelayedMessagesFiltered: ISentMessage[] = []
  for (const message of unrelayedMessages) {
    const { sourceChainId, sentTimestampMs } = message
    const attestationWaitTimeMs = MessageSDK.attestationAvailableTimestampMs(sourceChainId)
    if (sentTimestampMs + attestationWaitTimeMs < Date.now()) {
      unrelayedMessagesFiltered.push(message)
    }
  }

  return unrelayedMessagesFiltered
}
