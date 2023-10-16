import InclusionService from './InclusionService'
import fetch from 'node-fetch'
import getRpcUrlFromProvider from 'src/utils/getRpcUrlFromProvider'
import isAlchemy from 'src/utils/isAlchemy'
import { IInclusionService, InclusionServiceConfig } from './IInclusionService'
import { providers } from 'ethers'

interface GetInclusionTxHashes {
  destChainProvider: providers.Provider
  fromAddress: string
  toAddress: string
  startBlockNumber: number
}

class AlchemyInclusionService extends InclusionService implements IInclusionService {
  constructor (config: InclusionServiceConfig) {
    super(config)

    if (!isAlchemy(this.l1Wallet.provider!)) {
      throw new Error('l1 provider is not alchemy')
    }
    if (!isAlchemy(this.l2Wallet.provider!)) {
      throw new Error('l2 provider is not alchemy')
    }
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const l2TxBlockNumber: number = (await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)).blockNumber
    const l1OriginBlockNum = Number(await this.l1BlockContract.number({ blockTag: l2TxBlockNumber }))
    const inclusionTxHashes: string[] = await this._getL2ToL1InclusionTxHashes(l1OriginBlockNum)

    for (const inclusionTxHash of inclusionTxHashes) {
      const { transactionHashes } = await this.getL2TxHashesInChannel(inclusionTxHash)
      if (transactionHashes.includes(l2TxHash.toLowerCase())) {
        return this.l1Wallet.provider!.getTransactionReceipt(inclusionTxHash)
      }
    }
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const l1TxBlockNumber: number = (await this.l1Wallet.provider!.getTransactionReceipt(l1TxHash)).blockNumber
    const l1Block: providers.Block = await this.l1Wallet.provider!.getBlock(l1TxBlockNumber)

    const l2StartBlockNumber = await this.getApproximateL2BlockNumberAtL1Timestamp(l1Block.timestamp)
    const inclusionTxHashes: string[] = await this._getL1lToL2InclusionTxHashes(l2StartBlockNumber)

    for (const inclusionTxHash of inclusionTxHashes) {
      const tx = await this.l2Wallet.provider!.getTransaction(inclusionTxHash)
      if (this.isL1BlockUpdateTx(tx)) {
        if (this.doesL1BlockUpdateExceedL1BlockNumber(tx.data, l1TxBlockNumber)) {
          return this.l2Wallet.provider!.getTransactionReceipt(tx.hash)
        }
      }
    }
  }

  private async _getL2ToL1InclusionTxHashes (startBlockNumber: number): Promise<string[]> {
    return this._getInclusionTxHashes({
      destChainProvider: this.l1Wallet.provider!,
      fromAddress: this.batcherAddress,
      toAddress: this.batchInboxAddress,
      startBlockNumber
    })
  }

  private async _getL1lToL2InclusionTxHashes (startBlockNumber: number): Promise<string[]> {
    return this._getInclusionTxHashes({
      destChainProvider: this.l2Wallet.provider!,
      fromAddress: this.l1BlockSetterAddress,
      toAddress: this.l1BlockAddress,
      startBlockNumber
    })
  }

  private async _getInclusionTxHashes (config: GetInclusionTxHashes): Promise<string[]> {
    let { destChainProvider, fromAddress, toAddress, startBlockNumber } = config

    // Defined the from and to block numbers
    const destHeadBlockNumber = await destChainProvider.getBlockNumber()

    const searchLengthBlocks = 50
    let endBlockNumber = startBlockNumber + searchLengthBlocks

    // Handle case where blocks exceed current head
    if (startBlockNumber > destHeadBlockNumber) {
      startBlockNumber = destHeadBlockNumber
      endBlockNumber = destHeadBlockNumber
    } else if (endBlockNumber > destHeadBlockNumber) {
      endBlockNumber = destHeadBlockNumber
    }

    // Make call
    const params = {
      fromBlock: '0x' + startBlockNumber.toString(16),
      toBlock: '0x' + endBlockNumber.toString(16),
      fromAddress: fromAddress.toLowerCase(),
      toAddress: toAddress.toLowerCase(),
      category: [
        'external'
      ],
      excludeZeroValue: false
    }

    const query = {
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [params]
    }

    const rpcUrl = getRpcUrlFromProvider(destChainProvider)
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(query)
    })

    const jsonRes = await res.json()
    if (!jsonRes?.result) {
      throw new Error(`alchemy_getAssetTransfers failed: ${JSON.stringify(jsonRes)}`)
    }
    return jsonRes.result.transfers.map((tx: any) => tx.hash)
  }
}

export default AlchemyInclusionService
