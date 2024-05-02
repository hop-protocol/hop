import { BigNumber, ethers } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'

// event from SpokeMessageBridge
export interface FeesSentToHub extends EventBase {
  amount: BigNumber
}

export class FeesSentToHubEventFetcher extends Event<FeesSentToHub> {
  override eventName = 'FeesSentToHub'

  override getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.FeesSentToHub()
    return filter
  }

  override toTypedEvent (ethersEvent: any): FeesSentToHub {
    const iface = new ethers.utils.Interface(SpokeMessageBridge__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const amount = decoded.args.amount

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      amount
    }
  }
}
