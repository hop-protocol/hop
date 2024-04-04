import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { ethers } from 'ethers'

// event from SpokeMessageBridge
export interface BundleSet extends EventBase {
  bundleId: string
  bundleRoot: string
  fromChainId: number
}

export class BundleSetEventFetcher extends Event {
  override eventName = 'BundleSet'

  getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.BundleSet()
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<BundleSet[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): BundleSet {
    const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const bundleId = decoded.args.bundleId.toString()
    const bundleRoot = decoded.args.bundleRoot.toString()
    const fromChainId = Number(decoded.args.fromChainId.toString())

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      bundleId,
      bundleRoot,
      fromChainId
    }
  }
}
