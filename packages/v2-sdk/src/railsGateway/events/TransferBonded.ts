import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface TransferBonded {
  pathId: string
  claimId: string
  to: string
  amount: BigNumber
  bonderFee: BigNumber
}

export type TransferBondedIndexes = {
  pathId?: string
  claimId?: string
  to?: string
}

export class TransferBondedEventFetcher extends Event<TransferBonded> {
  override eventName = 'TransferBonded'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getToFilter (to: string): EventFilter {
    return this.getFilterWithIndexes({ to })
  }

  getFilterWithIndexes ({ pathId, claimId, to } : TransferBondedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferBonded(pathId ?? null, claimId ?? null, to ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferBonded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const claimId = parsed.args.claimId.toString()
    const to = parsed.args.to
    const amount = parsed.args.amount
    const bonderFee = parsed.args.bonderFee

    return {
      pathId,
      claimId,
      to,
      amount,
      bonderFee
    }
  }
}
