import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { ethers } from 'ethers'

// event from SpokeMessageBridge
export interface MessageBundled extends EventBase {
  bundleId: string
  treeIndex: number
  messageId: string
}

export class MessageBundledEventFetcher extends Event {
  override eventName = 'MessageBundled'

  getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageBundled()
    return filter
  }

  getBundleIdFilter (bundleId: string) {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageBundled(bundleId)
    return filter
  }

  getMessageIdFilter (messageId: string) {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.MessageBundled(null, null, messageId)
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<MessageBundled[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): MessageBundled {
    const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const bundleId = decoded.args.bundleId.toString()
    const treeIndex = Number(decoded.args.treeIndex.toString())
    const messageId = decoded.args.messageId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      bundleId,
      treeIndex,
      messageId
    }
  }
}
