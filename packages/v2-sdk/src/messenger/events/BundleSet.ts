import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { ethers, Event as EthersEvent, EventFilter } from 'ethers'

// event from SpokeMessageBridge
export interface BundleSet extends EventBase {
  bundleId: string
  bundleRoot: string
  fromChainId: string
}

export class BundleSetEventFetcher extends Event<BundleSet> {
  override eventName = 'BundleSet'
  override abi = SpokeMessageBridge__factory.abi
  override factory = SpokeMessageBridge__factory

  override toTypedEvent (ethersEvent: EthersEvent): BundleSet {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const bundleId = parsed.args.bundleId.toString()
    const bundleRoot = parsed.args.bundleRoot.toString()
    const fromChainId = parsed.args.fromChainId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      bundleId,
      bundleRoot,
      fromChainId
    }
  }
}
