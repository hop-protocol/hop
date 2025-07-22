import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface ClaimPosted {
  claimId: string
  amountOut: BigNumber
}

export type ClaimPostedIndexes = {
  claimId?: string
  amountOut?: BigNumber
}

export class ClaimPostedEventFetcher extends Event<ClaimPosted> {
  override eventName = 'ClaimPosted'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getClaimIdFilter (claimId: string): EventFilter {
    return this.getFilterWithIndexes({ claimId })
  }

  getAmountOutFilter (amountOut: BigNumber): EventFilter {
    return this.getFilterWithIndexes({ amountOut })
  }

  getFilterWithIndexes ({ claimId, amountOut } : ClaimPostedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.ClaimPosted(claimId ?? null, amountOut ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): ClaimPosted {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const claimId = parsed.args.claimId.toString()
    const amountOut = parsed.args.amountOut.toString()

    return {
      claimId,
      amountOut
    }
  }
}
