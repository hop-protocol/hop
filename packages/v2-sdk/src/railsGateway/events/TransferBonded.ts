import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface TransferBonded {
  pathId: string
  transferId: string
  amount: BigNumber
}

export type TransferBondedIndexes = {
  transferId?: string
  pathId?: string
  to?: string
}

export class TransferBondedEventFetcher extends Event<TransferBonded> {
  override eventName = 'TransferBonded'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getTransferIdFilter (transferId: string): EventFilter {
    return this.getFilterWithIndexes({ transferId })
  }

  getToFilter (to: string): EventFilter {
    return this.getFilterWithIndexes({ to })
  }

  getFilterWithIndexes ({ pathId, transferId, to } : TransferBondedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferBonded(pathId ?? null, transferId ?? null, to ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferBonded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const transferId = parsed.args.transferId.toString()
    const amount = parsed.args.amount

    return {
      pathId,
      transferId,
      amount
    }
  }
}
