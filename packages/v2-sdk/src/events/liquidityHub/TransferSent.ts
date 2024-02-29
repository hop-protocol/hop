import LiquidityHubAbi from '../../config/abi/generated/LiquidityHub.json' assert { type: "json" }
import { BigNumber, ethers } from 'ethers'
import { Event } from '../Event.js'
import { EventBase } from '../types.js'
import { LiquidityHub__factory } from '../../config/contracts/factories/generated/LiquidityHub__factory'

// event from LiquidityHub
export interface TransferSent extends EventBase {
  claimId: string
  tokenBusId: string
  to: string
  amount: BigNumber
  minAmountOut: BigNumber
  sourceClaimsSent: BigNumber
  bonus: BigNumber
}

export class TransferSentEventFetcher extends Event {
  override eventName = 'TransferSent'

  getFilter () {
    const liquidityHub = LiquidityHub__factory.connect(this.address, this.provider)
    const filter = liquidityHub.filters.TransferSent()
    return filter
  }

  getClaimIdFilter (claimId: string) {
    const liquidityHub = LiquidityHub__factory.connect(this.address, this.provider)
    const filter = liquidityHub.filters.TransferSent(claimId)
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<TransferSent[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): TransferSent {
    const iface = new ethers.utils.Interface(LiquidityHubAbi)
    const decoded = iface.parseLog(ethersEvent)

    const claimId = decoded.args.claimId.toString()
    const tokenBusId = decoded.args.tokenBusId.toString()
    const to = decoded.args.to
    const amount = decoded.args.amount
    const minAmountOut = decoded.args.minAmountOut
    const sourceClaimsSent = decoded.args.sourceClaimsSent
    const bonus = decoded.args.bonus

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      claimId,
      tokenBusId,
      to,
      amount,
      minAmountOut,
      sourceClaimsSent,
      bonus
    }
  }
}
