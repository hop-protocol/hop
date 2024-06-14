import { BigNumber, Event as EthersEvent } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'

// event from SpokeMessageBridge
export interface FeesSentToHub extends EventBase {
  amount: BigNumber
}

export class FeesSentToHubEventFetcher extends Event<FeesSentToHub> {
  override eventName = 'FeesSentToHub'
  override abi = SpokeMessageBridge__factory.abi
  override factory = SpokeMessageBridge__factory

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
