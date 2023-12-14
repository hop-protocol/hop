import fetch from 'node-fetch'
import getRpcUrl from 'src/utils/getRpcUrl'
import { ArbitrumSuperchainCanonicalAddresses } from '@hop-protocol/core/addresses'
import { BigNumber, Contract, providers } from 'ethers'
import { getCanonicalAddressesForChain } from 'src/config'
import { AbstractInclusionService, IInclusionService } from 'src/chains/Services/AbstractInclusionService'

type ArbitrumTransactionReceipt = providers.TransactionReceipt & {
  l1BlockNumber?: BigNumber
}

export class ArbitrumInclusionService extends AbstractInclusionService implements IInclusionService {
  private readonly nodeInterfaceContract: Contract
  private readonly sequencerInboxContract: Contract

  constructor (chainSlug: string) {
    super(chainSlug)

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
    this.nodeInterfaceContract = new Contract(nodeInterfaceAddress, nodeInterfaceAbi, this.l2Provider)
    this.sequencerInboxContract = new Contract(sequencerInboxAddress, sequencerInboxAbi, this.l1Provider)
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
      // If the batch does not yet exist, this will throw with 'requested block x is after latest on-chain block y published in batch z'
      // Note: this should throw a CALL_EXCEPTION error if the block is not yet posted, and the rateLimitRetry provider should not retry.
      l1BatchNumber = await this.nodeInterfaceContract.findBatchContainingBlock(l2TxReceipt.blockNumber)
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
    const l1BlockHead: number = await this.l1Provider.getBlockNumber()
    const startBlockNumber = Number(l2TxReceipt.l1BlockNumber)
    const endBlockNumber = Math.min(startBlockNumber + numForwardLookingBlocks, l1BlockHead)
    const sequencerBatchDeliveredEvents: any[] = await this._fetchSequencerBatchDeliveredEvents(startBlockNumber, endBlockNumber)

    // l1BatchNumbers uniqueness is enforced onchain, so we know that the first event with the
    // correct l1BatchNumber is the correct event.
    for (const event of sequencerBatchDeliveredEvents) {
      if (event.args.batchSequenceNumber.eq(l1BatchNumber)) {
        return await this.l1Provider.getTransactionReceipt(event.transactionHash)
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
