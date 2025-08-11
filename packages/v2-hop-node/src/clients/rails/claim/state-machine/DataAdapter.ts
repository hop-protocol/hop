import { DataAdapter } from '#state-machine/index.js'
import {
  type IRailsClaim,
  type ISentRailsClaim,
  type IPostedRailsClaim,
  RailsClaimEventName,
  RailsClaimState
} from './types.js'
import type { DecodedLogWithContext, EventContext } from '#types/index.js'
import { getPath } from '@hop-protocol/v2-sdk'

export class RailsClaimDataAdapter extends DataAdapter<RailsClaimState, IRailsClaim, RailsEventName> {

  protected isValidEventName(eventName: RailsEventName | string): eventName is RailsEventName {
    return Object.values(RailsClaimEventName).includes(eventName as RailsClaimEventName)
  }

  protected override formatDecodedLog (log: DecodedLogWithContext): IRailsClaim {
    const { eventName } = log.context
    switch (eventName) {
      case RailsEventName.TransferSent:
        return this.#formatTransferSentLog(log as DecodedLogWithContext<TransferSent>) as IRailsClaim
      case RailsEventName.ClaimPosted:
        return this.#formatClaimPostedLog(log as DecodedLogWithContext<ClaimPosted>) as IRailsClaim
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override getStateFromEventName (eventName: string): RailsClaimState {
    switch (eventName) {
      case RailsEventName.TransferSent:
        return RailsClaimState.Sent
      case RailsEventName.ClaimPosted:
        return RailsClaimState.Posted
      default:
        throw new Error(`Invalid event name: ${eventName}`)
    }
  }

  protected override async getEventContextFromState (state: RailsClaimState, value: IRailsClaim): Promise<EventContext<RailsEventName>> {
    const { pathId, txContext } = value
    const { chainId } = txContext
    const counterpartChainId = getPath(pathId).getCounterpartChain(chainId).chainId

    switch (state) {
      case RailsClaimState.Sent: {
        const eventAddress = await getRailsPathAddress(pathId, chainId)
        return {
          eventChainId: chainId,
          eventAddress,
          eventName: RailsEventName.TransferSent
        }
      }
      case RailsClaimState.Posted: {
        const eventAddress = await getRailsPathAddress(pathId, counterpartChainId)
        return {
          eventChainId: counterpartChainId,
          eventAddress,
          eventName: RailsEventName.ClaimPosted
        }
      }
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * Internal
   */

  #formatTransferSentLog (log: DecodedLogWithContext<TransferSent>): Omit<ISentRailsClaim, 'txContext'> {
    const { decoded, address, context } = log
    const { chainId } = context
    const { transferId, to, amount, sourcePool, sourceTotalFraudulent, hops } = decoded

    if (
      hops.length === 0 ||
      typeof hops?.[0] === 'undefined'
    ) {
      throw new Error('Invalid hops')
    }

    // TODO: is this supposed to be hops[0]?
    const { maxBonderFee, attestedClaimId } = hops[0]
    const nextHopsHash = getNextHopsHash(hops)
    const pathId = RailsGateway.getPathCache(chainId, address)

    return {
      pathId,
      claimId: transferId,
      to,
      amount,
      sourcePool,
      sourceTotalFraudulent,
      hops,
      maxBonderFee,
      attestedClaimId,
      nextHopsHash
    }
  }

  #formatClaimPostedLog(log: DecodedLogWithContext<ClaimPosted>): Omit<IPostedRailsClaim, 'txContext'> {
    const { decoded, address, context } = log
    const { chainId } = context
    const { claimId, amountOut } = decoded
    const pathId = RailsGateway.getPathCache(chainId, address)

    return {
      pathId,
      claimId,
      amountOut
    }
  }

  // #formatClaimRemovedLog(log: DecodedLogWithContext<ClaimRemoved>): Omit<IRemovedRailsClaim, 'txContext'> {
  //   const { decoded } = log
  //   const { pathId, claimId } = decoded

  //   return {
  //     pathId,
  //     claimId
  //   }
  // }

  // #formatClaimReaddedLog(log: DecodedLogWithContext<ClaimReadded>): Omit<IReaddedRailsClaim, 'txContext'> {
  //   const { decoded } = log
  //   const { pathId, claimId } = decoded

  //   return {
  //     pathId,
  //     claimId
  //   }
  // }
}
