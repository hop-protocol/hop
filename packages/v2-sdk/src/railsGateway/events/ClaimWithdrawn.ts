import { Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface ClaimWithdrawn {
  pathId: string
  claimId: string
}

export type ClaimWithdrawnIndexes = {
  pathId?: string
  claimId?: string
}

export class ClaimWithdrawnEventFetcher extends Event<ClaimWithdrawn> {
  override eventName = 'ClaimWithdrawn'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getFilterWithIndexes ({ pathId, claimId } : ClaimWithdrawnIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimWithdrawn(pathId ?? null, claimId ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimWithdrawn {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const claimId = parsed.args.claimId.toString()

    return {
      pathId,
      claimId
    }
  }
}
