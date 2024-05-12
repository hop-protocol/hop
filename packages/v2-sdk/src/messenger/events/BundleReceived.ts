import { BigNumber, ethers, Event as EthersEvent } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js'

// event from HubMessageBridge
export interface BundleReceived extends EventBase {
  bundleId: string
  bundleRoot: string
  bundleFees: BigNumber
  fromChainId: string
  toChainId: string
  relayWindowStart: number
  relayer: string
}

export class BundleReceivedEventFetcher extends Event<BundleReceived> {
  override eventName = 'BundleReceived'

  override getFilter () {
    const hubMessageBridge = HubMessageBridge__factory.connect(this.address, this.provider)
    const filter = hubMessageBridge.filters.BundleReceived()
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): BundleReceived {
    const iface = new ethers.utils.Interface(HubMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const bundleId = decoded.args.bundleId.toString()
    const bundleRoot = decoded.args.bundleRoot.toString()
    const bundleFees = decoded.args.bundleFees
    const fromChainId = decoded.args.fromChainId.toString()
    const toChainId = decoded.args.toChainId.toString()
    const relayWindowStart = Number(decoded.args.relayWindowStart.toString())
    const relayer = decoded.args.relayer.toString()

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      bundleId,
      bundleRoot,
      bundleFees,
      fromChainId,
      toChainId,
      relayWindowStart,
      relayer
    }
  }
}
