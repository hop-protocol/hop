import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface PathInitialized {
  pathId: string
  token: string
  counterpartChainId: BigNumber
  counterpartToken: string
  initialReserve: BigNumber
  path: string
}

export type PathInitializedIndexes = {
  pathId?: string
  token?: string
  path?: string
}

export class PathInitializedEventFetcher extends Event<PathInitialized> {
  override eventName = 'PathInitialized'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getTokenFilter (token: string): EventFilter {
    return this.getFilterWithIndexes({ token })
  }

  getPathFilter (path: string): EventFilter {
    return this.getFilterWithIndexes({ path })
  }

  getFilterWithIndexes ({ pathId, token, path }: PathInitializedIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.PathInitialized(pathId ?? null, token ?? null, null, null, null, path ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): PathInitialized {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const token = parsed.args.token
    const counterpartChainId = parsed.args.counterpartChainId
    const counterpartToken = parsed.args.counterpartToken
    const initialReserve = parsed.args.initialReserve
    const path = parsed.args.path

    return {
      pathId,
      token,
      counterpartChainId,
      counterpartToken,
      initialReserve,
      path
    }
  }
}
