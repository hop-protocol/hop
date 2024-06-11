import { BigNumber, ethers, Event as EthersEvent, EventFilter } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'

// event from SpokeMessageBridge
export interface FeesSentToHub extends EventBase {
  amount: BigNumber
}

export class FeesSentToHubEventFetcher extends Event<FeesSentToHub> {
  static override eventName = 'FeesSentToHub'
  static override abi = SpokeMessageBridge__factory.abi
  static override factory = SpokeMessageBridge__factory

  override toTypedEvent (ethersEvent: EthersEvent): FeesSentToHub {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const amount = parsed.args.amount

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      amount
    }
  }
}
