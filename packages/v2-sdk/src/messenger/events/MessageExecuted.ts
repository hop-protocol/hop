import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { ethers, Event as EthersEvent } from 'ethers'

// event from SpokeMessageBridge (MessageExecutor.sol)
export interface MessageExecuted extends EventBase {
  messageId: string
  fromChainId: string
}

export class MessageExecutedEventFetcher extends Event<MessageExecuted> {
  override eventName = 'MessageExecuted'

  override getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageExecuted()
    return filter
  }

  getMessageIdFilter (messageId: string) {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    // TODO: after it's indexed in contract
    // const filter = spokeMessageBridge.filters.MessageExecuted(messageId)
    const filter = spokeMessageBridge.filters.MessageExecuted()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): MessageExecuted {
    const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const messageId = decoded.args.messageId.toString()
    const fromChainId = decoded.args.fromChainId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      messageId,
      fromChainId
    }
  }
}
