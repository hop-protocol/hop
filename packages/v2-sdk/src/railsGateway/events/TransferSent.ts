import { BigNumber, ethers, Event as EthersEvent, EventFilter } from 'ethers'
import { Event, EventBase } from '#events/index.js'
import { RailsGateway__factory } from '#contracts/factories/RailsGateway__factory.js'

// event from RailsGateway
export interface TransferSent {
  pathId: string
  transferId: string
  checkpoint: string
  to: string
  amount: BigNumber
  attestationFee: BigNumber
  totalSent: BigNumber
  nonce: BigNumber
  attestedCheckpoint: string
}

export class TransferSentEventFetcher extends Event<TransferSent> {
  static override eventName = 'TransferSent'
  static override abi = RailsGateway__factory.abi
  static override factory = RailsGateway__factory

  getPathIdFilter (pathId: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferSent(pathId)
    return filter
  }

  getTransferIdFilter (transferId: string): EventFilter {
    const railsGateway = this.getContract()
    // TODO: currently transferId is not indexed by contract, so this doesn't work
    const filter = railsGateway.filters.TransferSent(transferId)
    return filter
  }

  getCheckpointFilter (checkpoint: string): EventFilter {
    const railsGateway = this.getContract()
    const filter = railsGateway.filters.TransferSent(null, null, checkpoint)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferSent {
    const parsed = this.parseEthersEventLog<TransferSent>(ethersEvent)

    const pathId = parsed.args.pathId.toString()
    const transferId = parsed.args.transferId.toString()
    const checkpoint = parsed.args.checkpoint.toString()
    const to = parsed.args.to
    const amount = parsed.args.amount
    const attestationFee = parsed.args.attestationFee
    const totalSent = parsed.args.totalSent
    const nonce = parsed.args.nonce
    const attestedCheckpoint = parsed.args.attestedCheckpoint.toString()

    return {
      pathId,
      transferId,
      checkpoint,
      to,
      amount,
      attestationFee,
      totalSent,
      nonce,
      attestedCheckpoint
    }
  }
}
