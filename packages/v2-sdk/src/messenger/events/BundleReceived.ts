import { BigNumber, Event as EthersEvent } from 'ethers'
import { Event } from '#events/index.js'
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js'

// event from HubMessageBridge
export interface BundleReceived {
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
  override abi = HubMessageBridge__factory.abi
  override factory = HubMessageBridge__factory

  override toTypedEvent (ethersEvent: EthersEvent): BundleReceived {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const bundleId = parsed.args.bundleId.toString()
    const bundleRoot = parsed.args.bundleRoot.toString()
    const bundleFees = parsed.args.bundleFees
    const fromChainId = parsed.args.fromChainId.toString()
    const toChainId = parsed.args.toChainId.toString()
    const relayWindowStart = Number(parsed.args.relayWindowStart.toString())
    const relayer = parsed.args.relayer.toString()

    return {
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
