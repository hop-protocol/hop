import { BigNumber, Event as EthersEvent } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'

// event from SpokeMessageBridge
export interface BundleCommitted extends EventBase {
  bundleId: string
  bundleRoot: string
  bundleFees: BigNumber
  toChainId: string
  commitTime: number
}

export class BundleCommittedEventFetcher extends Event<BundleCommitted> {
  override eventName = 'BundleCommitted'
  override abi = SpokeMessageBridge__factory.abi
  override factory = SpokeMessageBridge__factory

  override toTypedEvent (ethersEvent: EthersEvent): BundleCommitted {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const bundleId = parsed.args.bundleId.toString()
    const bundleRoot = parsed.args.bundleRoot.toString()
    const bundleFees = parsed.args.bundleFees
    const toChainId = parsed.args.toChainId.toString()
    const commitTime = Number(parsed.args.commitTime.toString())

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
