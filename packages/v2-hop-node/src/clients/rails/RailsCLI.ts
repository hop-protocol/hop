import { RailsRelayer } from './RailsRelayer.js'
import { RelayerDB } from '#relayer/index.js'
import { ClientName } from '../constants.js'
import { type BigNumber, type providers, utils } from 'ethers'
import { type RailsRelayItem, type RailsPath, RailsClientName } from './types.js'
import { getPathFromPathId, isValidBondTxInputData, isValidPushClaimTxInputData } from './utils.js'
import { RailsGateway, RailsMethodName } from './RailsSDKWrapper.js'
import { wallets } from '#wallets/index.js'

export {
  RailsClientName,
  RailsMethodName
}

export async function getRelayableItems (methodName: RailsMethodName): Promise<RailsRelayItem[]> {
  const name = ClientName.Rails
  const db = getRelayerDB(name)

  const relayableItems: RailsRelayItem[] = []
  for await (const [relayableItem, ] of db.getRelayableItems()) {
    if (
      (methodName === RailsMethodName.Bond && isValidBondTxInputData(relayableItem)) ||
      (methodName === RailsMethodName.PushClaim && isValidPushClaimTxInputData(relayableItem))
    ) {
      relayableItems.push(relayableItem)
    }
  }

  // TODO: Need to do this when called form CLI. Should not have to do this, create getter for DB
  // that checks openness of DB and returns existing instance if already open.
  await db.close()
  return relayableItems
}

export async function relayItem (relayItem: RailsRelayItem): Promise<providers.TransactionResponse> {
  const name = ClientName.Rails
  const db = getRelayerDB(name)

  const { relayChainId, relayTxMethodName } = await db.getTxContextByRelayItem(relayItem)

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

export async function stakeHop (chainId: string, amount: BigNumber): Promise<void> {
  const wallet = wallets.get(chainId)
  const sdk = new RailsGateway(chainId, wallet)

  const isStaked = await sdk.isStaked()
  if (isStaked) {
    throw new Error(`Already staked on chainId: ${chainId} for wallet: ${await wallet.getAddress()}`)
  }

  const minHopStake = await sdk.minHopStake()
  if (amount.lt(minHopStake)) {
    const currentStake = await sdk.getStakeBalance()
    const newTotalStake = currentStake.add(amount)
    if (newTotalStake.lt(minHopStake)) {
      throw new Error(`Amount to stake is less than the minimum required stake. Existing stake: ${utils.formatEther(currentStake)}, New stake amount: ${utils.formatEther(amount)}, Minimum: ${utils.formatEther(minHopStake)}.`)
    }
  }

  const hopBalance = await sdk.getHopBalance()
  if (hopBalance.lt(amount)) {
    throw new Error(`Insufficient HOP balance to stake. Balance: ${utils.formatEther(hopBalance)}, Amount: ${utils.formatEther(amount)}`)
  }

  const needsApprovalForStake = await sdk.getNeedsApprovalForStake(amount)
  if (needsApprovalForStake) {
    console.log('approving stake for amount:', utils.formatEther(amount))
    await sdk.approveStake(amount)
  }

  console.log('staking HOP for amount:', utils.formatEther(amount))
  await sdk.stakeHop(amount)
}
