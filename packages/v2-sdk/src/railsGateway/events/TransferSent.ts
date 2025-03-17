import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'

// event from RailsPath
export interface TransferSent {
  pathId: string
  transferId: string
  to: string
  amount: BigNumber
  sourcePool: BigNumber
  hops: HopStruct[]
}

export interface HopStruct {
  pathId: string
  maxBonderFee: BigNumber
  maxTotalSent: BigNumber
  attestedClaimId: string
}

export type TransferSentIndexes = {
  transferId?: string
  pathId?: string
  to?: string
}

export class TransferSentEventFetcher extends Event<TransferSent> {
  override eventName = 'TransferSent'
  override abi = RailsPath__factory.abi
  override factory = RailsPath__factory

  getPathIdFilter (pathId: string): EventFilter {
    return this.getFilterWithIndexes({ pathId })
  }

  getTransferIdFilter (transferId: string): EventFilter {
    return this.getFilterWithIndexes({ transferId })
  }

  getToFilter (to: string): EventFilter {
    return this.getFilterWithIndexes({ to })
  }

  getFilterWithIndexes ({ pathId, transferId, to } : TransferSentIndexes): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferSent(pathId ?? null, transferId ?? null, to ?? null)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferSent {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const transferId = parsed.args.transferId.toString()
    const to = parsed.args.to
    const amount = parsed.args.amount
    const sourcePool = parsed.args.sourcePool
    const hops = parsed.args.hops.map((hop: any): HopStruct => {
      return {
        pathId: hop.pathId.toString(),
        maxBonderFee: hop.maxBonderFee,
        maxTotalSent: hop.maxTotalSent,
        attestedClaimId: hop.attestedClaimId.toString()
      }
    })

    return {
      pathId,
      transferId,
      to,
      amount,
      sourcePool,
      hops
    }
  }
}
