import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { StakingRegistry__factory } from '#contracts/factories/StakingRegistry__factory.js'

// event from StakingRegistry
export interface BonderPreference {
  bonder: string
  pathId: string
  feeTier: BigNumber
  liquidity: BigNumber
}

export type BonderPreferenceIndexes = {
  bonder?: string
  pathId?: string
  feeTier?: BigNumber
}

export class BonderPreferenceEventFetcher extends Event<BonderPreference> {
  override eventName = 'BonderPreference'
  override abi = StakingRegistry__factory.abi
  override factory = StakingRegistry__factory

  getBonderFilter (bonder: string): EventFilter {
    return this.getFilterWithIndexes({ bonder })
  }

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getFeeTierFilter (feeTier: BigNumber): EventFilter {
    return this.getFilterWithIndexes({ feeTier })
  }


  getFilterWithIndexes ({ bonder, pathId, feeTier } : BonderPreferenceIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.BonderPreference(bonder ?? null, pathId ?? null, feeTier ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): BonderPreference {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const bonder = parsed.args.bonder.toString()
    const pathId = parsed.args.pathId.toString()
    const feeTier = parsed.args.feeTier
    const liquidity = parsed.args.liquidity

    return {
      bonder,
      pathId,
      feeTier,
      liquidity
    }
  }
}
