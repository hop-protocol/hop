import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface ClaimWithdrawn {
  claimId: string
  amount: BigNumber
}

export type ClaimWithdrawnIndexes = {
  claimId?: string
  amount?: BigNumber
}

export class ClaimWithdrawnEventFetcher extends Event<ClaimWithdrawn> {
  override eventName = 'ClaimWithdrawn'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getAmountFilter (amount: BigNumber): EventFilter {
    return this.getFilterWithIndexes({ amount })
  }

  getFilterWithIndexes ({ claimId, amount } : ClaimWithdrawnIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimWithdrawn(claimId ?? null, amount ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimWithdrawn {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const claimId = parsed.args.claimId.toString()
    const amount = parsed.args.amount.toString()

    return {
      claimId,
      amount
    }
  }
}
