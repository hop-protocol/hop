import { BigNumber, ethers } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'

// event from SpokeMessageBridge
export interface BundleCommitted extends EventBase {
  bundleId: string
  bundleRoot: string
  bundleFees: BigNumber
  toChainId: number
  commitTime: number
}

export class BundleCommittedEventFetcher extends Event<BundleCommitted> {
  override eventName = 'BundleCommitted'

  getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.BundleCommitted()
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<BundleCommitted[]> {
    const filter = this.getFilter()
    return this.getEventsWithFilter(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): BundleCommitted {
    const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const bundleId = decoded.args.bundleId.toString()
    const bundleRoot = decoded.args.bundleRoot.toString()
    const bundleFees = decoded.args.bundleFees
    const toChainId = Number(decoded.args.toChainId.toString())
    const commitTime = Number(decoded.args.commitTime.toString())

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      bundleId,
      bundleRoot,
      bundleFees,
      toChainId,
      commitTime
    }
  }
}
