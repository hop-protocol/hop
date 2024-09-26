import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface TransferSent {
  pathId: string
  transferId: string
  to: string
  amount: BigNumber
  totalSent: BigNumber
  attestedClaimId: string
  attestedTotalClaims: BigNumber
  nextHops: HopStruct[]
}

export interface HopStruct {
  pathId: string
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
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

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
    const totalSent = parsed.args.totalSent
    const attestedClaimId = parsed.args.attestedClaimId.toString()
    const attestedTotalClaims = parsed.args.attestedTotalClaims.toString()
    const nextHops = parsed.args.nextHops.map((hop: any) => {
      return {
        pathId: hop.pathId.toString(),
        maxTotalSent: hop.maxTotalSent,
        attestedClaimId: hop.attestedClaimId.toString()
      }
    })

    return {
      pathId,
      transferId,
      to,
      amount,
      totalSent,
      attestedClaimId,
      attestedTotalClaims,
      nextHops
    }
  }
}
