import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface TransferBonded extends EventBase {
  pathId: string
  transferId: string
  to: string
  amount: BigNumber
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

  override toTypedEvent (ethersEvent: EthersEvent): TransferBonded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const transferId = parsed.args.transferId.toString()
    const to = parsed.args.to
    const amount = parsed.args.amount

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      pathId,
      transferId,
      to,
      amount
    }
  }
}
