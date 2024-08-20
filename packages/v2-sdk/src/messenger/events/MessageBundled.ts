import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { Event as EthersEvent, EventFilter } from 'ethers'

// event from SpokeMessageBridge
export interface MessageBundled extends EventBase {
  bundleId: string
  treeIndex: number
  messageId: string
}

export class MessageBundledEventFetcher extends Event<MessageBundled> {
  override eventName = 'MessageBundled'
  override abi = SpokeMessageBridge__factory.abi
  override factory = SpokeMessageBridge__factory

  getBundleIdFilter (bundleId: string): EventFilter {
    const spokeMessageBridge = this.getContract()
    const filter = spokeMessageBridge.filters.MessageBundled(bundleId)
    return filter
  }

  getMessageIdFilter (messageId: string): EventFilter {
    const spokeMessageBridge = this.getContract()
    const filter = spokeMessageBridge.filters.MessageBundled(null, null, messageId)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): MessageBundled {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const bundleId = parsed.args.bundleId.toString()
    const treeIndex = Number(parsed.args.treeIndex.toString())
    const messageId = parsed.args.messageId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      bundleId,
      treeIndex,
      messageId
    }
  }
}
