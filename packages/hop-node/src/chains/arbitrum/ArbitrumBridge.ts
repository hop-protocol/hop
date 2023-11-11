import AbstractChainBridge from '../AbstractChainBridge'
import fetch from 'node-fetch'
import getNonRetryableRpcProvider from 'src/utils/getNonRetryableRpcProvider'
import getRpcUrl from 'src/utils/getRpcUrl'
import { ArbitrumSuperchainCanonicalAddresses } from '@hop-protocol/core/addresses'
import { BigNumber, Contract, providers } from 'ethers'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { IChainBridge, MessageDirection, RelayL1ToL2MessageOpts, RelayL2ToL1MessageOpts } from '../IChainBridge'
import {
  IL1ToL2MessageWriter,
  IL2ToL1MessageWriter,
  L1ToL2MessageStatus,
  L1TransactionReceipt,
  L2ToL1MessageStatus,
  L2TransactionReceipt
} from '@arbitrum/sdk'
import { getCanonicalAddressesForChain } from 'src/config'

type ArbitrumTransactionReceipt = providers.TransactionReceipt & {
  l1BlockNumber?: BigNumber
}

type Message = IL1ToL2MessageWriter | IL2ToL1MessageWriter
type MessageStatus = L1ToL2MessageStatus | L2ToL1MessageStatus
type RelayOpts = {
  messageDirection: MessageDirection
  messageIndex?: number
}

class ArbitrumBridge extends AbstractChainBridge<Message, MessageStatus, RelayOpts> implements IChainBridge {
  nonRetryableProvider: providers.Provider
  nodeInterfaceContract: Contract
  sequencerInboxContract: Contract

  constructor (chainSlug: string) {
    super(chainSlug)
    this.nonRetryableProvider = getNonRetryableRpcProvider(chainSlug)!

    // Addresses from config
    const canonicalAddresses: ArbitrumSuperchainCanonicalAddresses = getCanonicalAddressesForChain(this.chainSlug)
    const sequencerInboxAddress = canonicalAddresses?.sequencerInboxAddress
    if (!sequencerInboxAddress) {
      throw new Error(`canonical addresses not found for ${this.chainSlug}`)
    }

    // Precompiles
    const nodeInterfaceAddress = '0x00000000000000000000000000000000000000C8'
    const nodeInterfaceAbi: string[] = [
      'function findBatchContainingBlock(uint64 blockNum) external view returns (uint64)',
      'function getL1Confirmations(bytes32 blockHash) external view returns (uint64)'
    ]

    // batchDataLocation is an enum onchain (TxInput, SeparateBatchEvent, NoData) which is represented by a uint8
    const timeBoundsStruct = '(uint64 minTimestamp, uint64 maxTimestamp, uint64 minBlockNumber, uint64 maxBlockNumber)'
    const batchDataLocationEnum = 'uint8'
    const sequencerInboxAbi: string[] = [
      `event SequencerBatchDelivered(uint256 indexed batchSequenceNumber, bytes32 indexed beforeAcc, bytes32 indexed afterAcc, bytes32 delayedAcc, uint256 afterDelayedMessagesRead, ${timeBoundsStruct} timeBounds, ${batchDataLocationEnum} dataLocation)`
    ]
    this.nodeInterfaceContract = new Contract(nodeInterfaceAddress, nodeInterfaceAbi, this.l2Wallet)
    this.sequencerInboxContract = new Contract(sequencerInboxAddress, sequencerInboxAbi, this.l1Wallet)
  }

  async relayL1ToL2Message (l1TxHash: string, opts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse> {
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L1_TO_L2,
      messageIndex: opts?.messageIndex ?? 0
    }
    return this.validateMessageAndSendTransaction(l1TxHash, relayOpts)
  }

  async relayL2ToL1Message (l2TxHash: string, opts?: RelayL2ToL1MessageOpts): Promise<providers.TransactionResponse> {
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L2_TO_L1,
      messageIndex: opts?.messageIndex ?? 0
    }
    return this.validateMessageAndSendTransaction(l2TxHash, relayOpts)
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    // The l1BlockNumber is the L1 block with approximately the same timestamp as the L2 block. L2 txs
    // are usually checkpointed within a few minutes after the L2 transaction is made. We can use this information
    // to look a few blocks ahead of the L1 block number for the l1BatchNumber.

    const l2TxReceipt: ArbitrumTransactionReceipt = await this._getArbitrumTxReceipt(l2TxHash)
    if (!l2TxReceipt.l1BlockNumber || !l2TxReceipt.blockNumber) {
      throw new Error(`l2TxReceipt l1BlockNumber or blockNumber not found for tx hash ${l2TxHash}. l2TxReceipt: ${JSON.stringify(l2TxReceipt)}`)
    }

    let l1BatchNumber: BigNumber
    try {
      // Use the nonRetryableProvider to avoid rateLimitRetry, since this call fails if the tx is not yet checkpointed
      // If the batch does not yet exist, this will throw with 'requested block x is after latest on-chain block y published in batch z'
      l1BatchNumber = await this.nodeInterfaceContract.connect(this.nonRetryableProvider).findBatchContainingBlock(l2TxReceipt.blockNumber)
    } catch (err) {
      if (err.message.includes('is after latest on-chain block')) {
        this.logger.debug(`l1BatchNumber not yet posted for l2TxHash ${l2TxHash}`)
        return
      }
      throw err
    }
    if (!l1BatchNumber) {
      throw new Error(`l1BatchNumber not found for l2TxHash ${l2TxHash}`)
    }

    // Number needs to be large enough to account for sequencer down time but small enough to fit
    // in a getLogs batch request.
    const numForwardLookingBlocks = 1000
    const l1BlockHead: number = await this.l1Wallet.provider!.getBlockNumber()
    const startBlockNumber = Number(l2TxReceipt.l1BlockNumber)
    const endBlockNumber = Math.min(startBlockNumber + numForwardLookingBlocks, l1BlockHead)
    const sequencerBatchDeliveredEvents: any[] = await this._fetchSequencerBatchDeliveredEvents(startBlockNumber, endBlockNumber)

    // l1BatchNumbers uniqueness is enforced onchain, so we know that the first event with the
    // correct l1BatchNumber is the correct event.
    for (const event of sequencerBatchDeliveredEvents) {
      if (event.args.batchSequenceNumber.eq(l1BatchNumber)) {
        return await this.l1Wallet.provider!.getTransactionReceipt(event.transactionHash)
      }
    }

    this.logger.debug(`no sequencerBatchDeliveredEvents found for l2TxHash ${l2TxHash}`)
  }

  // Needed to get Arbitrum-specific tx info from raw RPC call since ethers doesn't handle custom chain data
  private async _getArbitrumTxReceipt (txHash: string): Promise<ArbitrumTransactionReceipt> {
    const res = await fetch(getRpcUrl(this.chainSlug)!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1
      })
    })
    const receipt = await res.json()
    if (!receipt.result) {
      throw new Error(`eth_getTransactionReceipt failed: ${JSON.stringify(receipt)}`)
    }

    if (receipt.result?.l1BlockNumber) {
      receipt.result.l1BlockNumber = BigNumber.from(receipt.result.l1BlockNumber)
    }
    return receipt.result
  }

  private async _fetchSequencerBatchDeliveredEvents (startBlockNumber: number, endBlockNumber: number): Promise<any[]> {
    return await this.sequencerInboxContract.queryFilter(
      this.sequencerInboxContract.filters.SequencerBatchDelivered(),
      startBlockNumber,
      endBlockNumber
    )
  }

  protected async sendRelayTransaction (message: Message, relayOpts: RelayOpts): Promise<providers.TransactionResponse> {
    const { messageDirection } = relayOpts
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return (message as IL1ToL2MessageWriter).redeem()
    } else {
      const overrides: any = {
        gasLimit: CanonicalMessengerRootConfirmationGasLimit
      }
      return (message as IL2ToL1MessageWriter).execute(this.l2Wallet.provider!, overrides)
    }
  }

  protected async getMessage (txHash: string, relayOpts: RelayOpts): Promise<Message> {
    let { messageDirection, messageIndex } = relayOpts
    messageIndex = messageIndex ?? 0

    let messages: Message[]
    if (messageDirection === MessageDirection.L1_TO_L2) {
      const txReceipt: providers.TransactionReceipt = await this.l1Wallet.provider!.getTransactionReceipt(txHash)
      if (!txReceipt) {
        throw new Error(`txReceipt not found for tx hash ${txHash}`)
      }
      const arbitrumTxReceipt: L1TransactionReceipt = new L1TransactionReceipt(txReceipt)
      const l2Wallet = this.l2Wallet.connect(this.nonRetryableProvider)
      messages = await arbitrumTxReceipt.getL1ToL2Messages(l2Wallet)
    } else {
      const txReceipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(txHash)
      if (!txReceipt) {
        throw new Error(`txReceipt not found for tx hash ${txHash}`)
      }
      const arbitrumTxReceipt: L2TransactionReceipt = new L2TransactionReceipt(txReceipt)
      const l2Wallet = this.l2Wallet.connect(this.nonRetryableProvider)
      messages = await arbitrumTxReceipt.getL2ToL1Messages(this.l1Wallet, l2Wallet.provider!)
    }

    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }
    return messages[messageIndex]
  }

  protected async getMessageStatus (message: Message): Promise<MessageStatus> {
    // We cannot use our provider here because the SDK will rateLimitRetry and exponentially backoff as it retries an on-chain call
    const res = await (message as IL1ToL2MessageWriter).waitForStatus()
    return res.status
  }

  protected isMessageInFlight(messageStatus: MessageStatus): boolean {
    return (
      messageStatus == L1ToL2MessageStatus.NOT_YET_CREATED ||
      messageStatus == L2ToL1MessageStatus.UNCONFIRMED
    )
  }

  protected isMessageCheckpointed(messageStatus: MessageStatus): boolean {
    return (
      messageStatus === L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2 ||
      messageStatus === L2ToL1MessageStatus.CONFIRMED
    )
  }

  protected isMessageRelayed(messageStatus: MessageStatus): boolean {
    return (
      messageStatus === L1ToL2MessageStatus.REDEEMED ||
      messageStatus === L2ToL1MessageStatus.EXECUTED
    )
  }
}

export default ArbitrumBridge
