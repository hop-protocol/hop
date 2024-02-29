import SpokeMessageBridgeAbi from '../../config/abi/generated/SpokeMessageBridge.json' assert { type: "json" }
import { Event } from '../Event.js'
import { EventBase } from '../types.js'
import { SpokeMessageBridge__factory } from '../../config/contracts/factories/generated/SpokeMessageBridge__factory'
import { ethers } from 'ethers'

// event from SpokeMessageBridge (ICrossChainSource)
export interface MessageSent extends EventBase {
  messageId: string
  from: string
  toChainId: number
  to: string
  data: string
}

export class MessageSentEventFetcher extends Event {
  override eventName = 'MessageSent'

  getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageSent()
    return filter
  }

  getMessageIdFilter (messageId: string) {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageSent(messageId)
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<MessageSent[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): MessageSent {
    const iface = new ethers.utils.Interface(SpokeMessageBridgeAbi)
    const decoded = iface.parseLog(ethersEvent)

    const messageId = decoded.args.messageId.toString()
    const from = decoded.args.from
    const toChainId = Number(decoded.args.toChainId.toString())
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
