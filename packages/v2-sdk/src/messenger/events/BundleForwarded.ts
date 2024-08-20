import { Event, EventBase } from '#events/index.js'
import { Event as EthersEvent } from 'ethers'
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
  override abi = HubMessageBridge__factory.abi
  override factory = HubMessageBridge__factory

  override toTypedEvent (ethersEvent: EthersEvent): BundleForwarded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const bundleId = parsed.args.bundleId.toString()
    const bundleRoot = parsed.args.bundleRoot.toString()
    const fromChainId = parsed.args.fromChainId.toString()
    const toChainId = parsed.args.toChainId.toString()

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
