import { BigNumber, ethers, Event as EthersEvent, EventFilter } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface TransferBonded extends EventBase {
  pathId: string
  transferId: string
  checkpoint: string
  to: string
  amountOut: BigNumber
  totalSent: BigNumber
}

export class TransferBondedEventFetcher extends Event<TransferBonded> {
  override eventName = 'TransferBonded'

  override getFilter (): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = railsGateway.filters.TransferBonded()
    return filter
  }

  getPathIdFilter (pathId: string): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = railsGateway.filters.TransferBonded(pathId)
    return filter
  }

  getTransferIdFilter (transferId: string): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    // TODO: currently transferId is not indexed by contract, so this doesn't work
    const filter = railsGateway.filters.TransferBonded(transferId)
    return filter
  }

  getCheckpointFilter (checkpoint: string): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = railsGateway.filters.TransferBonded(null, null, checkpoint)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferBonded {
    const iface = new ethers.utils.Interface(RailsGateway__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const pathId = decoded.args.pathId.toString()
    const transferId = decoded.args.transferId.toString()
    const checkpoint = decoded.args.checkpoint.toString()
    const to = decoded.args.to
    const amountOut = decoded.args.amountOut
    const totalSent = decoded.args.totalSent

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      pathId,
      transferId,
      checkpoint,
      to,
      amountOut,
      totalSent
    }
  }
}
