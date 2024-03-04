import RailsHubAbi from '../../config/abi/generated/RailsHub.json' assert { type: "json" }
import { BigNumber, ethers } from 'ethers'
import { Event } from '../Event.js'
import { EventBase } from '../types.js'
import { RailsHub__factory } from '../../config/contracts/factories/generated/RailsHub__factory.js'

// event from RailsHub
export interface TransferSent extends EventBase {
  transferId: string
  pathId: string
  to: string
  amount: BigNumber
  minAmountOut: BigNumber
  totalSent: BigNumber
}

export class TransferSentEventFetcher extends Event {
  override eventName = 'TransferSent'

  getFilter () {
    const railsHub = RailsHub__factory.connect(this.address, this.provider)
    const filter = railsHub.filters.TransferSent()
    return filter
  }

  getTransferIdFilter (transferId: string) {
    const railsHub = RailsHub__factory.connect(this.address, this.provider)
    const filter = railsHub.filters.TransferSent(transferId)
    return filter
  }

  getPathIdFilter (pathId: string) {
    const railsHub = RailsHub__factory.connect(this.address, this.provider)
    const filter = railsHub.filters.TransferSent(pathId)
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<TransferSent[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): TransferSent {
    const iface = new ethers.utils.Interface(RailsHubAbi)
    const decoded = iface.parseLog(ethersEvent)

    const transferId = decoded.args.transferId.toString()
    const pathId = decoded.args.pathId.toString()
    const to = decoded.args.to
    const amount = decoded.args.amount
    const minAmountOut = decoded.args.minAmountOut
    const totalSent = decoded.args.totalSent

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      transferId,
      pathId,
      to,
      amount,
      minAmountOut,
      totalSent
    }
  }
}
