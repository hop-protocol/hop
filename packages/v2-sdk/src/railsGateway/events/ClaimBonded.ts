import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface ClaimBonded {
  claimId: string
  to: string
  amount: BigNumber
  bonderFee: BigNumber
}

export type ClaimBondedIndexes = {
  claimId?: string
  to?: string
  amount?: BigNumber
}

export class ClaimBondedEventFetcher extends Event<ClaimBonded> {
  override eventName = 'ClaimBonded'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getToFilter (to: string): EventFilter {
    return this.getFilterWithIndexes({ to })
  }

  getAmountFilter (amount: BigNumber): EventFilter {
    return this.getFilterWithIndexes({ amount })
  }

  getFilterWithIndexes ({ claimId, to, amount } : ClaimBondedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimBonded(claimId ?? null, to ?? null, amount ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimBonded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const claimId = parsed.args.claimId.toString()
    const to = parsed.args.to
    const amount = parsed.args.amount
    const bonderFee = parsed.args.bonderFee

    return {
      claimId,
      to,
      amount,
      bonderFee
    }
  }
}
