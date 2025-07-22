import { Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface ClaimRemoved {
  claimId: string
}

export type ClaimRemovedIndexes = {
  claimId?: string
}

export class ClaimRemovedEventFetcher extends Event<ClaimRemoved> {
  override eventName = 'ClaimRemoved'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getFilterWithIndexes ({ claimId } : ClaimRemovedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimRemoved(claimId ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimRemoved {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const claimId = parsed.args.claimId.toString()

    return {
      claimId
    }
  }
}
