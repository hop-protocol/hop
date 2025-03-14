import { RailsGateway } from './RailsSDKWrapper.js'
import { RelayerDB } from '#relayer/index.js'
import { ClientName } from '../constants.js'
import { getTxOverrides } from '#utils/getTxOverrides.js'
import { wallets } from '#wallets/index.js'
import type { providers } from 'ethers'
import { type RailsRelayItem, RailsClientName, RailsRelayType } from './types.js'
import { isValidBondTxInputData, isValidPushClaimTxInputData } from './utils.js'

export {
  RailsClientName,
  RailsRelayType,
}

export async function getRelayableItems (relayType: RailsRelayType): Promise<RailsRelayItem[]> {
  const name = ClientName.Rails
  const db = new RelayerDB(name)
  if (!db) {
    throw new Error(`DB not found for client: ${name}`)
  }

  const relayableItems: RailsRelayItem[] = []
  for await (const relayableItem of db.getRelayableItems()) {
    if (
      (relayType === RailsRelayType.Bond && isValidBondTxInputData(relayableItem)) ||
      (relayType === RailsRelayType.PushClaim && isValidPushClaimTxInputData(relayableItem))
    ) {
      relayableItems.push(relayableItem as RailsRelayItem)
    }
  }

  return relayableItems
}

// TODO: This needs to be updated for use elsewhere
export async function relayItem (relayableItem: RailsRelayItem, relayChainId: string): Promise<providers.TransactionResponse> {
  const txOverrides = await getTxOverrides(relayChainId)
  const wallet = wallets.get(relayChainId)
  const gateway = new RailsGateway(relayChainId, wallet)
  if (typeof gateway === 'undefined') {
    throw new Error(`No gateway found for chainId: ${relayChainId}`)
  }

  if (isValidBondTxInputData(relayableItem)) {
    return gateway.bond(relayableItem, txOverrides)
  } else if (isValidPushClaimTxInputData(relayableItem)) {
    return gateway.pushClaim(relayableItem, txOverrides)
  } else {
    throw new Error('Invalid relay item')
  }
}