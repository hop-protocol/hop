import { BigNumber, Event as EthersEvent, EventFilter } from 'ethers'
import { Event } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface MultiHopTransferBonded {
  pathIds: string[]
  transferId: string
  to: string
  amount: BigNumber
  totalSent: BigNumber
  nonce: BigNumber
  previousTransferId: string
  attestedCheckpoints: string[]
}

export class MultiHopTransferBondedFetcher extends Event<MultiHopTransferBonded> {
  override eventName = 'MultiHopTransferBonded'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getTransferIdFilter (transferId: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.MultiHopTransferBonded(transferId)
    return filter
  }

  getToFilter (to: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.MultiHopTransferBonded(null, to)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): MultiHopTransferBonded {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathIds = parsed.args.pathIds.map((pathId: any) => pathId.toString())
    const transferId = parsed.args.transferId.toString()
    const to = parsed.args.to.toString()
    const amount = parsed.args.amount
    const totalSent = parsed.args.totalSent
    const nonce = parsed.args.nonce
    const previousTransferId = parsed.args.previousTransferId.toString()
    const attestedCheckpoints = parsed.args.attestedCheckpoints.map((attestedCheckpoint: any) => attestedCheckpoint.toString())

    return {
      pathIds,
      transferId,
      to,
      amount,
      totalSent,
      nonce,
      previousTransferId,
      attestedCheckpoints
    }
  }
}
