import { RailsRelayer } from './RailsRelayer.js'
import { RelayerDB } from '#relayer/index.js'
import { ClientName } from '../constants.js'
import type { providers } from 'ethers'
import { type RailsRelayItem, type RailsPath, RailsClientName } from './types.js'
import { getPathFromPathId, isValidBondTxInputData, isValidPushClaimTxInputData } from './utils.js'
import { RailsMethodName } from './RailsSDKWrapper.js'

export {
  RailsClientName,
  RailsMethodName
}

export async function getRelayableItems (methodName: RailsMethodName): Promise<RailsRelayItem[]> {
  const name = ClientName.Rails
  const db = getRelayerDB(name)

  const relayableItems: RailsRelayItem[] = []
  for await (const relayableItem of db.getRelayableItems()) {
    if (
      (methodName === RailsMethodName.Bond && isValidBondTxInputData(relayableItem)) ||
      (methodName === RailsMethodName.PushClaim && isValidPushClaimTxInputData(relayableItem))
    ) {
      relayableItems.push(relayableItem)
    }
  }

  return relayableItems
}

export async function relayItem (relayItem: RailsRelayItem): Promise<providers.TransactionResponse> {
  const name = ClientName.Rails
  const db = getRelayerDB(name)

  const { relayChainId, relayTxMethodName } = await db.getTxContextByRelayItemKey(relayItem.pathId)

  const path: RailsPath = getPathFromPathId(relayItem.pathId)
  const relayer = new RailsRelayer(name, [path])
  return relayer.sendRelay(relayItem, relayTxMethodName, relayChainId)
}

function getRelayerDB (name: ClientName): RelayerDB<RailsMethodName, RailsRelayItem> {
  const db = new RelayerDB<RailsMethodName, RailsRelayItem>(name)
  if (!db) {
    throw new Error(`DB not found for client: ${name}`)
  }

  return db
}