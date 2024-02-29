import SpokeMessageBridgeAbi from '../../config/abi/generated/SpokeMessageBridge.json' assert { type: "json" }
import { BigNumber, ethers } from 'ethers'
import { Event } from '../Event.js'
import { EventBase } from '../types.js'
import { SpokeMessageBridge__factory } from '../../config/contracts/factories/generated/SpokeMessageBridge__factory'

// event from SpokeMessageBridge
export interface BundleCommitted extends EventBase {
  bundleId: string
  bundleRoot: string
  bundleFees: BigNumber
  toChainId: number
  commitTime: number
}

export class BundleCommittedEventFetcher extends Event {
  override eventName = 'BundleCommitted'

  getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.BundleCommitted()
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<BundleCommitted[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): BundleCommitted {
    const iface = new ethers.utils.Interface(SpokeMessageBridgeAbi)
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
