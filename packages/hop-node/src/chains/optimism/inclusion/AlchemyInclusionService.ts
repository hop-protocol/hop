import InclusionService from './InclusionService'
import fetch from 'node-fetch'
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

    if (!this._isAlchemy(this.l1Wallet.provider!)) {
      throw new Error('l1 provider is not alchemy')
    }
    if (!this._isAlchemy(this.l2Wallet.provider!)) {
      throw new Error('l2 provider is not alchemy')
    }
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const l2Tx: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const l1OriginBlockNum = Number(await this.l1BlockContract.number({ blockTag: l2Tx.blockNumber }))
    const inclusionTxHashes: string[] = await this._getL2ToL1InclusionTxHashes(l1OriginBlockNum)

    for (const inclusionTxHash of inclusionTxHashes) {
      const { transactionHashes } = await this.getL2TxHashesInChannel(inclusionTxHash)
      if (transactionHashes.includes(l2TxHash.toLowerCase())) {
        return this.l1Wallet.provider!.getTransactionReceipt(inclusionTxHash)
      }
    }
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    const l1Tx: providers.TransactionReceipt = (await this.l1Wallet.provider!.getTransactionReceipt(l1TxHash))
    const l1Block: providers.Block = await this.l1Wallet.provider!.getBlock(l1Tx.blockNumber)

    const l2StartBlockNumber = await this.getApproximateL2BlockNumberAtL1Timestamp(l1Block.timestamp)
    const inclusionTxHashes: string[] = await this._getL1lToL2InclusionTxHashes(l2StartBlockNumber)

    for (const inclusionTxHash of inclusionTxHashes) {
      const tx = await this.l2Wallet.provider!.getTransaction(inclusionTxHash)
      if (this.isL1BlockUpdateTx(tx)) {
        return this.l2Wallet.provider!.getTransactionReceipt(tx.hash)
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
    const { destChainProvider, fromAddress, toAddress, startBlockNumber } = config

    // Defined the from and to block numbers
    const destHeadBlockNumber = await destChainProvider.getBlockNumber()

    const searchLengthBlocks = 50
    let endBlockNumber = startBlockNumber + searchLengthBlocks
    if (endBlockNumber > destHeadBlockNumber) {
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

    const rpcUrl = this._getRpcUrlFromProvider(destChainProvider)
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

  private _getRpcUrlFromProvider (provider: providers.Provider): string {
    return (provider as any)?.connection?.url ?? (provider as any).providers?.[0]?.connection?.url ?? ''
  }

  private _isAlchemy (providerOrUrl: providers.Provider | string): boolean {
    let url
    if (providerOrUrl instanceof providers.Provider) {
      url = this._getRpcUrlFromProvider(providerOrUrl)
    } else {
      url = providerOrUrl
    }

    return url.includes('alchemy.com')
  }
}

export default AlchemyInclusionService
