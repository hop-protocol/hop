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
  override eventName = 'TransferSent'

  override getFilter (): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = railsGateway.filters.TransferSent()
    return filter
  }

  getPathIdFilter (pathId: string): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = railsGateway.filters.TransferSent(pathId)
    return filter
  }

  getTransferIdFilter (transferId: string): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    // TODO: currently transferId is not indexed by contract, so this doesn't work
    const filter = railsGateway.filters.TransferSent(transferId)
    return filter
  }

  getCheckpointFilter (checkpoint: string): EventFilter {
    const railsGateway = RailsGateway__factory.connect(this.address, this.provider)
    const filter = railsGateway.filters.TransferSent(null, null, checkpoint)
    return filter
  }

  override toTypedEvent (ethersEvent: EthersEvent): TransferSent {
    const iface = new ethers.utils.Interface(RailsGateway__factory.abi)
    const decoded = iface.parseLog(ethersEvent)

    const pathId = decoded.args.pathId.toString()
    const transferId = decoded.args.transferId.toString()
    const checkpoint = decoded.args.checkpoint.toString()
    const to = decoded.args.to
    const amount = decoded.args.amount
    const attestationFee = decoded.args.attestationFee
    const totalSent = decoded.args.totalSent
    const nonce = decoded.args.nonce
    const attestedCheckpoint = decoded.args.attestedCheckpoint.toString()

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
