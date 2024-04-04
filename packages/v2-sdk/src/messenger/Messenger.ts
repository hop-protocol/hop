import { BigNumber, Signer, providers } from 'ethers'
import { BundleCommitted, BundleCommittedEventFetcher } from '#messenger/events/BundleCommitted.js'
import { BundleForwarded, BundleForwardedEventFetcher } from '#messenger/events/BundleForwarded.js'
import { BundleReceived, BundleReceivedEventFetcher } from '#messenger/events/BundleReceived.js'
import { BundleSet, BundleSetEventFetcher } from '#messenger/events/BundleSet.js'
import { DateTime } from 'luxon'
import { chainSlugMap } from '#utils/chainSlugMap.js'
import { ExitRelayer } from '#exitRelayers/ExitRelayer.js'
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js'
import { MerkleTree } from '#utils/MerkleTree.js'
import { MessageBundled, MessageBundledEventFetcher } from '#messenger/events/MessageBundled.js'
import { MessageExecuted, MessageExecutedEventFetcher } from '#messenger/events/MessageExecuted.js'
import { MessageSent, MessageSentEventFetcher } from '#messenger/events/MessageSent.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { FeesSentToHub, FeesSentToHubEventFetcher } from '#messenger/events/FeesSentToHub.js'
import { formatEther, formatUnits, getAddress, parseEther } from 'ethers/lib/utils.js'
import { GasPriceOracle } from '#gasPriceOracle/index.js'

export type GetEventsInput = {
  chainId: number
  fromBlock: number
  toBlock?: number
}

export type BundleProof = {
  bundleId: string
  treeIndex: number
  siblings: string[]
  totalLeaves: number
}

export type HasAuctionStartedInput = {
  fromChainId: number
  bundleCommittedEvent: BundleCommitted
}

export type GetSpokeExitTimeInput = {
  fromChainId: number
  toChainId: number
}

export type GetRelayRewardInput = {
  fromChainId: number,
  bundleCommittedEvent: BundleCommitted
}

export type GetEstimatedTxCostForForwardMessageInput = {
  chainId: number,
}

export type ShouldAttemptForwardMessageInput = {
  fromChainId: number,
  bundleCommittedEvent: BundleCommitted
}

export type GetBundleExitPopulatedTxInput = {
  fromChainId: number,
  bundleCommittedEvent?: BundleCommitted
  bundleCommittedTransactionHash?: string
}

export type ExitBundleInput = {
  fromChainId: number,
  bundleCommittedEvent?: BundleCommitted
  bundleCommittedTransactionHash?: string
  signer: Signer
}

type GetIsL2TxHashExitedInput = {
  fromChainId: number
  transactionHash: string
}

export type GetSendMessagePopulatedTxInput = {
  fromChainId: number,
  toChainId: number,
  toAddress: string,
  toCalldata: string
}

export type GetEventContextInput = {
  chainId: number
  event: any,
}

export type GetRouteDataInput = {
  fromChainId: number,
  toChainId: number
}

export type GetMessageFeeInput = {
  fromChainId: number,
  toChainId: number
}

export type GetMaxBundleMessageCountInput = {
  fromChainId: number,
  toChainId: number
}

export type GetIsBundleSetInput = {
  fromChainId: number,
  toChainId: number,
  bundleId: string
}

export type GetMessageSentEventFromTransactionReceiptInput = {
  fromChainId: number,
  receipt: any
}

export type GetMessageSentEventFromTransactionHashInput = {
  fromChainId: number,
  transactionHash: string
}

export type GetMessageBundledEventFromMessageIdInput = {
  fromChainId: number,
  messageId: string
}

export type GetMessageSentEventFromMessageIdInput = {
  fromChainId: number,
  messageId: string
}

export type GetMessageExecutedEventFromMessageIdInput = {
  messageId: string
  fromChainId: number,
  toChainId: number,
}

export type GetMessageBundledEventFromTransactionHashInput = {
  fromChainId: number,
  transactionHash: string
}

export type GetMessageIdFromTransactionHashInput = {
  fromChainId: number,
  transactionHash: string
}

export type GetMessageBundleIdFromMessageIdInput = {
  fromChainId: number,
  messageId: string
}

export type GetMessageBundleIdFromTransactionHashInput = {
  fromChainId: number,
  transactionHash: string
}

export type GetMessageTreeIndexFromMessageIdInput = {
  fromChainId: number,
  messageId: string
}

export type GetMessageTreeIndexFromTransactionHashInput = {
  fromChainId: number,
  transactionHash: string
}

export type GetMessageBundledEventsForBundleIdInput = {
  fromChainId: number,
  bundleId: string
}

export type GetMessageIdsForBundleIdInput = {
  fromChainId: number,
  bundleId: string
}

export type GetMerkleProofForMessageIdInput = {
  messageIds: string[],
  targetMessageId: string
}

export type GetBundleProofFromMessageIdInput = {
  fromChainId: number,
  messageId: string
}

export type GetBundleProofFromTransactionHashInput = {
  fromChainId: number,
  transactionHash: string
}

export type GetRelayMessageDataFromTransactionHashInput = {
  fromChainId: number,
  transactionHash: string
}

export type GetRelayMessagePopulatedTxInput = {
  fromChainId: number,
  toChainId: number,
  fromAddress: string,
  toAddress: string,
  toCalldata: string,
  bundleProof: BundleProof
}

export type GetMessageCalldataInput = {
  fromChainId: number
  messageId: string
}

export type GetIsMessageIdRelayedInput = {
  messageId: string
  fromChainId: number
  toChainId: number
}

export type GetRelayFeeInput = {
  fromChainId: number,
  toChainId: number,
  toAddress: string,
  toCalldata: string
}

export class Messenger {
  batchBlocks?: number = 1000
  l1ChainId: number = 1
  network: string = 'mainnet'
  gasPriceOracle: GasPriceOracle

  constructor() {
    const url = 'https://v2-gas-price-oracle-goerli.hop.exchange'
    this.gasPriceOracle = new GasPriceOracle(url)
  }

  getRpcProvider (chainId: number) {
    return null as any // TODO
  }

  getSpokeMessageBridgeContractAddress (chainId: number): string {
    return '' // TODO
  }

  getHubMessageBridgeContractAddress (chainId: number): string {
    return '' // TODO
  }

  private isValidChainId (chainId: number) {
    return true // TODO
  }

  private isValidTxHash (txHash: string): boolean {
    return txHash.slice(0, 2) === '0x' && txHash.length === 66
  }

  getChainSlug (chainId: number) {
    const chainSlug = chainSlugMap[chainId]
    if (!chainSlug) {
      throw new Error(`Invalid chain: ${chainId}`)
    }
    return chainSlug
  }

  async getBundleCommittedEvents (input: GetEventsInput): Promise<BundleCommitted[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new BundleCommittedEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getBundleForwardedEvents (input: GetEventsInput): Promise<BundleForwarded[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getHubMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new BundleForwardedEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getBundleReceivedEvents (input: GetEventsInput): Promise<BundleReceived[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getHubMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new BundleReceivedEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getBundleSetEvents (input: GetEventsInput): Promise<BundleSet[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new BundleSetEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getFeesSentToHubEvents (input: GetEventsInput): Promise<FeesSentToHub[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new FeesSentToHubEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getMessageBundledEvents (input: GetEventsInput): Promise<MessageBundled[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new MessageBundledEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getMessageExecutedEvents (input: GetEventsInput): Promise<MessageExecuted[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new MessageExecutedEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getMessageSentEvents (input: GetEventsInput): Promise<MessageSent[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${chainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new MessageSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async hasAuctionStarted (input: HasAuctionStartedInput): Promise<boolean> {
    const { fromChainId, bundleCommittedEvent } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const { commitTime, toChainId } = bundleCommittedEvent
    const exitTime = await this.getSpokeExitTime({ fromChainId, toChainId })
    return commitTime + exitTime < DateTime.utc().toSeconds()
  }

  async getSpokeExitTime (input: GetSpokeExitTimeInput): Promise<number> {
    const { fromChainId, toChainId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    const provider = this.getRpcProvider(toChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${toChainId}`)
    }

    const address = this.getHubMessageBridgeContractAddress(toChainId)
    if (!address) {
      throw new Error(`Invalid chain: ${toChainId}`)
    }
    const hubMessageBridge = HubMessageBridge__factory.connect(address, provider)
    const exitTime = await hubMessageBridge.getSpokeExitTime(fromChainId)
    const exitTimeSeconds = Number(exitTime.toString())
    return exitTimeSeconds
  }

  // relayReward = (block.timestamp - relayWindowStart) * feesCollected / relayWindow
  // reference: https://github.com/hop-protocol/contracts-v2/blob/master/contracts/bridge/FeeDistributor/FeeDistributor.sol#L83-L106
  async getRelayReward (input: GetRelayRewardInput): Promise<number> {
    const { fromChainId, bundleCommittedEvent } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }
    const { commitTime, bundleFees, toChainId } = bundleCommittedEvent
    const feesCollected = Number(formatEther(bundleFees))
    const { timestamp: blockTimestamp } = await provider.getBlock('latest')
    const spokeExitTime = await this.getSpokeExitTime({ fromChainId, toChainId })
    const relayWindowStart = commitTime + spokeExitTime
    const relayWindow = this.getRelayWindowHours() * 60 * 60
    const relayReward = (blockTimestamp - relayWindowStart) * feesCollected / relayWindow
    return relayReward
  }

  async getEstimatedTxCostForForwardMessage (input: GetEstimatedTxCostForForwardMessageInput): Promise<number> {
    const { chainId } = input
    const provider = this.getRpcProvider(chainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${chainId}`)
    }
    const estimatedGas = BigNumber.from(1_000_000) // TODO
    const gasPrice = await provider.getGasPrice()
    const estimatedTxCost = estimatedGas.mul(gasPrice)
    return Number(formatUnits(estimatedTxCost, 9))
  }

  async shouldAttemptForwardMessage (input: ShouldAttemptForwardMessageInput): Promise<boolean> {
    const { fromChainId, bundleCommittedEvent } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const estimatedTxCost = await this.getEstimatedTxCostForForwardMessage({ chainId: fromChainId })
    const relayReward = await this.getRelayReward({ fromChainId, bundleCommittedEvent })
    const txOk = relayReward > estimatedTxCost
    const timeOk = await this.hasAuctionStarted({ fromChainId, bundleCommittedEvent })
    const shouldAttempt = txOk && timeOk
    return shouldAttempt
  }

  async getBundleExitPopulatedTx (input: GetBundleExitPopulatedTxInput): Promise<any> {
    let { fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (bundleCommittedTransactionHash) {
      if (!this.isValidTxHash(bundleCommittedTransactionHash)) {
        throw new Error(`Invalid transaction hash: ${bundleCommittedTransactionHash}`)
      }
    } else if (bundleCommittedEvent) {
      const { eventLog, context } = bundleCommittedEvent
      bundleCommittedTransactionHash = eventLog.transactionHash ?? context?.transactionHash
    }
    if (!bundleCommittedTransactionHash) {
      throw new Error('expected bundle comitted transaction hash')
    }

    const l1Provider = this.getRpcProvider(this.l1ChainId)
    const l2Provider = this.getRpcProvider(fromChainId)
    let exitRelayer : ExitRelayer | undefined = undefined
    if ([420, 10].includes(fromChainId)) {
      const { OptimismRelayer } = await import('#exitRelayers/OptimismRelayer.js')
      exitRelayer = new OptimismRelayer(this.network, l1Provider, l2Provider)
    } else if ([421613, 42161, 42170].includes(fromChainId)) {
      // const { ArbitrumRelayer } = await import('#exitRelayers/ArbitrumRelayer.js')
      // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
    } else if ([80001, 137].includes(fromChainId)) {
      // const { PolygonRelayer } = await import('#exitRelayers/PolygonRelayer.js')
      // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
    } else if ([100].includes(fromChainId)) {
      // const { GnosisChainRelayer } = await import('#exitRelayers/GnosisChainRelayer.js')
      // exitRelayer = new GnosisChainRelayer(this.network, l1Provider, l2Provider)
    }
    if (!exitRelayer) {
      throw new Error(`Exit relayer not found for chainId "${fromChainId}"`)
    }
    const txData = await exitRelayer.getExitPopulatedTx(bundleCommittedTransactionHash)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async exitBundle (input: ExitBundleInput): Promise<any> {
    let { fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash, signer } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (bundleCommittedTransactionHash) {
      if (!this.isValidTxHash(bundleCommittedTransactionHash)) {
        throw new Error(`Invalid transaction hash: ${bundleCommittedTransactionHash}`)
      }
    } else if (bundleCommittedEvent) {
      const { eventLog, context } = bundleCommittedEvent
      bundleCommittedTransactionHash = eventLog.transactionHash ?? context?.transactionHash
    }
    if (!bundleCommittedTransactionHash) {
      throw new Error('expected bundle comitted transaction hash')
    }

    const l1Provider = this.getRpcProvider(this.l1ChainId)
    const l2Provider = this.getRpcProvider(fromChainId)
    let exitRelayer : ExitRelayer | undefined = undefined
    if ([420, 10].includes(fromChainId)) {
      const { OptimismRelayer } = await import('#exitRelayers/OptimismRelayer.js')
      exitRelayer = new OptimismRelayer(this.network, signer, l2Provider)
    } else if ([421613, 42161, 42170].includes(fromChainId)) {
      // const { ArbitrumRelayer } = await import('#exitRelayers/ArbitrumRelayer.js')
      // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
    } else if ([80001, 137].includes(fromChainId)) {
      // const { PolygonRelayer } = await import('#exitRelayers/PolygonRelayer.js')
      // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
    } else if ([100].includes(fromChainId)) {
      // const { GnosisChainRelayer } = await import('#exitRelayers/GnosisChainRelayer.js')
      // exitRelayer = new GnosisChainRelayer(this.network, l1Provider, l2Provider)
    }
    if (!exitRelayer) {
      throw new Error(`Exit relayer not found for chainId "${fromChainId}"`)
    }
    const tx = await exitRelayer.exitTx(bundleCommittedTransactionHash)
    return tx
  }

  async getIsL2TxHashExited (input: GetIsL2TxHashExitedInput): Promise<any> {
    const { fromChainId, transactionHash } = input

    const l1Provider = this.getRpcProvider(this.l1ChainId)
    const l2Provider = this.getRpcProvider(fromChainId)
    let exitRelayer : ExitRelayer
    if ([420, 10].includes(fromChainId)) {
      const { OptimismRelayer } = await import('#exitRelayers/OptimismRelayer.js')
      exitRelayer = new OptimismRelayer(this.network, l1Provider, l2Provider)
    } else {
      throw new Error(`Exit relayer not found for chainId "${fromChainId}"`)
    }

    return exitRelayer.getIsL2TxHashExited(transactionHash)
  }

  async getSendMessagePopulatedTx (input: GetSendMessagePopulatedTxInput): Promise<any> {
    let { fromChainId, toChainId, toAddress, toCalldata = '0x' } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    if (fromChainId === toChainId) {
      throw new Error('fromChainId and toChainId must be different')
    }
    if (!toAddress) {
      throw new Error('toAddress is required')
    }
    if (!toCalldata) {
      toCalldata = '0x'
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider)
    const txData = await spokeMessageBridge.populateTransaction.dispatchMessage(toChainId, toAddress, toCalldata)
    const value = await this.getMessageFee({ fromChainId, toChainId })

    return {
      ...txData,
      chainId: fromChainId,
      value: value.toString()
    }
  }

  // reference: https://github.com/hop-protocol/contracts-v2/blob/cdc3377d6a1f964554ba0e6e1fef0b504d43fc6a/contracts/bridge/FeeDistributor/FeeDistributor.sol#L42
  getRelayWindowHours (): number {
    return 12
  }

  async getRouteData (input: GetRouteDataInput) {
    const { fromChainId, toChainId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    if (fromChainId === toChainId) {
      throw new Error('fromChainId and toChainId must be different')
    }
    const provider = this.getRpcProvider(fromChainId)
    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider)
    const routeData = await spokeMessageBridge.routeData(toChainId)

    return {
      messageFee: routeData.messageFee,
      maxBundleMessages: Number(routeData.maxBundleMessages.toString())
    }
  }

  async getMessageFee (input: GetMessageFeeInput) {
    const { fromChainId, toChainId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    if (fromChainId === toChainId) {
      throw new Error('fromChainId and toChainId must be different')
    }
    const routeData = await this.getRouteData({ fromChainId, toChainId })
    return routeData.messageFee
  }

  async getMaxBundleMessageCount (input: GetMaxBundleMessageCountInput) {
    const { fromChainId, toChainId } = input
    if (fromChainId === toChainId) {
      throw new Error('fromChainId and toChainId must be different')
    }
    const routeData = await this.getRouteData({ fromChainId, toChainId })
    return routeData.maxBundleMessages
  }

  async getIsBundleSet (input: GetIsBundleSetInput) {
    const { fromChainId, toChainId, bundleId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    const provider = this.getRpcProvider(toChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${toChainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(toChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${toChainId}`)
    }
    const hubMessageBridge = HubMessageBridge__factory.connect(address, provider)
    const entity = await hubMessageBridge.bundles(bundleId)
    if (!entity) {
      return false
    }

    return BigNumber.from(entity.root).gt(0) && Number(entity.fromChainId.toString()) === fromChainId
  }

  async getMessageSentEventFromTransactionReceipt (input: GetMessageSentEventFromTransactionReceiptInput) {
    const { fromChainId, receipt } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${fromChainId}`)
    }
    const eventFetcher = new MessageSentEventFetcher(provider, fromChainId, this.batchBlocks as any, address)
    const filter = eventFetcher.getFilter()
    for (const log of receipt.logs) {
      if (log.topics[0] === filter?.topics?.[0]) {
        const decoded = eventFetcher.toTypedEvent(log)
        return decoded
      }
    }
    return null
  }

  async getMessageSentEventFromTransactionHash (input: GetMessageSentEventFromTransactionHashInput) {
    const { fromChainId, transactionHash } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)
    return this.getMessageSentEventFromTransactionReceipt({ fromChainId, receipt })
  }

  async getMessageBundledEventFromMessageId (input: GetMessageBundledEventFromMessageIdInput): Promise<MessageBundled> {
    const { fromChainId, messageId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${fromChainId}`)
    }

    const eventFetcher = new MessageBundledEventFetcher(provider, fromChainId, 1_000_000_000, address)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getMessageSentEventFromMessageId (input: GetMessageSentEventFromMessageIdInput) {
    const { fromChainId, messageId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!fromChainId) {
      throw new Error('fromChainId is required')
    }
    if (!messageId) {
      throw new Error('messageId is required')
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${fromChainId}`)
    }

    const eventFetcher = new MessageSentEventFetcher(provider, fromChainId, 1_000_000_000, address)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  // note: this is broken because messageId is not indexed in event
  async getMessageExecutedEventFromMessageId (input: GetMessageExecutedEventFromMessageIdInput) {
    const { fromChainId, toChainId, messageId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    if (!messageId) {
      throw new Error('messageId is required')
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${toChainId}`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(toChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${toChainId}`)
    }

    const eventFetcher = new MessageExecutedEventFetcher(provider, toChainId, 1_000_000_000, address)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getMessageBundledEventFromTransactionHash (input: GetMessageBundledEventFromTransactionHashInput) {
    const { fromChainId, transactionHash } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)
    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${fromChainId}`)
    }
    const eventFetcher = new MessageBundledEventFetcher(provider, fromChainId, this.batchBlocks as any, address)
    const filter = eventFetcher.getFilter()
    for (const log of receipt.logs) {
      if (log.topics[0] === filter?.topics?.[0]) {
        const decoded = eventFetcher.toTypedEvent(log)
        return decoded
      }
    }
    return null
  }

  async getMessageIdFromTransactionHash (input: GetMessageIdFromTransactionHashInput) {
    const { fromChainId, transactionHash } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!fromChainId) {
      throw new Error('fromChainId is required')
    }

    if (!transactionHash) {
      throw new Error('transactionHash is required')
    }

    const event = await this.getMessageSentEventFromTransactionHash({ fromChainId, transactionHash })
    if (!event) {
      throw new Error('event not found for transaction hash')
    }

    return event.messageId
  }

  async getMessageBundleIdFromMessageId (input: GetMessageBundleIdFromMessageIdInput): Promise<string> {
    const { fromChainId, messageId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const event = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId })
    if (!event) {
      throw new Error('event not found for messageId')
    }

    return event.bundleId
  }

  async getMessageBundleIdFromTransactionHash (input: GetMessageBundleIdFromTransactionHashInput): Promise<string> {
    const { fromChainId, transactionHash } = input
    const event = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash })
    if (!event) {
      throw new Error('event not found for transaction hash')
    }

    return event.bundleId
  }

  async getMessageTreeIndexFromMessageId (input: GetMessageTreeIndexFromMessageIdInput): Promise<number> {
    const { fromChainId, messageId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const event = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId })
    if (!event) {
      throw new Error('event not found for messageId')
    }

    return event.treeIndex
  }

  async getMessageTreeIndexFromTransactionHash (input: GetMessageTreeIndexFromTransactionHashInput): Promise<number> {
    const { fromChainId, transactionHash } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const event = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash })
    if (!event) {
      throw new Error('event not found for transaction hash')
    }

    return event.treeIndex
  }

  async getMessageBundledEventsForBundleId (input: GetMessageBundledEventsForBundleIdInput): Promise<any[]> {
    const { fromChainId, bundleId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${fromChainId}`)
    }
    const eventFetcher = new MessageBundledEventFetcher(provider, fromChainId, 1_000_000_000, address)
    const filter = eventFetcher.getBundleIdFilter(bundleId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events
  }

  async getMessageIdsForBundleId (input: GetMessageIdsForBundleIdInput): Promise<string[]> {
    const { fromChainId, bundleId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const messageEvents = await this.getMessageBundledEventsForBundleId({ fromChainId, bundleId })
    const messageIds = messageEvents.map((item: any) => item.messageId)
    return messageIds
  }

  getMerkleProofForMessageId (input: GetMerkleProofForMessageIdInput) {
    const { messageIds, targetMessageId } = input
    if (!targetMessageId) {
      throw new Error('targetMessageId is required')
    }

    const tree = MerkleTree.from(messageIds)
    const proof = tree.getHexProof(targetMessageId)
    return proof
  }

  async getBundleProofFromMessageId (input: GetBundleProofFromMessageIdInput): Promise<BundleProof> {
    const { fromChainId, messageId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }

    if (!messageId) {
      throw new Error('messageId is required')
    }

    const { treeIndex, bundleId } = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId })
    const messageIds = await this.getMessageIdsForBundleId({ fromChainId, bundleId })
    const siblings = this.getMerkleProofForMessageId({ messageIds, targetMessageId: messageId })
    const totalLeaves = messageIds.length

    return {
      bundleId,
      treeIndex,
      siblings,
      totalLeaves
    }
  }

  async getBundleProofFromTransactionHash (input: GetBundleProofFromTransactionHashInput): Promise<BundleProof> {
    const { fromChainId, transactionHash } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${fromChainId}`)
    }

    // TODO: handle case for when multiple message events in single transaction
    const { treeIndex, bundleId } = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash }) as any
    const targetMessageId = await this.getMessageIdFromTransactionHash({ fromChainId, transactionHash })
    const messageIds = await this.getMessageIdsForBundleId({ fromChainId, bundleId })
    const siblings = this.getMerkleProofForMessageId({ messageIds, targetMessageId })
    const totalLeaves = messageIds.length

    return {
      bundleId,
      treeIndex,
      siblings,
      totalLeaves
    }
  }

  async getRelayMessageDataFromTransactionHash (input: GetRelayMessageDataFromTransactionHashInput) {
    const { fromChainId, transactionHash } = input

    const event = await this.getMessageSentEventFromTransactionHash({ fromChainId, transactionHash }) as any
    const toAddress = event.to
    const fromAddress = event.from
    const toCalldata = event.data
    const toChainId = event.toChainId
    const bundleProof = await this.getBundleProofFromTransactionHash({ fromChainId, transactionHash })

    return {
      fromChainId,
      toAddress,
      fromAddress,
      toCalldata,
      toChainId,
      bundleProof
    }
  }

  async getRelayMessagePopulatedTx (input: GetRelayMessagePopulatedTxInput) {
    const { fromChainId, toChainId, fromAddress, toAddress, toCalldata, bundleProof } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }
    const provider = this.getRpcProvider(toChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${toChainId}`)
    }

    const address = this.getHubMessageBridgeContractAddress(toChainId)
    if (!address) {
      throw new Error(`Invalid chain: ${toChainId}`)
    }

    const hubMessageBridge = HubMessageBridge__factory.connect(address, provider)
    const txData = await hubMessageBridge.populateTransaction.executeMessage(
      fromChainId,
      fromAddress,
      toAddress,
      toCalldata,
      bundleProof
    )

    return {
      ...txData,
      chainId: toChainId
    }
  }

  async getMessageCalldata (input: GetMessageCalldataInput): Promise<string> {
    const { fromChainId, messageId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }

    if (!messageId) {
      throw new Error('messageId is required')
    }

    const event = await this.getMessageSentEventFromMessageId({ fromChainId, messageId })
    if (!event) {
      throw new Error(`Event not found for messageId: ${messageId}`)
    }

    return event.data
  }

  async getIsMessageIdRelayed (input: GetIsMessageIdRelayedInput): Promise<boolean> {
    const { messageId, fromChainId, toChainId } = input
    if (!messageId) {
      throw new Error('messageId is required')
    }

    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }

    if (!this.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }

    const event = await this.getMessageExecutedEventFromMessageId({ messageId, fromChainId, toChainId })
    return !!event
  }

  async getRelayFee (input: GetRelayFeeInput) {
    const {
      fromChainId,
      toChainId,
      toAddress,
      toCalldata
    } = input

    const populatedTx = await this.getSendMessagePopulatedTx({
      fromChainId,
      toChainId,
      toAddress,
      toCalldata
    })
    const timestamp: any = undefined
    const txData = populatedTx.data
    const chain = this.getChainSlug(toChainId)
    const provider = this.getRpcProvider(toChainId)
    const gasLimit = await provider.estimateGas(populatedTx)
    const feeData = await this.gasPriceOracle.estimateGasCost(chain, timestamp, gasLimit.toNumber(), txData)
    return parseEther(feeData.data.gasCost)
  }
}
