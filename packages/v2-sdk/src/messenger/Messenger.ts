import { Base, BaseConfig } from '#common/index.js'
import { BigNumber, BigNumberish, Signer, providers } from 'ethers'
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
import { addresses } from '#addresses/index.js'

type GetEventsInput = {
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

export type RouteData = {
  messageFee: BigNumber
  maxBundleMessages: number
}

export type GetIsL2TxHashExitedInput = {
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

export type RelayMessageData = {
  fromChainId: number
  toAddress: string
  fromAddress: string
  toCalldata: string
  toChainId: number
  bundleProof: BundleProof
}

export type MessengerConfig = BaseConfig & {}

export class Messenger extends Base {
  batchBlocks?: number = 1000
  gasPriceOracle: GasPriceOracle

  constructor(config: MessengerConfig) {
    super({ network: config.network, signer: config.signer, contractAddresses: config.contractAddresses })

    this.gasPriceOracle = new GasPriceOracle(this.network)
  }

  override connect (signer: Signer) {
    return new Messenger({ network: this.network, signer, contractAddresses: this.contractAddresses })
  }

  getSpokeMessageBridgeContractAddress (chainId: BigNumberish): string {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'spokeCoreMessenger')
  }

  getHubMessageBridgeContractAddress (chainId: BigNumberish): string {
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    return this.getConfigAddress(chainId, 'hubCoreMessenger')
  }

  async getBundleCommittedEvents (input: GetEventsInput): Promise<BundleCommitted[]> {
    const { chainId, fromBlock, toBlock } = input
    if (!chainId) {
      throw new Error('chainId is required')
    }
    if (!fromBlock) {
      throw new Error('fromBlock is required')
    }

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new Error(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && this.utils.isValidFilterBlock(toBlock)) {
      throw new Error(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getRpcProviderForChainId(chainId)
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

  async getHasAuctionStarted (input: HasAuctionStartedInput): Promise<boolean> {
    const { fromChainId, bundleCommittedEvent } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!bundleCommittedEvent) {
      throw new Error('bundleCommittedEvent is required')
    }
    const { commitTime, toChainId } = bundleCommittedEvent
    const exitTime = await this.getSpokeExitTime({ fromChainId, toChainId })
    return commitTime + exitTime < DateTime.utc().toSeconds()
  }

  async getSpokeExitTime (input: GetSpokeExitTimeInput): Promise<number> {
    const { fromChainId, toChainId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId "${toChainId}"`)
    }
    const provider = this.getRpcProviderForChainId(toChainId)
    if (!provider) {
      throw new Error(`Invalid chainId "${toChainId}", provider not found`)
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
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Invalid chainId "${fromChainId}", provider not found`)
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

  async getEstimatedTxCostForForwardMessage (input: GetEstimatedTxCostForForwardMessageInput): Promise<number> {
    const { chainId } = input
    if (!this.utils.isValidChainId(chainId)) {
      throw new Error(`Invalid chainId "${chainId}"`)
    }
    const provider = this.getRpcProviderForChainId(chainId)
    if (!provider) {
      throw new Error(`Invalid chainId "${chainId}", provider not found`)
    }
    const estimatedGas = BigNumber.from(1_000_000) // TODO
    const gasPrice = await provider.getGasPrice()
    const estimatedTxCost = estimatedGas.mul(gasPrice)
    return Number(formatUnits(estimatedTxCost, 9))
  }

  async getShouldAttemptForwardMessage (input: ShouldAttemptForwardMessageInput): Promise<boolean> {
    const { fromChainId, bundleCommittedEvent } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (!bundleCommittedEvent) {
      throw new Error('bundleCommittedEvent is required')
    }
    const estimatedTxCost = await this.getEstimatedTxCostForForwardMessage({ chainId: fromChainId })
    const relayReward = await this.getRelayReward({ fromChainId, bundleCommittedEvent })
    const txOk = relayReward > estimatedTxCost
    const timeOk = await this.getHasAuctionStarted({ fromChainId, bundleCommittedEvent })
    const shouldAttempt = txOk && timeOk
    return shouldAttempt
  }

  async exitBundle (input: ExitBundleInput): Promise<any> {
    let { fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash, signer } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }
    if (bundleCommittedTransactionHash) {
      if (!this.utils.isValidTxHash(bundleCommittedTransactionHash)) {
        throw new Error(`Invalid transaction hash "${bundleCommittedTransactionHash}"`)
      }
    } else if (bundleCommittedEvent) {
      const { eventLog, context } = bundleCommittedEvent
      bundleCommittedTransactionHash = eventLog.transactionHash ?? context?.transactionHash
    } else {
      throw new Error('bundleCommittedEvent or bundleCommittedTransactionHash is required')
    }
    if (!bundleCommittedTransactionHash) {
      throw new Error('expected bundle comitted transaction hash')
    }

    const l1Provider = this.getRpcProviderForChainId(this.l1ChainId)
    const l2Provider = this.getRpcProviderForChainId(fromChainId)
    let exitRelayer : ExitRelayer | undefined = undefined
    if ([420, 10].includes(fromChainId)) {
      const { OptimismRelayer } = await import('../exitRelayers/OptimismRelayer.js')
      exitRelayer = new OptimismRelayer(this.network, signer, l2Provider)
    } else if ([421613, 42161, 42170].includes(fromChainId)) {
      // const { ArbitrumRelayer } = await import('../exitRelayers/ArbitrumRelayer.js')
      // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
    } else if ([80001, 137].includes(fromChainId)) {
      // const { PolygonRelayer } = await import('../exitRelayers/PolygonRelayer.js')
      // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
    } else if ([100].includes(fromChainId)) {
      // const { GnosisChainRelayer } = await import('../exitRelayers/GnosisChainRelayer.js')
      // exitRelayer = new GnosisChainRelayer(this.network, l1Provider, l2Provider)
    }
    if (!exitRelayer) {
      throw new Error(`Exit relayer not found for chainId "${fromChainId}"`)
    }
    const tx = await exitRelayer.exitTx(bundleCommittedTransactionHash)
    return tx
  }

  async getIsL2TxHashExited (input: GetIsL2TxHashExitedInput): Promise<boolean> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transaction hash "${transactionHash}"`)
    }

    const l1Provider = this.getRpcProviderForChainId(this.l1ChainId)
    const l2Provider = this.getRpcProviderForChainId(fromChainId)
    let exitRelayer : ExitRelayer
    if ([420, 10].includes(fromChainId)) {
      const { OptimismRelayer } = await import('../exitRelayers/OptimismRelayer.js')
      exitRelayer = new OptimismRelayer(this.network, l1Provider, l2Provider)
    } else {
      throw new Error(`Exit relayer not found for chainId "${fromChainId}"`)
    }

    return exitRelayer.getIsL2TxHashExited(transactionHash)
  }

  get populateTransaction() {
    return {
      sendMessage: async (input: GetSendMessagePopulatedTxInput): Promise<providers.TransactionRequest> => {
        let { fromChainId, toChainId, toAddress, toCalldata = '0x' } = input
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new Error(`Invalid fromChainId "${fromChainId}"`)
        }
        if (!this.utils.isValidChainId(toChainId)) {
          throw new Error(`Invalid toChainId "${toChainId}"`)
        }
        if (fromChainId?.toString() === toChainId?.toString()) {
          throw new Error('fromChainId and toChainId must be different')
        }
        if (!toAddress) {
          throw new Error('toAddress is required')
        }
        if (!this.utils.isValidAddress(toAddress)) {
          throw new Error(`Invalid toAddress "${toAddress}"`)
        }
        if (!toCalldata) {
          toCalldata = '0x'
        }
        if (!this.utils.isValidBytes(toCalldata)) {
          throw new Error(`Invalid toCalldata "${toCalldata}"`)
        }
        const provider = this.getRpcProviderForChainId(fromChainId)
        if (!provider) {
          throw new Error(`Invalid chainId, "${fromChainId}", provider not found`)
        }

        const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
        if (!address) {
          throw new Error(`Invalid address, not found for chainId "${fromChainId}"`)
        }
        const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider)
        const txData = await spokeMessageBridge.populateTransaction.dispatchMessage(toChainId, toAddress, toCalldata)
        const value = await this.getMessageFee({ fromChainId, toChainId })

        return {
          ...txData,
          chainId: fromChainId,
          value: value.toString()
        }
      },

      relayMessage: async (input: GetRelayMessagePopulatedTxInput): Promise<providers.TransactionRequest> => {
        const { fromChainId, toChainId, fromAddress, toAddress, toCalldata, bundleProof } = input
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new Error(`Invalid fromChainId "${fromChainId}"`)
        }
        if (!this.utils.isValidChainId(toChainId)) {
          throw new Error(`Invalid toChainId "${toChainId}"`)
        }

        if (!this.utils.isValidAddress(toAddress)) {
          throw new Error(`Invalid toAddress "${toAddress}"`)
        }

        if (!this.utils.isValidBytes(toCalldata)) {
          throw new Error(`Invalid toCalldata "${toCalldata}"`)
        }

        if (!bundleProof) {
          throw new Error('bundleProof is required')
        }

        const provider = this.getRpcProviderForChainId(toChainId)
        if (!provider) {
          throw new Error(`Invalid chainId "${toChainId}", provider not found`)
        }

        const address = this.getHubMessageBridgeContractAddress(toChainId)
        if (!address) {
          throw new Error(`Invalid chainId "${toChainId}", address not found`)
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
      },

      bundleExit: async (input: GetBundleExitPopulatedTxInput): Promise<any> => {
        let { fromChainId, bundleCommittedEvent, bundleCommittedTransactionHash } = input
        if (!this.utils.isValidChainId(fromChainId)) {
          throw new Error(`Invalid fromChainId "${fromChainId}"`)
        }
        if (bundleCommittedTransactionHash) {
          if (!this.utils.isValidTxHash(bundleCommittedTransactionHash)) {
            throw new Error(`Invalid transaction hash "${bundleCommittedTransactionHash}"`)
          }
        } else if (bundleCommittedEvent) {
          const { eventLog, context } = bundleCommittedEvent
          bundleCommittedTransactionHash = eventLog.transactionHash ?? context?.transactionHash
        } else {
          throw new Error('bundleCommittedEvent or bundleCommittedTransactionHash is required')
        }
        if (!bundleCommittedTransactionHash) {
          throw new Error('expected bundle comitted transaction hash')
        }

        const l1Provider = this.getRpcProviderForChainId(this.l1ChainId)
        const l2Provider = this.getRpcProviderForChainId(fromChainId)
        let exitRelayer : ExitRelayer | undefined = undefined
        if ([420, 10].includes(fromChainId)) {
          const { OptimismRelayer } = await import('../exitRelayers/OptimismRelayer.js')
          exitRelayer = new OptimismRelayer(this.network, l1Provider, l2Provider)
        } else if ([421613, 42161, 42170].includes(fromChainId)) {
          // const { ArbitrumRelayer } = await import('../exitRelayers/ArbitrumRelayer.js')
          // exitRelayer = new ArbitrumRelayer(this.network, l1Provider, l2Provider)
        } else if ([80001, 137].includes(fromChainId)) {
          // const { PolygonRelayer } = await import('../exitRelayers/PolygonRelayer.js')
          // exitRelayer = new PolygonRelayer(this.network, l1Provider, l2Provider)
        } else if ([100].includes(fromChainId)) {
          // const { GnosisChainRelayer } = await import('../exitRelayers/GnosisChainRelayer.js')
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
    }
  }

  async sendMessage (input: GetSendMessagePopulatedTxInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.sendMessage(input)
    const tx = await this.sendTransaction(populatedTx)
    return tx
  }

  async relayMessage (input: GetRelayMessagePopulatedTxInput): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.relayMessage(input)
    const tx = await this.sendTransaction(populatedTx)
    return tx
  }

  async bundleExit (input: GetBundleExitPopulatedTxInput): Promise<any> {
    const populatedTx = await this.populateTransaction.bundleExit(input)
    const tx = await this.sendTransaction(populatedTx)
    return tx
  }

  // reference: https://github.com/hop-protocol/contracts-v2/blob/cdc3377d6a1f964554ba0e6e1fef0b504d43fc6a/contracts/bridge/FeeDistributor/FeeDistributor.sol#L42
  async getRelayWindowHours (): Promise<number> {
    return 12
  }

  async getRouteData (input: GetRouteDataInput): Promise<RouteData> {
    const { fromChainId, toChainId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId "${toChainId}"`)
    }
    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new Error('fromChainId and toChainId must be different')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    const spokeMessageBridge = SpokeMessageBridge__factory.connect(address, provider)
    const routeData = await spokeMessageBridge.routeData(toChainId)

    return {
      messageFee: routeData.messageFee,
      maxBundleMessages: Number(routeData.maxBundleMessages.toString())
    }
  }

  async getMessageFee (input: GetMessageFeeInput): Promise<BigNumber> {
    const { fromChainId, toChainId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId "${toChainId}"`)
    }
    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new Error('fromChainId and toChainId must be different')
    }
    const routeData = await this.getRouteData({ fromChainId, toChainId })
    return routeData.messageFee
  }

  async getMaxBundleMessageCount (input: GetMaxBundleMessageCountInput): Promise<number> {
    const { fromChainId, toChainId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId "${toChainId}"`)
    }
    if (fromChainId?.toString() === toChainId?.toString()) {
      throw new Error('fromChainId and toChainId must be different')
    }
    const routeData = await this.getRouteData({ fromChainId, toChainId })
    return routeData.maxBundleMessages
  }

  async getIsBundleSet (input: GetIsBundleSetInput): Promise<boolean> {
    const { fromChainId, toChainId, bundleId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId "${toChainId}"`)
    }
    const provider = this.getRpcProviderForChainId(toChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId "${toChainId}"`)
    }
    const address = this.getSpokeMessageBridgeContractAddress(toChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId "${toChainId}"`)
    }
    const hubMessageBridge = HubMessageBridge__factory.connect(address, provider)
    const entity = await hubMessageBridge.bundles(bundleId)
    if (!entity) {
      return false
    }

    return BigNumber.from(entity.root).gt(0) && Number(entity.fromChainId.toString()) === fromChainId
  }

  async getMessageSentEventFromTransactionReceipt (input: GetMessageSentEventFromTransactionReceiptInput): Promise<MessageSent | null> {
    const { fromChainId, receipt } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!receipt) {
      throw new Error('receipt is required')
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId "${fromChainId}"`)
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

  async getMessageSentEventFromTransactionHash (input: GetMessageSentEventFromTransactionHashInput): Promise<MessageSent | null> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!transactionHash) {
      throw new Error('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId "${fromChainId}"`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)
    return this.getMessageSentEventFromTransactionReceipt({ fromChainId, receipt })
  }

  async getMessageBundledEventFromMessageId (input: GetMessageBundledEventFromMessageIdInput): Promise<MessageBundled> {
    const { fromChainId, messageId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId "${fromChainId}"`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId "${fromChainId}"`)
    }

    const eventFetcher = new MessageBundledEventFetcher(provider, fromChainId, 1_000_000_000, address)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  async getMessageSentEventFromMessageId (input: GetMessageSentEventFromMessageIdInput): Promise<MessageSent> {
    const { fromChainId, messageId } = input
    if (!fromChainId) {
      throw new Error('fromChainId is required')
    }
    if (!messageId) {
      throw new Error('messageId is required')
    }
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId ${fromChainId}""`)
    }
    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId "${fromChainId}"`)
    }

    const address = this.getSpokeMessageBridgeContractAddress(fromChainId)
    if (!address) {
      throw new Error(`Contract address not found for chainId "${fromChainId}"`)
    }

    const eventFetcher = new MessageSentEventFetcher(provider, fromChainId, 1_000_000_000, address)
    const filter = eventFetcher.getMessageIdFilter(messageId)
    const toBlock = await provider.getBlockNumber()
    const fromBlock = 0 // endBlock - 100_000
    const events = await eventFetcher.getEventsWithFilter(filter, fromBlock, toBlock)
    return events?.[0] ?? null
  }

  // note: this is broken because messageId is not indexed in event
  async getMessageExecutedEventFromMessageId (input: GetMessageExecutedEventFromMessageIdInput): Promise<MessageExecuted | null>{
    const { fromChainId, toChainId, messageId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId "${toChainId}"`)
    }
    if (!messageId) {
      throw new Error('messageId is required')
    }
    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
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

  async getMessageBundledEventFromTransactionHash (input: GetMessageBundledEventFromTransactionHashInput): Promise<MessageBundled | null> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!transactionHash) {
      throw new Error('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
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

  async getMessageIdFromTransactionHash (input: GetMessageIdFromTransactionHashInput): Promise<string> {
    const { fromChainId, transactionHash } = input
    if (!fromChainId) {
      throw new Error('fromChainId is required')
    }
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }

    if (!transactionHash) {
      throw new Error('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transaction hash "${transactionHash}"`)
    }

    const event = await this.getMessageSentEventFromTransactionHash({ fromChainId, transactionHash })
    if (!event) {
      throw new Error('event not found for transaction hash')
    }

    return event.messageId
  }

  async getMessageBundleIdFromMessageId (input: GetMessageBundleIdFromMessageIdInput): Promise<string> {
    const { fromChainId, messageId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }
    const event = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId })
    if (!event) {
      throw new Error('event not found for messageId')
    }

    return event.bundleId
  }

  async getMessageBundleIdFromTransactionHash (input: GetMessageBundleIdFromTransactionHashInput): Promise<string> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transactionHash "${transactionHash}"`)
    }
    const event = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash })
    if (!event) {
      throw new Error('event not found for transaction hash')
    }

    return event.bundleId
  }

  async getMessageTreeIndexFromMessageId (input: GetMessageTreeIndexFromMessageIdInput): Promise<number> {
    const { fromChainId, messageId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }
    const event = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId })
    if (!event) {
      throw new Error('event not found for messageId')
    }

    return event.treeIndex
  }

  async getMessageTreeIndexFromTransactionHash (input: GetMessageTreeIndexFromTransactionHashInput): Promise<number> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transactionHash "${transactionHash}"`)
    }
    const event = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash })
    if (!event) {
      throw new Error('event not found for transaction hash')
    }

    return event.treeIndex
  }

  async getMessageBundledEventsForBundleId (input: GetMessageBundledEventsForBundleIdInput): Promise<any[]> {
    const { fromChainId, bundleId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(bundleId)) {
      throw new Error(`Invalid bundleId "${bundleId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
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
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidBytes32(bundleId)) {
      throw new Error(`Invalid bundleId "${bundleId}"`)
    }
    const messageEvents = await this.getMessageBundledEventsForBundleId({ fromChainId, bundleId })
    const messageIds = messageEvents.map((item: any) => item.messageId)
    return messageIds
  }

  async getMerkleProofForMessageId (input: GetMerkleProofForMessageIdInput) {
    const { messageIds, targetMessageId } = input
    if (!targetMessageId) {
      throw new Error('targetMessageId is required')
    }
    if (!Array.isArray(messageIds)) {
      throw new Error('messageIds is required and must be an array')
    }
    if (!messageIds.every((item: any) => this.utils.isValidBytes32(item))) {
      throw new Error('Invalid messageIds')
    }
    if (!this.utils.isValidBytes32(targetMessageId)) {
      throw new Error(`Invalid targetMessageId "${targetMessageId}"`)
    }

    const tree = MerkleTree.from(messageIds)
    const proof = tree.getHexProof(targetMessageId)
    return proof
  }

  async getBundleProofFromMessageId (input: GetBundleProofFromMessageIdInput): Promise<BundleProof> {
    const { fromChainId, messageId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!messageId) {
      throw new Error('messageId is required')
    }
    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId "${fromChainId}"`)
    }

    const { treeIndex, bundleId } = await this.getMessageBundledEventFromMessageId({ fromChainId, messageId })
    const messageIds = await this.getMessageIdsForBundleId({ fromChainId, bundleId })
    const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId: messageId })
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
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transactionHash "${transactionHash}"`)
    }
    const provider = this.getRpcProviderForChainId(fromChainId)
    if (!provider) {
      throw new Error(`Provider not found for chainId "${fromChainId}"`)
    }

    // TODO: handle case for when multiple message events in single transaction
    const { treeIndex, bundleId } = await this.getMessageBundledEventFromTransactionHash({ fromChainId, transactionHash }) as any
    const targetMessageId = await this.getMessageIdFromTransactionHash({ fromChainId, transactionHash })
    const messageIds = await this.getMessageIdsForBundleId({ fromChainId, bundleId })
    const siblings = await this.getMerkleProofForMessageId({ messageIds, targetMessageId })
    const totalLeaves = messageIds.length

    return {
      bundleId,
      treeIndex,
      siblings,
      totalLeaves
    }
  }

  async getRelayMessageDataFromTransactionHash (input: GetRelayMessageDataFromTransactionHashInput): Promise<RelayMessageData> {
    const { fromChainId, transactionHash } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!transactionHash) {
      throw new Error('transactionHash is required')
    }

    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new Error(`Invalid transaction hash "${transactionHash}"`)
    }

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

  async getMessageCalldata (input: GetMessageCalldataInput): Promise<string> {
    const { fromChainId, messageId } = input
    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }

    if (!messageId) {
      throw new Error('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }

    const event = await this.getMessageSentEventFromMessageId({ fromChainId, messageId })
    if (!event) {
      throw new Error(`Event not found for messageId "${messageId}"`)
    }

    return event.data
  }

  async getIsMessageIdRelayed (input: GetIsMessageIdRelayedInput): Promise<boolean> {
    const { fromChainId, toChainId, messageId } = input
    if (!messageId) {
      throw new Error('messageId is required')
    }

    if (!this.utils.isValidBytes32(messageId)) {
      throw new Error(`Invalid messageId "${messageId}"`)
    }

    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId: ${fromChainId}`)
    }

    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId: ${toChainId}`)
    }

    const event = await this.getMessageExecutedEventFromMessageId({ messageId, fromChainId, toChainId })
    return !!event
  }

  async getRelayFee (input: GetRelayFeeInput): Promise<BigNumber> {
    const {
      fromChainId,
      toChainId,
      toAddress,
      toCalldata
    } = input

    if (!this.utils.isValidChainId(fromChainId)) {
      throw new Error(`Invalid fromChainId "${fromChainId}"`)
    }
    if (!this.utils.isValidChainId(toChainId)) {
      throw new Error(`Invalid toChainId "${toChainId}"`)
    }
    if (!this.utils.isValidAddress(toAddress)) {
      throw new Error(`Invalid toAddress "${toAddress}"`)
    }
    if (!this.utils.isValidBytes(toCalldata)) {
      throw new Error(`Invalid toCalldata "${toCalldata}"`)
    }

    const populatedTx = await this.populateTransaction.sendMessage({
      fromChainId,
      toChainId,
      toAddress,
      toCalldata
    })
    const timestamp: any = undefined
    const txData = (populatedTx.data ?? '0x').toString()
    const chain = this.utils.getChainSlug(toChainId)
    const provider = this.getRpcProviderForChainId(toChainId)
    const gasLimit = await provider.estimateGas(populatedTx)
    const feeData = await this.gasPriceOracle.estimateGasCost(chain, timestamp, gasLimit.toNumber(), txData)
    return parseEther(feeData.data.gasCost)
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
}
