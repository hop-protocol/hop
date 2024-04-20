import { BigNumber, ethers } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface TransferSent extends EventBase {
  transferId: string
  pathId: string
  to: string
  amount: BigNumber
  minAmountOut: BigNumber
  totalSent: BigNumber
}

export class TransferSentEventFetcher extends Event<TransferSent> {
  override eventName = 'TransferSent'

  getFilter () {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    // TODO: remove 'as any' once event is added to contract
    const filter = (railsGateway.filters as any).TransferSent()
    return filter
  }

  getTransferIdFilter (transferId: string) {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = (railsGateway.filters as any).TransferSent(transferId)
    return filter
  }

  getPathIdFilter (pathId: string) {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = (railsGateway.filters as any).TransferSent(pathId)
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<TransferSent[]> {
    const filter = this.getFilter()
    return this.getEventsWithFilter(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): TransferSent {
    const iface = new ethers.utils.Interface(RailsGateway__factory.abi)
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
