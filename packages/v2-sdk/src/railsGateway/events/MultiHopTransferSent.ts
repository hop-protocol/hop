import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface MultiHopTransferSent {
  transferId: string
  to: string
  amount: BigNumber
  totalSent: BigNumber
  nonce: BigNumber
  previousTransferId: string
  hops: Hop[]
}

export interface Hop {
  pathId: string
  minAmountOut: BigNumber
  attestedCheckpoint: string
}

export class MultiHopTransferSentFetcher extends Event<MultiHopTransferSent> {
  override eventName = 'MultiHopTransferSent'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getTransferIdFilter (transferId: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.MultiHopTransferSent(transferId)
    return filter
  }

  getToFilter (to: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.MultiHopTransferSent(null, to)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): MultiHopTransferSent {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const transferId = parsed.args.transferId.toString()
    const to = parsed.args.to.toString()
    const amount = parsed.args.amount
    const totalSent = parsed.args.totalSent
    const nonce = parsed.args.nonce
    const previousTransferId = parsed.args.previousTransferId.toString()
    const hops = parsed.args.hops.map((hop: any) => {
      return {
        pathId: hop.pathId.toString(),
        minAmountOut: hop.minAmountOut,
        attestedCheckpoint: hop.attestedCheckpoint.toString()
      }
    })

    return {
      transferId,
      to,
      amount,
      totalSent,
      nonce,
      previousTransferId,
      hops
    }
  }
}
