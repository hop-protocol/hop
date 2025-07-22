import { Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface ClaimReadded {
  claimId: string
}

export type ClaimReaddedIndexes = {
  claimId?: string
}

export class ClaimReaddedEventFetcher extends Event<ClaimReadded> {
  override eventName = 'ClaimReadded'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getFilterWithIndexes ({ claimId } : ClaimReaddedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimReadded(claimId ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimReadded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const claimId = parsed.args.claimId.toString()

    return {
      claimId
    }
  }
}
