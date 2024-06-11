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
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferBonded(pathId)
    return filter
  }

  getTransferIdFilter (transferId: string): EventFilter {
    const railsGateway = this.getContract()
    // TODO: currently transferId is not indexed by contract, so this doesn't work
    const filter = railsGateway.filters.TransferBonded(transferId)
    return filter
  }

  getCheckpointFilter (checkpoint: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferBonded(null, null, checkpoint)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferBonded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const transferId = parsed.args.transferId.toString()
    const checkpoint = parsed.args.checkpoint.toString()
    const to = parsed.args.to
    const amountOut = parsed.args.amountOut
    const totalSent = parsed.args.totalSent

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
