import getRpcRootProviderName from 'src/utils/getRpcRootProviderName.js'
import getRpcUrlFromProvider from 'src/utils/getRpcUrlFromProvider.js'
import wait from 'src/utils/wait.js'
import { AbstractOptimismInclusionService } from 'src/chains/Chains/optimism/inclusion/AbstractOptimismInclusionService.js'
import { IInclusionService } from 'src/chains/Services/AbstractInclusionService.js'
import { RootProviderName } from 'src/constants/index.js'
import { providers } from 'ethers'

interface GetInclusionTxHashes {
  destChainProvider: providers.Provider
  fromAddress: string
  toAddress: string
  startBlockNumber: number
  endBlockNumber?: number
}

class AlchemyInclusionService extends AbstractOptimismInclusionService implements IInclusionService {
  readonly #maxNumL1BlocksWithoutInclusion: number = 50
  #isInitialized: boolean
  #ready: boolean

  constructor (chainSlug: string) {
    super(chainSlug)

    // Async init
    this.#init()
      .then(() => {
        this.#isInitialized = true
        this.logger.debug('AlchemyInclusionService initialized')
      })
      .catch(() => {
        this.#isInitialized = false
        this.logger.warn('Unable to initialize AlchemyInclusionService')
        process.exit(1)
      })
      .finally(() => {
        this.#ready = true
      })
  }

  async #init () {
    const [l1RpcProviderName, l2RpcProviderName] = await Promise.all([
      getRpcRootProviderName(this.l1Provider),
      getRpcRootProviderName(this.l2Provider)
    ])
    if (
      l1RpcProviderName !== RootProviderName.Alchemy ||
      l2RpcProviderName !== RootProviderName.Alchemy
    ) {
      this.logger.debug(`provider is not alchemy, l1: ${l1RpcProviderName}, l2: ${l2RpcProviderName}`)
      throw new Error('provider is not alchemy')
    }
  }

  async #isReadyAndInitialized (): Promise<boolean> {
    while (true) {
      if (!this.#isInitialized) {
        return false
      }

      if (this.#ready && this.#isInitialized) {
        return true
      }

      await wait(100)
    }
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!(await this.#isReadyAndInitialized())) return

    const l2TxBlockNumber: number = (await this.l2Provider.getTransactionReceipt(l2TxHash)).blockNumber
    const l1OriginBlockNum = Number(await this.l1BlockContract.number({ blockTag: l2TxBlockNumber }))
    const inclusionTxHashes: string[] = await this.#getL2ToL1InclusionTxHashes(l1OriginBlockNum)

    for (const inclusionTxHash of inclusionTxHashes) {
      const { transactionHashes } = await this.getL2TxHashesInChannel(inclusionTxHash)
      if (transactionHashes.includes(l2TxHash.toLowerCase())) {
        return this.l1Provider.getTransactionReceipt(inclusionTxHash)
      }
    }
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!(await this.#isReadyAndInitialized())) return

    const l1TxBlockNumber: number = (await this.l1Provider.getTransactionReceipt(l1TxHash)).blockNumber
    const l1Block: providers.Block = await this.l1Provider.getBlock(l1TxBlockNumber)

    const l2StartBlockNumber = await this.getApproximateL2BlockNumberAtL1Timestamp(l1Block.timestamp)
    const inclusionTxHashes: string[] = await this.#getL1lToL2InclusionTxHashes(l2StartBlockNumber)

    for (const inclusionTxHash of inclusionTxHashes) {
      const tx = await this.l2Provider.getTransaction(inclusionTxHash)
      if (this.isL1BlockUpdateTx(tx)) {
        if (this.doesL1BlockUpdateExceedL1BlockNumber(tx.data, l1TxBlockNumber)) {
          return this.l2Provider.getTransactionReceipt(tx.hash)
        }
      }
    }
  }

  async getLatestL1InclusionTxBeforeBlockNumber (l1BlockNumber: number): Promise<providers.TransactionReceipt | undefined> {
    if (!(await this.#isReadyAndInitialized())) return

    const startBlockNumber = l1BlockNumber - this.#maxNumL1BlocksWithoutInclusion
    const inclusionTxHashes: string[] = await this.#getL2ToL1InclusionTxHashes(startBlockNumber, l1BlockNumber)
    return this.l1Provider.getTransactionReceipt(inclusionTxHashes[inclusionTxHashes.length - 1])
  }

  async getLatestL2TxFromL1ChannelTx (l1InclusionTx: string): Promise<providers.TransactionReceipt | undefined> {
    if (!(await this.#isReadyAndInitialized())) return

    const { transactionHashes } = await this.getL2TxHashesInChannel(l1InclusionTx)
    const latestL2TxHash: string = transactionHashes?.[transactionHashes.length - 1]
    if (!latestL2TxHash) {
      this.logger.error(`no L2 tx found for L1 inclusion tx ${l1InclusionTx}`)
      return
    }
    return this.l2Provider.getTransactionReceipt(latestL2TxHash)
  }

  async #getL2ToL1InclusionTxHashes (startBlockNumber: number, endBlockNumber?: number): Promise<string[]> {
    return this.#getInclusionTxHashes({
      destChainProvider: this.l1Provider,
      fromAddress: this.batcherAddress,
      toAddress: this.batchInboxAddress,
      startBlockNumber,
      endBlockNumber
    })
  }

  async #getL1lToL2InclusionTxHashes (startBlockNumber: number, endBlockNumber?: number): Promise<string[]> {
    return this.#getInclusionTxHashes({
      destChainProvider: this.l2Provider,
      fromAddress: this.l1BlockSetterAddress,
      toAddress: this.l1BlockAddress,
      startBlockNumber,
      endBlockNumber
    })
  }

  async #getInclusionTxHashes (config: GetInclusionTxHashes): Promise<string[]> {
    let { destChainProvider, fromAddress, toAddress, startBlockNumber, endBlockNumber } = config

    if (!endBlockNumber) {
      endBlockNumber = await this.#getEndBlockNumber(destChainProvider, startBlockNumber)
    }

    if (startBlockNumber > endBlockNumber) {
      throw new Error('startBlockNumber must be less than endBlockNumber')
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

    const jsonRes: any = await res.json()
    if (!jsonRes?.result) {
      throw new Error(`alchemy_getAssetTransfers failed: ${JSON.stringify(jsonRes)}`)
    }
    return jsonRes.result.transfers.map((tx: any) => tx.hash)
  }

  async #getEndBlockNumber (destChainProvider: providers.Provider, startBlockNumber: number): Promise<number> {
    // Defined the from and to block numbers
    const destHeadBlockNumber = await destChainProvider.getBlockNumber()

    let endBlockNumber = startBlockNumber + this.#maxNumL1BlocksWithoutInclusion

    // Handle case where blocks exceed current head
    if (startBlockNumber > destHeadBlockNumber) {
      startBlockNumber = destHeadBlockNumber
      endBlockNumber = destHeadBlockNumber
    } else if (endBlockNumber > destHeadBlockNumber) {
      endBlockNumber = destHeadBlockNumber
    }

    return endBlockNumber
  }
}

export default AlchemyInclusionService
