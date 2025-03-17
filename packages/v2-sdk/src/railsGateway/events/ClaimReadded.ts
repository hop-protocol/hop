import { Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface ClaimReadded {
  pathId: string
  claimId: string
}

export type ClaimReaddedIndexes = {
  pathId?: string
  claimId?: string
}

export class ClaimReaddedEventFetcher extends Event<ClaimReadded> {
  override eventName = 'ClaimReadded'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getFilterWithIndexes ({ pathId, claimId } : ClaimReaddedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimReadded(pathId ?? null, claimId ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimReadded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const claimId = parsed.args.claimId.toString()

    return {
      pathId,
      claimId
    }
  }
}
