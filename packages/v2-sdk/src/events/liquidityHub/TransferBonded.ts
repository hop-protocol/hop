import LiquidityHubAbi from '../../config/abi/generated/LiquidityHub.json' assert { type: "json" }
import { BigNumber, ethers } from 'ethers'
import { Event } from '../Event.js'
import { EventBase } from '../types.js'
import { LiquidityHub__factory } from '../../config/contracts/factories/generated/LiquidityHub__factory.js'

// event from LiquidityHub
export interface TransferBonded extends EventBase {
  claimId: string
  tokenBusId: string
  to: string
  amount: BigNumber
  minAmountOut: BigNumber
  sourceClaimsSent: BigNumber
  fee: BigNumber
}

export class TransferBondedEventFetcher extends Event {
  override eventName = 'TransferBonded'

  getFilter () {
    const liquidityHub = LiquidityHub__factory.connect(this.address, this.provider)
    const filter = liquidityHub.filters.TransferBonded()
    return filter
  }

  getClaimIdFilter (claimId: string) {
    const liquidityHub = LiquidityHub__factory.connect(this.address, this.provider)
    const filter = liquidityHub.filters.TransferBonded(claimId)
    return filter
  }

  async getEvents (startBlock: number, endBlock: number): Promise<TransferBonded[]> {
    const filter = this.getFilter()
    return this._getEvents(filter, startBlock, endBlock)
  }

  override toTypedEvent (ethersEvent: any): TransferBonded {
    const iface = new ethers.utils.Interface(LiquidityHubAbi)
    const decoded = iface.parseLog(ethersEvent)

    const claimId = decoded.args.claimId.toString()
    const tokenBusId = decoded.args.tokenBusId.toString()
    const to = decoded.args.to
    const amount = decoded.args.amount
    const minAmountOut = decoded.args.minAmountOut
    const sourceClaimsSent = decoded.args.sourceClaimsSent
    const fee = decoded.args.fee

    return {
      eventName: this.eventName,
      eventLog: ethersEvent,
      claimId,
      tokenBusId,
      to,
      amount,
      minAmountOut,
      sourceClaimsSent,
      fee
    }
  }
}
