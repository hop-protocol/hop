import { BigNumber, Signer, providers } from 'ethers'
import { BundleCommitted, BundleCommittedEventFetcher } from './events/messenger/BundleCommitted.js'
import { BundleForwarded, BundleForwardedEventFetcher } from './events/messenger/BundleForwarded.js'
import { BundleReceived, BundleReceivedEventFetcher } from './events/messenger/BundleReceived.js'
import { BundleSet, BundleSetEventFetcher } from './events/messenger/BundleSet.js'
import { ConfirmationSent, ConfirmationSentEventFetcher } from './events/nft/ConfirmationSent.js'
import { DateTime } from 'luxon'
import { ERC721Bridge__factory } from './config/contracts/factories/generated/ERC721Bridge__factory.js'
import { EventFetcher } from './eventFetcher.js'
import { ExitRelayer } from './exitRelayers/ExitRelayer.js'
import { FeesSentToHub, FeesSentToHubEventFetcher } from './events/messenger/FeesSentToHub.js'
import { GasPriceOracle } from './GasPriceOracle.js'
import { HubERC5164ConnectorFactory__factory } from './config/contracts/factories/generated/HubERC5164ConnectorFactory__factory.js'
import { HubMessageBridge__factory } from './config/contracts/factories/generated/HubMessageBridge__factory.js'
import { MerkleTree } from './utils/MerkleTree.js'
import { MessageBundled, MessageBundledEventFetcher } from './events/messenger/MessageBundled.js'
import { MessageExecuted, MessageExecutedEventFetcher } from './events/messenger/MessageExecuted.js'
import { MessageSent, MessageSentEventFetcher } from './events/messenger/MessageSent.js'
import { SpokeMessageBridge__factory } from './config/contracts/factories/generated/SpokeMessageBridge__factory.js'
import { TokenConfirmed, TokenConfirmedEventFetcher } from './events/nft/TokenConfirmed.js'
import { TokenSent, TokenSentEventFetcher } from './events/nft/TokenSent.js'
import { TransferBondedEventFetcher } from './events/liquidityHub/TransferBonded.js'
import { TransferSentEventFetcher } from './events/liquidityHub/TransferSent.js'
import { chainSlugMap } from './utils/chainSlugMap.js'
import { formatEther, formatUnits, getAddress, parseEther } from 'ethers/lib/utils.js'
import { getProvider } from './utils/getProvider.js'
import { goerliAddresses } from './config/addresses/index.js'

const cache : Record<string, any> = {}

export type Options = {
  batchBlocks?: number,
  contractAddresses?: Record<string, any> // TODO: types
}

export type BundleProof = {
  bundleId: string
  treeIndex: number
  siblings: string[]
  totalLeaves: number
}

export type GetEventsInput = {
  chainId: number
  fromBlock: number
  toBlock?: number
}

export type GetGeneralEventsInput = {
  eventName?: string
  eventNames?: string[]
  chainId: number
  fromBlock: number
  toBlock?: number
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

export type GetNftMintPopulatedTxInput = {
  fromChainId: number,
  toAddress: string
  tokenId: string
}

export type GetNftBurnPopulatedTxInput = {
  fromChainId: number,
  tokenId: string
}

export type GetNftSendPopulatedTxInput = {
  fromChainId: number,
  toChainId: number,
  toAddress: string
  tokenId: string
}

export type GetNftMintAndSendPopulatedTxInput = {
  fromChainId: number,
  toChainId: number,
  toAddress: string
  tokenId: string
}

export type GetNftConfirmPopulatedTxInput = {
  fromChainId: number,
  tokenId: string
}

export type ConnectTargetsInput = {
  hubChainId: number
  spokeChainId: number
  target1: string
  target2: string
  signer: Signer
}

export type GetRelayFeeInput = {
  fromChainId: number,
  toChainId: number,
  toAddress: string,
  toCalldata: string
}

export class Hop {
  eventFetcher: EventFetcher
  network: string
  batchBlocks?: number
  contractAddresses: Record<string, any> = {
    mainnet: {},
    goerli: goerliAddresses
  }

  providers: Record<string, any> = {}
  l1ChainId : number
  gasPriceOracle: GasPriceOracle

  constructor (network: string = 'goerli', options?: Options) {
    if (!['mainnet', 'goerli'].includes(network)) {
      throw new Error(`Invalid network: ${network}`)
    }
    this.network = network

    if (this.network === 'mainnet') {
      this.l1ChainId = 1
    } else if (this.network === 'goerli') {
      this.l1ChainId = 5
    }

    if (options?.batchBlocks) {
      this.batchBlocks = options.batchBlocks
    }

    if (options?.contractAddresses) {
      this.contractAddresses[network] = options.contractAddresses
    }

    const url = 'https://v2-gas-price-oracle-goerli.hop.exchange'
    this.gasPriceOracle = new GasPriceOracle(url)
  }

  get version () {
    return '' // TODO
  }

  getRpcProvider (chainId: number) {
    if (this.providers[chainId]) {
      return this.providers[chainId]
    }

    return getProvider(this.network, chainId)
  }

  setRpcProviders (providers: Record<string, any>) {
    for (const chainId in providers) {
      this.setRpcProvider(Number(chainId), providers[chainId])
    }
  }

  setRpcProvider (chainId: number, provider: any) {
    if (typeof provider === 'string') {
      provider = new providers.StaticJsonRpcProvider(provider)
    }
    this.providers[chainId] = provider
  }

  getSpokeMessageBridgeContractAddress (chainId: number): string {
    if (!chainId) {
      throw new Error('chainId is required')
    }
    const address = this.contractAddresses[this.network]?.[chainId]?.spokeCoreMessenger
    return address
  }

  getHubMessageBridgeContractAddress (chainId: number): string {
    if (!chainId) {
      throw new Error('chainId is required')
    }
    const address = this.contractAddresses[this.network]?.[chainId]?.hubCoreMessenger
    return address
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

  async getEvents (input: GetGeneralEventsInput): Promise<any[]> {
    let { eventName, eventNames, chainId, fromBlock, toBlock } = input
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

    const latestBlock = await provider.getBlockNumber()
    if (latestBlock) {
      if (!toBlock) {
        toBlock = latestBlock
      }
      if (!fromBlock) {
        const start = latestBlock - 1000
        fromBlock = start
      }
      if (toBlock && fromBlock < 0) {
        fromBlock = toBlock + fromBlock
      }
    }

    if (eventName) {
      eventNames = [eventName]
    }

    if (!eventNames?.length) {
      throw new Error('expected eventName or eventNames')
    }

    const filters :any[] = []
    const eventFetcher = new EventFetcher({
      provider,
      batchBlocks: this.batchBlocks
    })
    const map : any = {}
    for (const eventName of eventNames) {
      if (eventName === 'BundleCommitted') {
        const address = this.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleCommittedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'BundleForwared') {
        const address = this.getHubMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleForwardedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'BundleReceived') {
        const address = this.getHubMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleReceivedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'BundleSet') {
        const address = this.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new BundleSetEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'FeesSentToHub') {
        const address = this.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new FeesSentToHubEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'MessageBundled') {
        const address = this.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new MessageBundledEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'MessageExecuted') {
        const address = this.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new MessageExecutedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'MessageSent') {
        const address = this.getSpokeMessageBridgeContractAddress(chainId)
        const _eventFetcher = new MessageSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'ConfirmationSent') { // nft
        const address = this.getNftBridgeContractAddress(chainId)
        const _eventFetcher = new ConfirmationSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TokenConfirmed') { // nft
        const address = this.getNftBridgeContractAddress(chainId)
        const _eventFetcher = new TokenConfirmedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TokenSent') { // nft
        const address = this.getNftBridgeContractAddress(chainId)
        const _eventFetcher = new TokenSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TransferSent') { // LiquidityHub
        const address = this.getLiquidityHubContractAddress(chainId)
        const _eventFetcher = new TransferSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      } else if (eventName === 'TransferBonded') { // LiquidityHub
        const address = this.getLiquidityHubContractAddress(chainId)
        const _eventFetcher = new TransferBondedEventFetcher(provider, chainId, this.batchBlocks as any, address)
        const filter = _eventFetcher.getFilter()
        filters.push(filter)
        map[filter?.topics?.[0] as string] = _eventFetcher
      }
    }
    const options = {
      fromBlock,
      toBlock
    }
    const events = await eventFetcher.fetchEvents(filters, options as any)
    const decoded : any[] = []
    for (const event of events) {
      const res = await map[event.topics[0] as string].populateEvents([event])
      decoded.push(...res)
    }
    return decoded
  }

  getEventNames (): string[] {
    return [
      'BundleCommitted',
      'BundleForwarded',
      'BundleReceived',
      'BundleSet',
      'FeesSentToHub',
      'MessageBundled',
      'MessageExecuted',
      'MessageSent'
    ]
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
      const { OptimismRelayer } = await import('./exitRelayers/OptimismRelayer.js')
      exitRelayer = new OptimismRelayer(this.network, l1Provider, l2Provider)
    } else if ([421613, 42161, 42170].includes(fromChainId)) {
      // const { ArbitrumRelayer } = await import('./exitRelayers/ArbitrumRelayer.js')
      // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
    } else if ([80001, 137].includes(fromChainId)) {
      // const { PolygonRelayer } = await import('./exitRelayers/PolygonRelayer.js')
      // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
    } else if ([100].includes(fromChainId)) {
      // const { GnosisChainRelayer } = await import('./exitRelayers/GnosisChainRelayer.js')
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
      const { OptimismRelayer } = await import('./exitRelayers/OptimismRelayer.js')
      exitRelayer = new OptimismRelayer(this.network, signer, l2Provider)
    } else if ([421613, 42161, 42170].includes(fromChainId)) {
      // const { ArbitrumRelayer } = await import('./exitRelayers/ArbitrumRelayer.js')
      // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
    } else if ([80001, 137].includes(fromChainId)) {
      // const { PolygonRelayer } = await import('./exitRelayers/PolygonRelayer.js')
      // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
    } else if ([100].includes(fromChainId)) {
      // const { GnosisChainRelayer } = await import('./exitRelayers/GnosisChainRelayer.js')
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
      const { OptimismRelayer } = await import('./exitRelayers/OptimismRelayer.js')
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

  async getBlock (chainId: number, blockNumber: number): Promise<any> {
    const cacheKey = `${chainId}-${blockNumber}`
    if (cache[cacheKey]) {
      return cache[cacheKey]
    }
    const provider = this.getRpcProvider(chainId)
    const block = await provider.getBlock(blockNumber)
    cache[cacheKey] = block
    return block
  }

  getChainSlug (chainId: number) {
    const chainSlug = chainSlugMap[chainId]
    if (!chainSlug) {
      throw new Error(`Invalid chain: ${chainId}`)
    }
    return chainSlug
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

  private isValidTxHash (txHash: string): boolean {
    return txHash.slice(0, 2) === '0x' && txHash.length === 66
  }

  getContractAddresses () {
    return this.contractAddresses[this.network]
  }

  setContractAddresses (contractAddresses: any) {
    this.contractAddresses[this.network] = contractAddresses
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

  async getMessageBundledEventFromMessageId (input: GetMessageBundledEventFromMessageIdInput) {
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
    const events = await eventFetcher._getEvents(filter, fromBlock, toBlock)
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
    const events = await eventFetcher._getEvents(filter, fromBlock, toBlock)
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
    const events = await eventFetcher._getEvents(filter, fromBlock, toBlock)
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
    const events = eventFetcher._getEvents(filter, fromBlock, toBlock)
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

  getSupportedChainIds (): number[] {
    const keys = Object.keys(this.contractAddresses[this.network])
    return keys.map((chainId: string) => Number(chainId))
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

  private isValidChainId (chainId: number) {
    if (!chainId) {
      throw new Error('chainId is required')
    }

    const chainIds = new Set(Object.keys(this.contractAddresses[this.network]).map((chainId: string) => Number(chainId)))
    return chainIds.has(chainId)
  }

  async connectTargets (input: ConnectTargetsInput): Promise<any> {
    const { hubChainId, spokeChainId, target1, target2, signer } = input
    const provider = this.getRpcProvider(hubChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId: ${hubChainId}`)
    }
    const address = this.contractAddresses[this.network]?.[hubChainId]?.hubConnectorFactory
    if (!address) {
      throw new Error('address not found for hub connector factory')
    }
    const factory = HubERC5164ConnectorFactory__factory.connect(address, signer)
    const tx = await (factory as any).deployConnectors(hubChainId, target1, spokeChainId, target2)
    const receipt = await tx.wait()
    const event = receipt.events?.find(
      (event: any) => event.event === 'ConnectorDeployed'
    )
    const connectorAddress = getAddress(event?.args?.connector)
    return { connectorAddress }
  }

  // liquidity hub start //////////////////////////////////////////////////////

  getLiquidityHubContractAddress (chainId: number): string {
    if (!chainId) {
      throw new Error('chainId is required')
    }
    const address = this.contractAddresses[this.network]?.[chainId]?.liquidityHub
    return address
  }

  // liquidity hub end ////////////////////////////////////////////////////////

  // nft start ////////////////////////////////////////////////////////////////

  async getNftConfirmationSentEvents (input: GetEventsInput): Promise<ConfirmationSent[]> {
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
    const address = this.getNftBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new ConfirmationSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getNftTokenConfirmedEvents (input: GetEventsInput): Promise<TokenConfirmed[]> {
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
    const address = this.getNftBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new TokenConfirmedEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  async getNftTokenSentEvents (input: GetEventsInput): Promise<TokenSent[]> {
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
    const address = this.getNftBridgeContractAddress(chainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId: ${chainId}`)
    }
    const eventFetcher = new TokenSentEventFetcher(provider, chainId, this.batchBlocks as any, address)
    return eventFetcher.getEvents(fromBlock, toBlock as any)
  }

  getNftBridgeContractAddress (chainId: number): string {
    if (!chainId) {
      throw new Error('chainId is required')
    }
    const address = this.contractAddresses[this.network]?.[chainId]?.nftBridge
    return address
  }

  async getNftMintPopulatedTx (input: GetNftMintPopulatedTxInput): Promise<any> {
    const { fromChainId, toAddress, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!toAddress) {
      throw new Error('toAddress is required')
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Nft bridge address not found for chainId "${fromChainId}"`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.mint(toAddress, tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftBurnPopulatedTx (input: GetNftBurnPopulatedTxInput): Promise<any> {
    const { fromChainId, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.burn(tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftSendPopulatedTx (input: GetNftSendPopulatedTxInput): Promise<any> {
    const { fromChainId, toChainId, toAddress, tokenId } = input
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
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.send(toChainId, toAddress, tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftMintAndSendPopulatedTx (input: GetNftMintAndSendPopulatedTxInput): Promise<any> {
    const { fromChainId, toChainId, toAddress, tokenId } = input
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
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.mintAndSend(toChainId, toAddress, tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  async getNftConfirmPopulatedTx (input: GetNftConfirmPopulatedTxInput): Promise<any> {
    const { fromChainId, tokenId } = input
    if (!this.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!tokenId) {
      throw new Error('tokenId is required')
    }
    const provider = this.getRpcProvider(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chain: ${fromChainId}`)
    }

    const address = this.getNftBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Invalid address: ${fromChainId}`)
    }
    const nftBridge = ERC721Bridge__factory.connect(address, provider)
    const txData = await nftBridge.populateTransaction.confirm(tokenId)

    return {
      ...txData,
      chainId: fromChainId
    }
  }

  // nft end //////////////////////////////////////////////////////////////////
}
