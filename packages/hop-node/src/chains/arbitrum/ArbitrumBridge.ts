import AbstractChainBridge from '../AbstractChainBridge'
import fetch from 'node-fetch'
import getNonRetryableRpcProvider from 'src/utils/getNonRetryableRpcProvider'
import getRpcUrl from 'src/utils/getRpcUrl'
import { ArbitrumSuperchainCanonicalAddresses } from '@hop-protocol/core/addresses'
import { BigNumber, Contract, providers } from 'ethers'
import { IChainBridge, RelayL1ToL2MessageOpts } from '../IChainBridge'
import { IL1ToL2MessageWriter, L1ToL2MessageStatus, L1TransactionReceipt, L2TransactionReceipt } from '@arbitrum/sdk'
import { getCanonicalAddressesForChain } from 'src/config'

type ArbitrumTransactionReceipt = providers.TransactionReceipt & {
  l1BlockNumber?: BigNumber
}

class ArbitrumBridge extends AbstractChainBridge implements IChainBridge {
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
    const messageIndex = opts?.messageIndex ?? 0
    this.logger.debug(`attempting to relay L1 to L2 message for l1TxHash: ${l1TxHash} messageIndex: ${messageIndex}`)
    const status = await this._getMessageStatus(l1TxHash, messageIndex)
    if (status !== L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2) {
      this.logger.error(`Transaction not redeemable. Status: ${L1ToL2MessageStatus[status]}, l1TxHash: ${l1TxHash}`)
      throw new Error('Transaction unredeemable')
    }

    this.logger.debug(`getL1ToL2Message for l1TxHash: ${l1TxHash} messageIndex: ${messageIndex}`)
    const l1ToL2Message = await this._getL1ToL2Message(l1TxHash, messageIndex)
    this.logger.debug(`attempting l1ToL2Message.redeem() for l1TxHash: ${l1TxHash} messageIndex: ${messageIndex}`)
    return await l1ToL2Message.redeem()
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const txReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const initiatingTxnReceipt = new L2TransactionReceipt(
      txReceipt
    )

    if (!initiatingTxnReceipt) {
      throw new Error(
        `no arbitrum transaction found for tx hash ${l2TxHash}`
      )
    }

    const outGoingMessagesFromTxn = await initiatingTxnReceipt.getL2ToL1Messages(this.l1Wallet, this.l2Wallet.provider!)
    if (outGoingMessagesFromTxn.length === 0) {
      throw new Error(`tx hash ${l2TxHash} did not initiate an outgoing messages`)
    }

    const msg: any = outGoingMessagesFromTxn[0]
    if (!msg) {
      throw new Error(`msg not found for tx hash ${l2TxHash}`)
    }

    return msg.execute(this.l2Wallet.provider)
  }

  private async _getL1ToL2Message (l1TxHash: string, messageIndex: number = 0, useNonRetryableProvider: boolean = false): Promise<IL1ToL2MessageWriter> {
    const l1ToL2Messages = await this._getL1ToL2Messages(l1TxHash, useNonRetryableProvider)
    return l1ToL2Messages[messageIndex]
  }

  private async _getL1ToL2Messages (l1TxHash: string, useNonRetryableProvider: boolean = false): Promise<IL1ToL2MessageWriter[]> {
    const l2Wallet = useNonRetryableProvider ? this.l2Wallet.connect(this.nonRetryableProvider) : this.l2Wallet
    const txReceipt = await this.l1Wallet.provider!.getTransactionReceipt(l1TxHash)
    const l1TxnReceipt = new L1TransactionReceipt(txReceipt)
    return l1TxnReceipt.getL1ToL2Messages(l2Wallet)
  }

  private async _getMessageStatus (l1TxHash: string, messageIndex: number = 0): Promise<L1ToL2MessageStatus> {
    // We cannot use our provider here because the SDK will rateLimitRetry and exponentially backoff as it retries an on-chain call
    const useNonRetryableProvider = true
    const l1ToL2Message = await this._getL1ToL2Message(l1TxHash, messageIndex, useNonRetryableProvider)
    const res = await l1ToL2Message.waitForStatus()
    return res.status
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
}

export default ArbitrumBridge
