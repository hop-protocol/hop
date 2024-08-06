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
  nonce: BigNumber
  previousTransferId: string
  attestedCheckpoint: string
}

export class TransferSentEventFetcher extends Event<TransferSent> {
  override eventName = 'TransferSent'
  override abi = RailsGateway__factory.abi
  override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferSent(pathId)
    return filter
  }

  getTransferIdFilter (transferId: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferSent(transferId)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferSent {
    const parsed = this.parseEthersEventLog(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const transferId = parsed.args.transferId.toString()
    const to = parsed.args.to
    const amount = parsed.args.amount
    const totalSent = parsed.args.totalSent
    const nonce = parsed.args.nonce
    const previousTransferId = parsed.args.previousTransferId.toString()
    const attestedCheckpoint = parsed.args.attestedCheckpoint.toString()

    return {
      pathId,
      transferId,
      to,
      amount,
      totalSent,
      nonce,
      previousTransferId,
      attestedCheckpoint
    }
  }
}
