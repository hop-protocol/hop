import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { ethers, Event as EthersEvent, EventFilter } from 'ethers'

// event from SpokeMessageBridge (ICrossChainSource)
export interface MessageSent extends EventBase {
  messageId: string
  from: string
  toChainId: string
  to: string
  data: string
}

export class MessageSentEventFetcher extends Event<MessageSent> {
  static override eventName = 'MessageSent'
  static override abi = SpokeMessageBridge__factory.abi
  static override factory = SpokeMessageBridge__factory

  getMessageIdFilter (messageId: string): EventFilter {
    const spokeMessageBridge = this.getContract()
    const filter = spokeMessageBridge.filters.MessageSent(messageId)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): MessageSent {
    const parsed = this.parseEthersEventLog<MessageSent>(ethersEvent)

    const messageId = parsed.args.messageId.toString()
    const from = parsed.args.from
    const toChainId = parsed.args.toChainId.toString()
    const to = parsed.args.to
    const data = parsed.args.data

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      messageId,
      from,
      toChainId,
      to,
      data
    }
  }
}
