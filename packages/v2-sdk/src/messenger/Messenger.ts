import { Base, TxOverrides, SignersOrProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { BigNumber, BigNumberish, providers, utils, Event as EthersEvent, Signer } from 'ethers'
import { getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { EthersEventWithDecodedTypesAndContext, EthersEventWithDecodedTypes } from '#events/index.js'
import { BundleCommitted, BundleCommittedEventFetcher } from '#messenger/events/BundleCommitted.js'
import { BundleForwardedEventFetcher } from '#messenger/events/BundleForwarded.js'
import { BundleReceivedEventFetcher } from '#messenger/events/BundleReceived.js'
import { BundleSetEventFetcher } from '#messenger/events/BundleSet.js'
import { DateTime } from 'luxon'
import { ExitRelayer } from '#exitRelayers/ExitRelayer.js'
import { HubMessageBridge__factory } from '#contracts/factories/HubMessageBridge__factory.js'
import { MerkleTree } from '#utils/MerkleTree.js'
import { MessageBundled, MessageBundledEventFetcher } from '#messenger/events/MessageBundled.js'
import { MessageExecutedEventFetcher } from '#messenger/events/MessageExecuted.js'
import { MessageSent, MessageSentEventFetcher } from '#messenger/events/MessageSent.js'
import { SpokeMessageBridge__factory } from '#contracts/factories/SpokeMessageBridge__factory.js'
import { MockExecutor__factory } from '#contracts/factories/MockExecutor__factory.js'
import { FeesSentToHubEventFetcher } from '#messenger/events/FeesSentToHub.js'
import { GasPriceOracle } from '#gasPriceOracle/index.js'
import { ConfigError, InputError, CustomError } from '#error/index.js'

const { formatEther, formatUnits, parseEther } = utils

export type BundleProof = {
  bundleId: string
  treeIndex: number
  siblings: string[]
  totalLeaves: number
}

export type HasAuctionStartedInput = {
  bundleCommittedEvent: BundleCommitted
}

export type GetSpokeExitTimeInput = {
  spokeChainId: BigNumberish
}

export type GetRelayRewardInput = {
  bundleCommittedEvent: BundleCommitted
}

export type ShouldAttemptForwardMessageInput = {
  fromChainId: BigNumberish
  bundleCommittedEvent: BundleCommitted
}

export type GetBundleExitPopulatedTxInput = {
  bundleCommittedEvent?: EthersEventWithDecodedTypesAndContext<BundleCommitted>
  bundleCommittedTransactionHash?: string
}

export type ExitBundleInput = {
  bundleCommittedEvent?: EthersEventWithDecodedTypesAndContext<BundleCommitted>
  bundleCommittedTransactionHash?: string
}

export type RouteData = {
  messageFee: BigNumber
  maxBundleMessages: number
}

export type GetIsL2TxHashExitedInput = {
  transactionHash: string
}

export type GetSendMessagePopulatedTxInput = {
  toChainId: BigNumberish
  toAddress: string
  toCalldata: string
}

export type GetEventContextInput = {
  event: EthersEvent
}

export type GetRouteDataInput = {
  toChainId: BigNumberish
}

export type GetMessageFeeInput = {
  toChainId: BigNumberish
}

export type GetMaxBundleMessageCountInput = {
  toChainId: BigNumberish
}

export type GetIsBundleSetInput = {
  fromChainId: BigNumberish
  bundleId: string
}

export type GetMessageSentEventFromTransactionReceiptInput = {
  receipt: providers.TransactionReceipt
}

export type GetMessageSentEventFromTransactionHashInput = {
  transactionHash: string
}

export type GetMessageBundledEventFromMessageIdInput = {
  messageId: string
}

export type GetMessageSentEventFromMessageIdInput = {
  messageId: string
}

export type GetMessageExecutedEventFromMessageIdInput = {
  messageId: string
}

export type GetMessageBundledEventFromTransactionHashInput = {
  transactionHash: string
}

export type GetMessageIdFromTransactionHashInput = {
  transactionHash: string
}

export type GetMessageBundleIdFromMessageIdInput = {
  messageId: string
}

export type GetMessageBundleIdFromTransactionHashInput = {
  transactionHash: string
}

export type GetMessageTreeIndexFromMessageIdInput = {
  messageId: string
}

export type GetMessageTreeIndexFromTransactionHashInput = {
  transactionHash: string
}

export type GetMessageBundledEventsForBundleIdInput = {
  bundleId: string
}

export type GetMessageIdsForBundleIdInput = {
  bundleId: string
}

export type GetMerkleProofForMessageIdInput = {
  messageIds: string[],
  targetMessageId: string
}

export type GetBundleProofFromMessageIdInput = {
  messageId: string
}

export type GetBundleProofFromTransactionHashInput = {
  transactionHash: string
}

export type GetRelayMessageDataFromTransactionHashInput = {
  transactionHash: string
}

export type GetRelayMessagePopulatedTxInput = {
  fromChainId: BigNumberish
  fromAddress: string,
  toAddress: string,
  toCalldata: string,
  bundleProof: BundleProof
}

export type GetMessageCalldataInput = {
  messageId: string
}

export type GetIsMessageIdRelayedInput = {
  messageId: string
}

export type GetRelayFeeInput = {
  toChainId: BigNumberish
  toAddress: string,
  toCalldata: string
}

export type RelayMessageData = {
  fromChainId: BigNumberish
  fromAddress: string
  toAddress: string
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

export type MessengerConstructorInput = {
  network?: string
  gasPriceMultiplier?: number
  signersOrProviders?: SignersOrProviders
  contractAddresses?: Addresses
  signerOrProvider?: Signer | providers.Provider
  chainId: BigNumberish
}

export class Messenger extends Base {
  static EventName  = EventName
  chainId: BigNumberish

  gasPriceOracle: GasPriceOracle

  constructor({ contractAddresses, chainId, signerOrProvider, signersOrProviders, network }: MessengerConstructorInput) {
    super({
      contractAddresses,
      signersOrProviders: {
        [chainId?.toString()]: signerOrProvider!
      },
      network: network ?? Messenger.deriveNetwork(chainId)
    })

    this.chainId = chainId
    this.gasPriceOracle = new GasPriceOracle(this.network)
  }

  getSpokeMessageBridgeContractAddress (): string {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'spokeCoreMessenger')
  }

  getHubMessageBridgeContractAddress (): string {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'hubCoreMessenger')
  }

  getExecutorContractAddress (): string {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'executor')
  }

  getEventNames (): string[] {
    return Object.keys(EventName)
  }

  getEventFetcher(eventName: EventName | string) {
    const chainId = this.chainId
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}, method: getEventFetcher, eventName: ${eventName}`)
    }

    let address = this.getSpokeMessageBridgeContractAddress()
    if (eventName === EventName.BundleForwarded || eventName === EventName.BundleReceived) {
      address = this.getHubMessageBridgeContractAddress()
    }
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}, method: getEventFetcher, eventName: ${eventName}`)
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

    const EventFetcherClass = eventFetcher[eventName as EventName]
    if (!EventFetcherClass) {
      throw new CustomError(`Event fetcher not found for event name: ${eventName}`)
    }

    return new EventFetcherClass(provider, chainId, this.batchBlocks, address)
  }

  async getHasAuctionStarted ({ bundleCommittedEvent }: HasAuctionStartedInput): Promise<boolean> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!bundleCommittedEvent) {
      throw new InputError('bundleCommittedEvent is required')
    }

    const { commitTime, toChainId } = bundleCommittedEvent
    const exitTime = await this.getSpokeExitTime({ spokeChainId: toChainId })
    return commitTime + exitTime < DateTime.utc().toSeconds()
  }

  async getSpokeExitTime ({ spokeChainId }: GetSpokeExitTimeInput): Promise<number> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidChainId(spokeChainId)) {
      throw new InputError(`Invalid spokeChainId "${spokeChainId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new InputError(`Invalid chainId "${chainId}", provider not found`)
    }

    const address = this.getHubMessageBridgeContractAddress()
    if (!address) {
      throw new InputError(`Invalid chain: ${chainId}`)
    }

    const hubMessageBridge = HubMessageBridge__factory.connect(address, provider)

    try {
      const exitTime = await hubMessageBridge.getSpokeExitTime(spokeChainId)
      const exitTimeSeconds = Number(exitTime.toString())
      return exitTimeSeconds
    } catch (err: unknown) {
      return this.throwError(err) as number
    }
  }

  // relayReward = (block.timestamp - relayWindowStart) * feesCollected / relayWindow
  // reference: https://github.com/hop-protocol/contracts-v2/blob/master/contracts/bridge/FeeDistributor/FeeDistributor.sol#L83-L106
  async getRelayReward ({ bundleCommittedEvent }: GetRelayRewardInput): Promise<number> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new InputError(`Invalid chainId "${chainId}", provider not found`)
    }

    const { commitTime, bundleFees, toChainId } = bundleCommittedEvent
    const feesCollected = Number(formatEther(bundleFees))
    const { timestamp: blockTimestamp } = await provider.getBlock('latest')
    const spokeExitTime = await this.getSpokeExitTime({ spokeChainId: toChainId })
    const relayWindowStart = commitTime + spokeExitTime
    const relayWindow = await this.getRelayWindowHours() * 60 * 60
    const relayReward = (blockTimestamp - relayWindowStart) * feesCollected / relayWindow
    return relayReward
  }

  async getEstimatedTxCostForForwardMessage (): Promise<number> {
    const chainId = this.chainId
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

  async getShouldAttemptForwardMessage ({ bundleCommittedEvent }: ShouldAttemptForwardMessageInput): Promise<boolean> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!bundleCommittedEvent) {
      throw new InputError('bundleCommittedEvent is required')
    }

    const estimatedTxCost = await this.getEstimatedTxCostForForwardMessage()
    const relayReward = await this.getRelayReward({ bundleCommittedEvent })
    const txOk = relayReward > estimatedTxCost
    const timeOk = await this.getHasAuctionStarted({ bundleCommittedEvent })
    const shouldAttempt = txOk && timeOk
    return shouldAttempt
  }

  async exitBundle ({ bundleCommittedEvent, bundleCommittedTransactionHash }: ExitBundleInput): Promise<providers.TransactionResponse> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId: ${chainId}`)
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
    // const l2Provider = this.getProvider(chainId)
    // TODO
    const exitRelayer : ExitRelayer | undefined = undefined
    if (!exitRelayer) {
      throw new ConfigError(`Exit relayer not found for chainId "${chainId}"`)
    }
    // const tx = await exitRelayer.exitTx(bundleCommittedTransactionHash)
    // return tx
    return null as any
  }

  async getIsL2TxHashExited ({ transactionHash }: GetIsL2TxHashExitedInput): Promise<boolean> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }

    // const l1Provider = this.getProvider(this.l1ChainId)
    // const l2Provider = this.getProvider(chainId)
    const exitRelayer : ExitRelayer | undefined = undefined
    if (!exitRelayer) {
      throw new ConfigError(`Exit relayer not found for chainId "${chainId}"`)
    }

    // return exitRelayer.getIsL2TxHashExited(transactionHash)
    return null as any
  }

  get populateTransaction() {
    return {
      sendMessage: async ({ toChainId, toAddress, toCalldata = '0x' }: GetSendMessagePopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const fromChainId = this.chainId
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

        const address = this.getSpokeMessageBridgeContractAddress()
        if (!address) {
          throw new ConfigError(`Invalid address, not found for chainId "${fromChainId}"`)
        }

        const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider)
        const txData = await spokeMessageBridge.populateTransaction.dispatchMessage(toChainId, toAddress, toCalldata)
        const value = await this.getMessageFee({ toChainId })

        return {
          ...txData,
          value,
          ...txOverrides,
          chainId: Number(fromChainId)
        }
      },

      relayMessage: async ({ fromChainId, fromAddress, toAddress, toCalldata, bundleProof }: GetRelayMessagePopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
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

        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new InputError(`Invalid chainId "${chainId}", provider not found`)
        }

        const address = this.getHubMessageBridgeContractAddress()
        if (!address) {
          throw new InputError(`Invalid chainId "${chainId}", address not found`)
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
          chainId: Number(chainId)
        }
      },

      bundleExit: async ({ bundleCommittedEvent, bundleCommittedTransactionHash }: GetBundleExitPopulatedTxInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const fromChainId = this.chainId
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

      execute: async ({ fromChainId, messageId, fromAddress, toAddress, toCalldata }: ExecuteInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new InputError(`Invalid fromChainId "${fromChainId}"`)
        }

        if (!this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
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

        const address = this.getExecutorContractAddress()
        if (!address) {
          throw new InputError(`Invalid address, not found for chainId "${fromChainId}"`)
        }

        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new InputError(`Invalid chainId, "${chainId}", provider not found`)
        }

        const mockExecutor = MockExecutor__factory.connect(address, provider)
        const txData = await mockExecutor.populateTransaction.execute(messageId, fromChainId, fromAddress, toAddress, toCalldata)

        return {
          ...txData,
          gasLimit: 1_000_000,
          ...txOverrides,
          chainId: Number(chainId)
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

  async getRouteData ({ toChainId }: GetRouteDataInput): Promise<RouteData> {
    const fromChainId = this.chainId
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
    const address = this.getSpokeMessageBridgeContractAddress()
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

  async getMessageFee ({ toChainId }: GetMessageFeeInput): Promise<BigNumber> {
    const fromChainId = this.chainId
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new InputError('fromChainId and toChainId must be different')
    }

    const routeData = await this.getRouteData({ toChainId })
    return routeData.messageFee
  }

  async getMaxBundleMessageCount ({ toChainId }: GetMaxBundleMessageCountInput): Promise<number> {
    const fromChainId = this.chainId
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new InputError(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new InputError(`Invalid toChainId "${toChainId}"`)
    }

    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new InputError('fromChainId and toChainId must be different')
    }

    const routeData = await this.getRouteData({ toChainId })
    return routeData.maxBundleMessages
  }

  async getIsBundleSet ({ fromChainId, bundleId }: GetIsBundleSetInput): Promise<boolean> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getSpokeMessageBridgeContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${chainId}"`)
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

  async getMessageSentEventsFromTransactionReceipt ({ receipt }: GetMessageSentEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<MessageSent>[] | null> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!receipt) {
      throw new InputError('receipt is required. Receipt is the transaction receipt of the message sent event.')
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getSpokeMessageBridgeContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId: ${chainId}`)
    }

    const eventFetcher = this.getEventFetcher(EventName.MessageSent)
    return eventFetcher.decodeEventsFromTransactionReceipt(receipt)
  }

  async getMessageSentEventFromTransactionReceipt ({ receipt }: GetMessageSentEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<MessageSent> | null> {
    const events = await this.getMessageSentEventsFromTransactionReceipt({ receipt })
    return events?.[0] ?? null
  }

  async getMessageSentEventFromTransactionHash ({ transactionHash }: GetMessageSentEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<MessageSent> | null> {
    const chainId = this.chainId
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

    console.log('provider', provider)
    const receipt = await provider.getTransactionReceipt(transactionHash)
    console.log('receipt', receipt)

    if (!receipt) {
      return null
    }

    return this.getMessageSentEventFromTransactionReceipt({ receipt })
  }

  async getMessageBundledEventFromTransactionHash ({ transactionHash }: GetMessageBundledEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<MessageBundled> | null> {
    const chainId = this.chainId
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
    const eventFetcher = this.getEventFetcher(EventName.MessageBundled)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getMessageIdFromTransactionHash ({ transactionHash }: GetMessageIdFromTransactionHashInput): Promise<string> {
    const chainId = this.chainId
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

    const event = await this.getMessageSentEventFromTransactionHash({ transactionHash })
    if (!event) {
      throw new CustomError(`event not found for transaction hash "${transactionHash}" on chainId "${chainId}"`)
    }

    return event.decoded.messageId
  }

  async getMessageBundleIdFromMessageId ({ messageId }: GetMessageBundleIdFromMessageIdInput): Promise<string> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageBundledEventFromMessageId({ messageId })
    if (!event) {
      throw new CustomError(`event not found for messageId "${messageId}" on chainId "${chainId}"`)
    }

    return event.decoded.bundleId
  }

  async getMessageBundleIdFromTransactionHash ({ transactionHash }: GetMessageBundleIdFromTransactionHashInput): Promise<string> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transactionHash "${transactionHash}"`)
    }

    const event = await this.getMessageBundledEventFromTransactionHash({ transactionHash })
    if (!event) {
      throw new CustomError('event not found for transaction hash')
    }

    return event.decoded.bundleId
  }

  async getMessageTreeIndexFromMessageId ({ messageId }: GetMessageTreeIndexFromMessageIdInput): Promise<number> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageBundledEventFromMessageId({ messageId })
    if (!event) {
      throw new CustomError('event not found for messageId')
    }

    return event.decoded.treeIndex
  }

  async getMessageTreeIndexFromTransactionHash ({ transactionHash }: GetMessageTreeIndexFromTransactionHashInput): Promise<number> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transactionHash "${transactionHash}"`)
    }

    const event = await this.getMessageBundledEventFromTransactionHash({ transactionHash })
    if (!event) {
      throw new CustomError('event not found for transaction hash')
    }

    return event.decoded.treeIndex
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

  async getBundleProofFromMessageId ({ messageId }: GetBundleProofFromMessageIdInput): Promise<BundleProof> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageBundledEventFromMessageId({ messageId })
    if (!event) {
      throw new CustomError(`MessageBundled event not found for messageId "${messageId}"`)
    }

    const { treeIndex, bundleId } = event.decoded
    const messageIds = await this.getMessageIdsForBundleId({ bundleId })
    const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId: messageId })
    const totalLeaves = messageIds.length

    return {
      bundleId,
      treeIndex,
      siblings,
      totalLeaves
    }
  }

  async getBundleProofFromTransactionHash ({ transactionHash }: GetBundleProofFromTransactionHashInput): Promise<BundleProof> {
    const chainId = this.chainId
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
    const messageBundledEvent = await this.getMessageBundledEventFromTransactionHash({ transactionHash })
    if (!messageBundledEvent) {
      throw new CustomError(`MessageBundled event not found for transaction hash "${transactionHash}"`)
    }

    const { treeIndex, bundleId } = messageBundledEvent.decoded
    const targetMessageId = await this.getMessageIdFromTransactionHash({ transactionHash })
    const messageIds = await this.getMessageIdsForBundleId({ bundleId })
    const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId })
    const totalLeaves = messageIds.length

    return {
      bundleId,
      treeIndex,
      siblings,
      totalLeaves
    }
  }

  async getRelayMessageDataFromTransactionHash ({ transactionHash }: GetRelayMessageDataFromTransactionHashInput): Promise<RelayMessageData> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }

    const event = await this.getMessageSentEventFromTransactionHash({ transactionHash })
    if (!event) {
      throw new CustomError(`Event not found for transaction hash "${transactionHash}"`)
    }

    const bundleProof = await this.getBundleProofFromTransactionHash({ transactionHash })

    return {
      fromChainId: chainId,
      toAddress: event.decoded.to,
      fromAddress: event.decoded.from,
      toCalldata: event.decoded.data,
      toChainId: event.decoded.toChainId,
      bundleProof,
    }
  }

  async getMessageCalldataFromMessageId ({ messageId }: GetMessageCalldataInput): Promise<string> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageSentEventFromMessageId({ messageId })
    if (!event) {
      throw new CustomError(`Event not found for messageId "${messageId}"`)
    }

    return event.data
  }

  async getIsMessageIdRelayed ({ messageId }: GetIsMessageIdRelayedInput): Promise<boolean> {
    const chainId = this.chainId
    if (!messageId) {
      throw new InputError('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new InputError(`Invalid messageId "${messageId}"`)
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId: ${chainId}`)
    }

    const event = await this.getMessageExecutedEventFromMessageId({ messageId })
    return !!event
  }

  async getRelayFee ({
    toChainId,
    toAddress,
    toCalldata
  }: GetRelayFeeInput): Promise<BigNumber> {
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

  static deriveNetwork (chainId: BigNumberish): string {
    chainId = chainId?.toString()
    const networks = [NetworkSlug.Mainnet, NetworkSlug.Sepolia]

    for (const net of networks) {
      const network = getNetwork(net)
      const chain = Object.values(network.chains).find((chain: any) => chain.chainId === chainId)

      if (chain) {
        return net
      }
    }

    throw new Error('could not derive network')
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
