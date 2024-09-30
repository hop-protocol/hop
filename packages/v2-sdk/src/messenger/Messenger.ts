import { Base, BaseConfig, TxOverrides } from '#common/index.js'
import { BigNumber, BigNumberish, Signer, providers, utils, Event as EthersEvent } from 'ethers'
import { EthersEventWithDecodedTypesAndContext, EthersEventWithDecodedTypes } from '#events/index.js'
import { BundleCommitted, BundleCommittedEventFetcher } from '#messenger/events/BundleCommitted.js'
import { BundleForwarded, BundleForwardedEventFetcher } from '#messenger/events/BundleForwarded.js'
import { BundleReceived, BundleReceivedEventFetcher } from '#messenger/events/BundleReceived.js'
import { BundleSet, BundleSetEventFetcher } from '#messenger/events/BundleSet.js'
import { DateTime } from 'luxon'
import { ExitRelayer } from '#exitRelayers/ExitRelayer.js'
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js'
import { MerkleTree } from '#utils/MerkleTree.js'
import { MessageBundled, MessageBundledEventFetcher } from '#messenger/events/MessageBundled.js'
import { MessageExecuted, MessageExecutedEventFetcher } from '#messenger/events/MessageExecuted.js'
import { MessageSent, MessageSentEventFetcher } from '#messenger/events/MessageSent.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { MockExecutor__factory } from '#contracts/factories/MockExecutor__factory.js'
import { FeesSentToHub, FeesSentToHubEventFetcher } from '#messenger/events/FeesSentToHub.js'
import { GasPriceOracle } from '#gasPriceOracle/index.js'
import { ConfigError, InputError, CustomError } from '#error/index.js'

const { formatEther, formatUnits, parseEther } = utils

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
  fromChainId: BigNumberish
  bundleCommittedEvent: BundleCommitted
}

export type GetSpokeExitTimeInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
}

export type GetRelayRewardInput = {
  fromChainId: BigNumberish
  bundleCommittedEvent: BundleCommitted
}

export type GetEstimatedTxCostForForwardMessageInput = {
  chainId: BigNumberish
}

export type ShouldAttemptForwardMessageInput = {
  fromChainId: BigNumberish
  bundleCommittedEvent: BundleCommitted
}

export type GetBundleExitPopulatedTxInput = {
  fromChainId: BigNumberish
  bundleCommittedEvent?: EthersEventWithDecodedTypesAndContext<BundleCommitted>
  bundleCommittedTransactionHash?: string
}

export type ExitBundleInput = {
  fromChainId: BigNumberish
  bundleCommittedEvent?: EthersEventWithDecodedTypesAndContext<BundleCommitted>
  bundleCommittedTransactionHash?: string
}

export type RouteData = {
  messageFee: BigNumber
  maxBundleMessages: number
}

export type GetIsL2TxHashExitedInput = {
  fromChainId: BigNumberish
  transactionHash: string
}

export type GetSendMessagePopulatedTxInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  toAddress: string
  toCalldata: string
}

export type GetEventContextInput = {
  chainId: BigNumberish
  event: EthersEvent
}

export type GetRouteDataInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
}

export type GetMessageFeeInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
}

export type GetMaxBundleMessageCountInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
}

export type GetIsBundleSetInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  bundleId: string
}

export type GetMessageSentEventFromTransactionReceiptInput = {
  chainId: BigNumberish
  receipt: providers.TransactionReceipt
}

export type GetMessageSentEventFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetMessageBundledEventFromMessageIdInput = {
  chainId: BigNumberish
  messageId: string
}

export type GetMessageSentEventFromMessageIdInput = {
  chainId: BigNumberish
  messageId: string
}

export type GetMessageExecutedEventFromMessageIdInput = {
  messageId: string
  chainId: BigNumberish
}

export type GetMessageBundledEventFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetMessageIdFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetMessageBundleIdFromMessageIdInput = {
  chainId: BigNumberish
  messageId: string
}

export type GetMessageBundleIdFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetMessageTreeIndexFromMessageIdInput = {
  chainId: BigNumberish
  messageId: string
}

export type GetMessageTreeIndexFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetMessageBundledEventsForBundleIdInput = {
  chainId: BigNumberish
  bundleId: string
}

export type GetMessageIdsForBundleIdInput = {
  chainId: BigNumberish
  bundleId: string
}

export type GetMerkleProofForMessageIdInput = {
  messageIds: string[],
  targetMessageId: string
}

export type GetBundleProofFromMessageIdInput = {
  chainId: BigNumberish
  messageId: string
}

export type GetBundleProofFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetRelayMessageDataFromTransactionHashInput = {
  chainId: BigNumberish
  transactionHash: string
}

export type GetRelayMessagePopulatedTxInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromAddress: string,
  toAddress: string,
  toCalldata: string,
  bundleProof: BundleProof
}

export type GetMessageCalldataInput = {
  chainId: BigNumberish
  messageId: string
}

export type GetIsMessageIdRelayedInput = {
  messageId: string
  fromChainId: BigNumberish
  toChainId: BigNumberish
}

export type GetRelayFeeInput = {
  fromChainId: BigNumberish
  toChainId: BigNumberish
  toAddress: string,
  toCalldata: string
}

export type RelayMessageData = {
  fromChainId: BigNumberish
  toAddress: string
  fromAddress: string
  toCalldata: string
  toChainId: BigNumberish
  bundleProof: BundleProof
}

export type ExecuteInput = {
  messageId: string
  fromChainId: BigNumberish
  toChainId: BigNumberish
  fromAddress: string
  toAddress: string
  toCalldata: string
}

export enum EventName {
  BundleCommitted = 'BundleCommitted',
  BundleForwarded = 'BundleForwarded',
  BundleReceived = 'BundleReceived',
  BundleSet = 'BundleSet',
  FeesSentToHub = 'FeesSentToHub',
  MessageBundled = 'MessageBundled',
  MessageExecuted = 'MessageExecuted',
  MessageSent = 'MessageSent',
}

export type MessengerConfig = BaseConfig

export class Messenger extends Base {
  gasPriceOracle: GasPriceOracle

  constructor({ contractAddresses, signersOrProviders }: MessengerConfig) {
    super({ contractAddresses, signersOrProviders })

    this.gasPriceOracle = new GasPriceOracle(this.network)
  }

  getSpokeMessageBridgeContractAddress (chainId: BigNumberish): string {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'spokeCoreMessenger')
  }

  getHubMessageBridgeContractAddress (chainId: BigNumberish): string {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'hubCoreMessenger')
  }

  getExecutorContractAddress (chainId: BigNumberish): string {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'executor')
  }

  getEventNames (): string[] {
    return Object.keys(EventName)
  }

  getEventFetcher(eventName: EventName, chainId: BigNumberish) {
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    let address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (eventName === EventName.BundleForwarded || eventName === EventName.BundleReceived) {
      address = this.getHubMessageBridgeContractAddress(chainId)
    }
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }

    const eventFetcher: Record<EventName, any> = {
      [EventName.BundleCommitted]: BundleCommittedEventFetcher,
      [EventName.BundleForwarded]: BundleForwardedEventFetcher,
      [EventName.BundleReceived]: BundleReceivedEventFetcher,
      [EventName.BundleSet]: BundleSetEventFetcher,
      [EventName.FeesSentToHub]: FeesSentToHubEventFetcher,
      [EventName.MessageBundled]: MessageBundledEventFetcher,
      [EventName.MessageExecuted]: MessageExecutedEventFetcher,
      [EventName.MessageSent]: MessageSentEventFetcher,
    }

    const EventFetcherClass = eventFetcher[eventName]
    if (!EventFetcherClass) {
      throw new CustomError(`Event fetcher not found for event name: ${eventName}`)
    }

    return new EventFetcherClass(provider, chainId, this.batchBlocks, address)
  }

  async getBundleCommittedEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<BundleCommitted>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.BundleCommitted, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getBundleForwardedEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<BundleForwarded>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.BundleForwarded, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getBundleReceivedEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<BundleReceived>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.BundleReceived, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getBundleSetEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<BundleSet>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.BundleSet, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getFeesSentToHubEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<FeesSentToHub>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.FeesSentToHub, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getMessageBundledEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<MessageBundled>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageBundled, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getMessageExecutedEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<MessageExecuted>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageExecuted, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getMessageSentEvents ({ chainId, fromBlock, toBlock }: GetEventsInput): Promise<EthersEventWithDecodedTypes<MessageSent>[]> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!fromBlock) {
      throw new InputError('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageSent, chainId)
    return eventFetcher.getEventsForRange(fromBlock, toBlock)
  }

  async getHasAuctionStarted ({ fromChainId, bundleCommittedEvent }: HasAuctionStartedInput): Promise<boolean> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!bundleCommittedEvent) {
      throw new InputError('bundleCommittedEvent is required')
    }

    const { commitTime, toChainId } = bundleCommittedEvent
    const exitTime = await this.getSpokeExitTime({ fromChainId, toChainId })
    return commitTime + exitTime < DateTime.utc().toSeconds()
  }

  async getSpokeExitTime ({ fromChainId, toChainId }: GetSpokeExitTimeInput): Promise<number> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    const provider = this.getProvider(toChainId)
    if (!provider) {
      throw new InputError(`Invalid chainId "${toChainId}", provider not found`)
    }

    const address = this.getHubMessageBridgeContractAddress(toChainId)
    if (!address) {
      throw new InputError(`Invalid chain: ${toChainId}`)
    }

    const hubMessageBridge = HubMessageBridge__factory.connect(address, provider)

    try {
      const exitTime = await hubMessageBridge.getSpokeExitTime(fromChainId)
      const exitTimeSeconds = Number(exitTime.toString())
      return exitTimeSeconds
    } catch (err: unknown) {
      return this.throwError(err) as number
    }
  }

  // relayReward = (block.timestamp - relayWindowStart) * feesCollected / relayWindow
  // reference: https://github.com/hop-protocol/contracts-v2/blob/master/contracts/bridge/FeeDistributor/FeeDistributor.sol#L83-L106
  async getRelayReward ({ fromChainId, bundleCommittedEvent }: GetRelayRewardInput): Promise<number> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    const provider = this.getProvider(fromChainId)
    if (!provider) {
      throw new InputError(`Invalid chainId "${fromChainId}", provider not found`)
    }

    const { commitTime, bundleFees, toChainId } = bundleCommittedEvent
    const feesCollected = Number(formatEther(bundleFees))
    const { timestamp: blockTimestamp } = await provider.getBlock('latest')
    const spokeExitTime = await this.getSpokeExitTime({ fromChainId, toChainId })
    const relayWindowStart = commitTime + spokeExitTime
    const relayWindow = await this.getRelayWindowHours() * 60 * 60
    const relayReward = (blockTimestamp - relayWindowStart) * feesCollected / relayWindow
    return relayReward
  }

  async getEstimatedTxCostForForwardMessage ({ chainId }: GetEstimatedTxCostForForwardMessageInput): Promise<number> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new InputError(`Invalid chainId "${chainId}", provider not found`)
    }

    const estimatedGas = BigNumber.from(1_000_000) // TODO
    const gasPrice = await provider.getGasPrice()
    const estimatedTxCost = estimatedGas.mul(gasPrice)
    return Number(formatUnits(estimatedTxCost, 9))
  }

  async getShouldAttemptForwardMessage ({ fromChainId, bundleCommittedEvent }: ShouldAttemptForwardMessageInput): Promise<boolean> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId: ${fromChainId}`)
    }

    if (!bundleCommittedEvent) {
      throw new InputError('bundleCommittedEvent is required')
    }

    const estimatedTxCost = await this.getEstimatedTxCostForForwardMessage({ chainId: fromChainId })
    const relayReward = await this.getRelayReward({ fromChainId, bundleCommittedEvent })
    const txOk = relayReward > estimatedTxCost
    const timeOk = await this.getHasAuctionStarted({ fromChainId, bundleCommittedEvent })
    const shouldAttempt = txOk && timeOk
    return shouldAttempt
  }

  async exitBundle ({ fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash }: ExitBundleInput): Promise<providers.TransactionResponse> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId: ${fromChainId}`)
    }

    if (bundleCommittedTransactionHash) {
      if (!this.utils.isValidTxHash(bundleCommittedTransactionHash)) {
        throw new InputError(`Invalid transaction hash "${bundleCommittedTransactionHash}"`)
      }
    } else if (bundleCommittedEvent) {
      bundleCommittedTransactionHash = bundleCommittedEvent.transactionHash ?? bundleCommittedEvent.context?.transactionHash
    } else {
      throw new InputError('bundleCommittedEvent or bundleCommittedTransactionHash is required')
    }
    if (!bundleCommittedTransactionHash) {
      throw new InputError('expected bundle comitted transaction hash')
    }

    // const l1Provider = this.getProvider(this.l1ChainId)
    // const l2Provider = this.getProvider(fromChainId)
    // TODO
    const exitRelayer : ExitRelayer | undefined = undefined
    if (!exitRelayer) {
      throw new ConfigError(`Exit relayer not found for chainId "${fromChainId}"`)
    }
    // const tx = await exitRelayer.exitTx(bundleCommittedTransactionHash)
    // return tx
    return null as any
  }

  async getIsL2TxHashExited ({ fromChainId, transactionHash }: GetIsL2TxHashExitedInput): Promise<boolean> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }

    // const l1Provider = this.getProvider(this.l1ChainId)
    // const l2Provider = this.getProvider(fromChainId)
    const exitRelayer : ExitRelayer | undefined = undefined
    if (!exitRelayer) {
      throw new ConfigError(`Exit relayer not found for chainId "${fromChainId}"`)
    }

    // return exitRelayer.getIsL2TxHashExited(transactionHash)
    return null as any
  }

  get populateTransaction() {
    return {
      sendMessage: async ({ fromChainId, toChainId, toAddress, toCalldata = '0x' }: GetSendMessagePopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
        }

        if (!this.utils.isValidChainId(toChainId)) {
          throw new InputError(`Invalid toChainId "${toChainId}"`)
        }

        if (fromChainId?.toString() === toChainId?.toString()) {
          throw new InputError('fromChainId and toChainId must be different')
        }

        if (!toAddress) {
          throw new InputError('toAddress is required')
        }

        if (!this.utils.isValidAddress(toAddress)) {
          throw new InputError(`Invalid toAddress "${toAddress}"`)
        }

        if (!toCalldata) {
          toCalldata = '0x'
        }

        if (!this.utils.isValidBytes(toCalldata)) {
          throw new InputError(`Invalid toCalldata "${toCalldata}"`)
        }

        const provider = this.getProvider(fromChainId)
        if (!provider) {
          throw new InputError(`Invalid chainId, "${fromChainId}", provider not found`)
        }

        const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
        if (!address) {
          throw new ConfigError(`Invalid address, not found for chainId "${fromChainId}"`)
        }

        const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider)
        const txData = await spokeMessageBridge.populateTransaction.dispatchMessage(toChainId, toAddress, toCalldata)
        const value = await this.getMessageFee({ fromChainId, toChainId })

        return {
          ...txData,
          value,
          ...txOverrides,
          chainId: Number(fromChainId)
        }
      },

      relayMessage: async ({ fromChainId, toChainId, fromAddress, toAddress, toCalldata, bundleProof }: GetRelayMessagePopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
        }

        if (!this.utils.isValidChainId(toChainId)) {
          throw new InputError(`Invalid toChainId "${toChainId}"`)
        }

        if (!this.utils.isValidAddress(toAddress)) {
          throw new InputError(`Invalid toAddress "${toAddress}"`)
        }

        if (!this.utils.isValidBytes(toCalldata)) {
          throw new InputError(`Invalid toCalldata "${toCalldata}"`)
        }

        if (!bundleProof) {
          throw new InputError('bundleProof is required')
        }

        if (!this.isValidBundleProof(bundleProof)) {
          throw new InputError('Invalid bundleProof')
        }

        const provider = this.getProvider(toChainId)
        if (!provider) {
          throw new InputError(`Invalid chainId "${toChainId}", provider not found`)
        }

        const address = this.getHubMessageBridgeContractAddress(toChainId)
        if (!address) {
          throw new InputError(`Invalid chainId "${toChainId}", address not found`)
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
          ...txOverrides,
          chainId: Number(toChainId)
        }
      },

      bundleExit: async ({ fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash }: GetBundleExitPopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
        }

        if (bundleCommittedTransactionHash) {
          if (!this.utils.isValidTxHash(bundleCommittedTransactionHash)) {
            throw new InputError(`Invalid transaction hash "${bundleCommittedTransactionHash}"`)
          }
        } else if (bundleCommittedEvent) {
          bundleCommittedTransactionHash = bundleCommittedEvent.transactionHash ?? bundleCommittedEvent.context?.transactionHash
        } else {
          throw new InputError('bundleCommittedEvent or bundleCommittedTransactionHash is required')
        }
        if (!bundleCommittedTransactionHash) {
          throw new InputError('expected bundle comitted transaction hash')
        }

        // const l1Provider = this.getProvider(this.l1ChainId)
        // const l2Provider = this.getProvider(fromChainId)
        const exitRelayer : ExitRelayer | undefined = undefined
        if (!exitRelayer) {
          throw new ConfigError(`Exit relayer not found for chainId "${fromChainId}"`)
        }
        // const txData = await exitRelayer.getExitPopulatedTx(bundleCommittedTransactionHash) as providers.TransactionRequest

        return {
          // ...txData,
          ...txOverrides,
          chainId: Number(fromChainId)
        }
      },

      execute: async ({ fromChainId, toChainId, messageId, fromAddress, toAddress, toCalldata }: ExecuteInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
        }

        if (!this.utils.isValidChainId(toChainId)) {
          throw new InputError(`Invalid toChainId "${toChainId}"`)
        }

        if (!this.utils.isValidBytes32(messageId)) {
          throw new InputError(`Invalid messageId "${messageId}"`)
        }

        if (!this.utils.isValidAddress(fromAddress)) {
          throw new InputError(`Invalid fromAddress "${fromAddress}"`)
        }

        if (!this.utils.isValidAddress(toAddress)) {
          throw new InputError(`Invalid toAddress "${toAddress}"`)
        }

        if (!this.utils.isValidBytes(toCalldata)) {
          throw new InputError(`Invalid calldata "${toCalldata}"`)
        }

        const address = this.getExecutorContractAddress(toChainId)
        if (!address) {
          throw new InputError(`Invalid address, not found for chainId "${toChainId}"`)
        }

        const provider = this.getProvider(toChainId)
        if (!provider) {
          throw new InputError(`Invalid chainId, "${toChainId}", provider not found`)
        }

        const mockExecutor = MockExecutor__factory.connect(address, provider)
        const txData = await mockExecutor.populateTransaction.execute(messageId, fromChainId, fromAddress, toAddress, toCalldata)

        return {
          ...txData,
          gasLimit: 1_000_000,
          ...txOverrides,
          chainId: Number(toChainId)
        }
      }
    }
  }

  async sendMessage (input: GetSendMessagePopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.sendMessage(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async relayMessage (input: GetRelayMessagePopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.relayMessage(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async bundleExit (input: GetBundleExitPopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.bundleExit(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  // reference: https://github.com/hop-protocol/contracts-v2/blob/cdc3377d6a1f964554ba0e6e1fef0b504d43fc6a/contracts/bridge/FeeDistributor/FeeDistributor.sol#L42
  async getRelayWindowHours (): Promise<number> {
    return 12
  }

  async getRouteData ({ fromChainId, toChainId }: GetRouteDataInput): Promise<RouteData> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new InputError('fromChainId and toChainId must be different')
    }

    const provider = this.getProvider(fromChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${fromChainId}"`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider)

    try {
      const routeData = await spokeMessageBridge.routeData(toChainId)

      return {
        messageFee: routeData.messageFee,
        maxBundleMessages: Number(routeData.maxBundleMessages.toString())
      }
    } catch (err: unknown) {
      return this.throwError(err) as RouteData
    }
  }

  async getMessageFee ({ fromChainId, toChainId }: GetMessageFeeInput): Promise<BigNumber> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new InputError('fromChainId and toChainId must be different')
    }

    const routeData = await this.getRouteData({ fromChainId, toChainId })
    return routeData.messageFee
  }

  async getMaxBundleMessageCount ({ fromChainId, toChainId }: GetMaxBundleMessageCountInput): Promise<number> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new InputError('fromChainId and toChainId must be different')
    }

    const routeData = await this.getRouteData({ fromChainId, toChainId })
    return routeData.maxBundleMessages
  }

  async getIsBundleSet ({ fromChainId, toChainId, bundleId }: GetIsBundleSetInput): Promise<boolean> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    const provider = this.getProvider(toChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${toChainId}"`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(toChainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${toChainId}"`)
    }

    const hubMessageBridge = HubMessageBridge__factory.connect(address, provider)

    try {
      const entity = await hubMessageBridge.bundles(bundleId)
      if (!entity) {
        return false
      }

      return BigNumber.from(entity.root).gt(0) && Number(entity.fromChainId.toString()) === fromChainId
    } catch (err: unknown) {
      return this.throwError(err) as boolean
    }
  }

  async getMessageSentEventsFromTransactionReceipt ({ chainId, receipt }: GetMessageSentEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<MessageSent>[] | null> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!receipt) {
      throw new InputError('receipt is required')
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(chainId)
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageSent, chainId)
    return eventFetcher.decodeEventsFromTransactionReceipt(receipt)
  }

  async getMessageSentEventFromTransactionReceipt ({ chainId, receipt }: GetMessageSentEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<MessageSent> | null> {
    const events = await this.getMessageSentEventsFromTransactionReceipt({ chainId, receipt })
    return events?.[0] ?? null
  }

  async getMessageSentEventFromTransactionHash ({ chainId, transactionHash }: GetMessageSentEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<MessageSent> | null> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const receipt = await provider.getTransactionReceipt(transactionHash)
    return this.getMessageSentEventFromTransactionReceipt({ chainId, receipt })
  }

  async getMessageBundledEventFromMessageId ({ chainId, messageId }: GetMessageBundledEventFromMessageIdInput): Promise<EthersEventWithDecodedTypes<MessageBundled> | null> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageBundled, chainId)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getMessageSentEventFromMessageId ({ chainId, messageId }: GetMessageSentEventFromMessageIdInput): Promise<EthersEventWithDecodedTypes<MessageSent> | null> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId ${chainId}""`)
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageSent, chainId)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock, { returnOnFirstMatch: true })
    return events?.[0] ?? null
  }

  // note: this is broken because messageId is not indexed in event
  async getMessageExecutedEventFromMessageId ({ chainId, messageId }: GetMessageExecutedEventFromMessageIdInput): Promise<EthersEventWithDecodedTypes<MessageExecuted> | null>{
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageExecuted, chainId)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getMessageBundledEventFromTransactionHash ({ chainId, transactionHash }: GetMessageBundledEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<MessageBundled> | null> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const receipt = await provider.getTransactionReceipt(transactionHash)
    const eventFetcher = this.getEventFetcher(EventName.MessageBundled, chainId)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getMessageIdFromTransactionHash ({ chainId, transactionHash }: GetMessageIdFromTransactionHashInput): Promise<string> {
    if (!chainId) {
      throw new InputError('chainId is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId: ${chainId}`)
    }

    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }

    const event = await this.getMessageSentEventFromTransactionHash({ chainId, transactionHash })
    if (!event) {
      throw new CustomError('event not found for transaction hash')
    }

    return event.decoded.messageId
  }

  async getMessageBundleIdFromMessageId ({ chainId, messageId }: GetMessageBundleIdFromMessageIdInput): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageBundledEventFromMessageId({ chainId, messageId })
    if (!event) {
      throw new CustomError('event not found for messageId')
    }

    return event.decoded.bundleId
  }

  async getMessageBundleIdFromTransactionHash ({ chainId, transactionHash }: GetMessageBundleIdFromTransactionHashInput): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transactionHash "${transactionHash}"`)
    }

    const event = await this.getMessageBundledEventFromTransactionHash({ chainId, transactionHash })
    if (!event) {
      throw new CustomError('event not found for transaction hash')
    }

    return event.decoded.bundleId
  }

  async getMessageTreeIndexFromMessageId ({ chainId, messageId }: GetMessageTreeIndexFromMessageIdInput): Promise<number> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageBundledEventFromMessageId({ chainId, messageId })
    if (!event) {
      throw new CustomError('event not found for messageId')
    }

    return event.decoded.treeIndex
  }

  async getMessageTreeIndexFromTransactionHash ({ chainId, transactionHash }: GetMessageTreeIndexFromTransactionHashInput): Promise<number> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transactionHash "${transactionHash}"`)
    }

    const event = await this.getMessageBundledEventFromTransactionHash({ chainId, transactionHash })
    if (!event) {
      throw new CustomError('event not found for transaction hash')
    }

    return event.decoded.treeIndex
  }

  async getMessageBundledEventsForBundleId ({ chainId, bundleId }: GetMessageBundledEventsForBundleIdInput): Promise<EthersEventWithDecodedTypes<MessageBundled>[]> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(bundleId)) {
      throw new InputError(`Invalid bundleId "${bundleId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageBundled, chainId)
    const filter = eventFetcher.getBundleIdFilter(bundleId)
    const fromBlock = 0
    const toBlock = await provider.getBlockNumber()
    const events = eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock)
    return events
  }

  async getMessageIdsForBundleId ({ chainId, bundleId }: GetMessageIdsForBundleIdInput): Promise<string[]> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(bundleId)) {
      throw new InputError(`Invalid bundleId "${bundleId}"`)
    }

    const messageEvents = await this.getMessageBundledEventsForBundleId({ chainId, bundleId })
    const messageIds = messageEvents.map(event => event.decoded.messageId)
    return messageIds
  }

  async getMerkleProofForMessageId ({ messageIds, targetMessageId }: GetMerkleProofForMessageIdInput) {
    if (!targetMessageId) {
      throw new InputError('targetMessageId is required')
    }

    if (!Array.isArray(messageIds)) {
      throw new InputError('messageIds is required and must be an array')
    }

    if (!messageIds.every(this.utils.isValidBytes32)) {
      throw new InputError('Invalid messageIds')
    }

    if (!this.utils.isValidBytes32(targetMessageId)) {
      throw new InputError(`Invalid targetMessageId "${targetMessageId}"`)
    }

    const tree = MerkleTree.from(messageIds)
    const proof = tree.getHexProof(targetMessageId)
    return proof
  }

  async getBundleProofFromMessageId ({ chainId, messageId }: GetBundleProofFromMessageIdInput): Promise<BundleProof> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageBundledEventFromMessageId({ chainId, messageId })
    if (!event) {
      throw new CustomError(`MessageBundled event not found for messageId "${messageId}"`)
    }

    const { treeIndex, bundleId } = event.decoded
    const messageIds = await this.getMessageIdsForBundleId({ chainId, bundleId })
    const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId: messageId })
    const totalLeaves = messageIds.length

    return {
      bundleId,
      treeIndex,
      siblings,
      totalLeaves
    }
  }

  async getBundleProofFromTransactionHash ({ chainId, transactionHash }: GetBundleProofFromTransactionHashInput): Promise<BundleProof> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transactionHash "${transactionHash}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    // TODO: handle case for when multiple message events in single transaction
    const messageBundledEvent = await this.getMessageBundledEventFromTransactionHash({ chainId, transactionHash })
    if (!messageBundledEvent) {
      throw new CustomError(`MessageBundled event not found for transaction hash "${transactionHash}"`)
    }

    const { treeIndex, bundleId } = messageBundledEvent.decoded
    const targetMessageId = await this.getMessageIdFromTransactionHash({ chainId, transactionHash })
    const messageIds = await this.getMessageIdsForBundleId({ chainId, bundleId })
    const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId })
    const totalLeaves = messageIds.length

    return {
      bundleId,
      treeIndex,
      siblings,
      totalLeaves
    }
  }

  async getRelayMessageDataFromTransactionHash ({ chainId, transactionHash }: GetRelayMessageDataFromTransactionHashInput): Promise<RelayMessageData> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }

    const event = await this.getMessageSentEventFromTransactionHash({ chainId, transactionHash })
    if (!event) {
      throw new CustomError(`Event not found for transaction hash "${transactionHash}"`)
    }

    const bundleProof = await this.getBundleProofFromTransactionHash({ chainId, transactionHash })

    return {
      fromChainId: chainId,
      toAddress: event.decoded.to,
      fromAddress: event.decoded.from,
      toCalldata: event.decoded.data,
      toChainId: event.decoded.toChainId,
      bundleProof,
    }
  }

  async getMessageCalldataFromMessageId ({ chainId, messageId }: GetMessageCalldataInput): Promise<string> {
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageSentEventFromMessageId({ chainId, messageId })
    if (!event) {
      throw new CustomError(`Event not found for messageId "${messageId}"`)
    }

    return event.data
  }

  async getIsMessageIdRelayed ({ fromChainId, toChainId, messageId }: GetIsMessageIdRelayedInput): Promise<boolean> {
    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId: ${fromChainId}`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId: ${toChainId}`)
    }

    const event = await this.getMessageExecutedEventFromMessageId({ messageId, chainId: toChainId })
    return !!event
  }

  async getRelayFee ({
    fromChainId,
    toChainId,
    toAddress,
    toCalldata
  }: GetRelayFeeInput): Promise<BigNumber> {
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }
    if (!this.utils.isValidAddress(toAddress)) {
      throw new InputError(`Invalid toAddress "${toAddress}"`)
    }
    if (!this.utils.isValidBytes(toCalldata)) {
      throw new InputError(`Invalid toCalldata "${toCalldata}"`)
    }

    const populatedTx = await this.populateTransaction.sendMessage({
      fromChainId,
      toChainId,
      toAddress,
      toCalldata
    })

    const timestamp: number | null = null
    const txData = (populatedTx.data ?? '0x').toString()
    const chain = this.utils.getChainSlug(toChainId)
    const provider = this.getProvider(toChainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${toChainId}"`)
    }
    const gasLimit = await provider.estimateGas(populatedTx)
    const feeData = await this.gasPriceOracle.estimateGasCost(chain, timestamp, gasLimit.toNumber(), txData)
    return parseEther(feeData.data.gasCost)
  }

  isValidBundleProof (bundleProof: BundleProof): boolean {
    return (
      bundleProof &&
      this.utils.isValidBytes32(bundleProof.bundleId) &&
      typeof bundleProof.treeIndex === 'number' &&
      Array.isArray(bundleProof.siblings) &&
      bundleProof.siblings.every(this.utils.isValidBytes32) &&
      typeof bundleProof.totalLeaves === 'number'
    )
  }

  async execute (input: ExecuteInput): Promise<providers.TransactionResponse>  {
    const txData = await this.populateTransaction.execute(input)
    return this.sendTransaction(txData)
  }

  static getBundleCommittedEventSignature (): string {
    const eventFetcher = new BundleCommittedEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getBundleForwardedEventSignature (): string {
    const eventFetcher = new BundleForwardedEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getBundleReceivedEventSignature (): string {
    const eventFetcher = new BundleReceivedEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getBundleSetEventSignature (): string {
    const eventFetcher = new BundleSetEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getFeesSentToHubEventSignature (): string {
    const eventFetcher = new FeesSentToHubEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getMessageBundledEventSignature (): string {
    const eventFetcher = new MessageBundledEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getMessageExecutedEventSignature (): string {
    const eventFetcher = new MessageExecutedEventFetcher()
    return eventFetcher.getTopic0()
  }

  static getMessageSentEventSignature (): string {
    const eventFetcher = new MessageSentEventFetcher()
    return eventFetcher.getTopic0()
  }
}
