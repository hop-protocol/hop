import { BigNumber, ethers } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'

// event from SpokeMessageBridge
export interface FeesSentToHub extends EventBase {
  amount: BigNumber
}

export class FeesSentToHubEventFetcher extends Event {
  override eventName = 'FeesSentToHub'

  getFilter () {
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(this.address, this.provider)
    const filter = spokeMessageBridge.filters.FeesSentToHub()
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<FeesSentToHub[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
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
