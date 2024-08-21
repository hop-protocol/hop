import { Event } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { Event as EthersEvent, EventFilter } from 'ethers'

// event from SpokeMessageBridge (MessageExecutor.sol)
export interface MessageExecuted {
  messageId: string
  fromChainId: string
}

export class MessageExecutedEventFetcher extends Event<MessageExecuted> {
  override eventName = 'MessageExecuted'
  override abi = SpokeMessageBridge__factory.abi
  override factory = SpokeMessageBridge__factory

  getMessageIdFilter (messageId: string): EventFilter {
    const spokeMessageBridge = this.getContract()
    // TODO: after it's indexed in contract
    // const filter = spokeMessageBridge.filters.MessageExecuted(messageId)
    const filter = spokeMessageBridge.filters.MessageExecuted()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): MessageExecuted {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const messageId = parsed.args.messageId.toString()
    const fromChainId = parsed.args.fromChainId.toString()

    return {
      messageId,
      fromChainId
    }
  }
}
