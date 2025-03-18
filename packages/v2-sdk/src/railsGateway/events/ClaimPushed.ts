import { Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface ClaimPushed {
  pathId: string
  claimId: string
}

export type ClaimPushedIndexes = {
  pathId?: string
  claimId?: string
}

export class ClaimPushedEventFetcher extends Event<ClaimPushed> {
  override eventName = 'ClaimPushed'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getFilterWithIndexes ({ pathId, claimId } : ClaimPushedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimPushed(pathId ?? null, claimId ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimPushed {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const claimId = parsed.args.claimId.toString()

    return {
      pathId,
      claimId
    }
  }
}
