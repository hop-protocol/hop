import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { ethers } from 'ethers'

// event from SpokeMessageBridge (ICrossChainSource)
export interface MessageSent extends EventBase {
  messageId: string
  from: string
  toChainId: string
  to: string
  data: string
}

export class MessageSentEventFetcher extends Event<MessageSent> {
  override eventName = 'MessageSent'

  override getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageSent()
    return filter
  }

  getMessageIdFilter (messageId: string) {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageSent(messageId)
    return filter
  }

  override toTypedEvent (ethersEvent: any): MessageSent {
    const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const messageId = decoded.args.messageId.toString()
    const from = decoded.args.from
    const toChainId = decoded.args.toChainId.toString()
    const to = decoded.args.to
    const data = decoded.args.data

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
