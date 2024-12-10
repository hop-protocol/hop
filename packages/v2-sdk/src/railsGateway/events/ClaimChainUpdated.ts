import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface ClaimChainUpdated {
  pathId: string
  headClaimId: string
  length: BigNumber
}

export type ClaimChainUpdatedIndexes = {
  pathId?: string
  claimId?: string
}

export class ClaimChainUpdatedEventFetcher extends Event<ClaimChainUpdated> {
  override eventName = 'ClaimChainUpdated'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getFilterWithIndexes ({ pathId, claimId } : ClaimChainUpdatedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimChainUpdated(pathId ?? null, claimId ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimChainUpdated {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const headClaimId = parsed.args.headClaimId.toString()
    const length = parsed.args.length.toString()

    return {
      pathId,
      headClaimId,
      length
    }
  }
}
