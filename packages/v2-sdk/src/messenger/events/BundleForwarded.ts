import { Event, EventBase } from '#events/index.js'
import { ethers, Event as EthersEvent, EventFilter } from 'ethers'
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js'

// event from HubMessageBridge
export interface BundleForwarded extends EventBase {
  bundleId: string
  bundleRoot: string
  fromChainId: string
  toChainId: string
}

export class BundleForwardedEventFetcher extends Event<BundleForwarded> {
  override eventName = 'BundleForwarded'

  override getFilter (): EventFilter {
    const hubMessageBridge = HubMessageBridge__factory.connect(this.address, this.provider)
    const filter = hubMessageBridge.filters.BundleForwarded()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): BundleForwarded {
    const iface = new ethers.utils.Interface(HubMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const bundleId = decoded.args.bundleId.toString()
    const bundleRoot = decoded.args.bundleRoot.toString()
    const fromChainId = decoded.args.fromChainId.toString()
    const toChainId = decoded.args.toChainId.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      bundleId,
      bundleRoot,
      fromChainId,
      toChainId
    }
  }
}
