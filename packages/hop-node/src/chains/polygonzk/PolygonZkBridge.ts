import AbstractChainBridge from '../AbstractChainBridge'
import fetch from 'node-fetch'
import getRpcUrl from 'src/utils/getRpcUrl'
import wait from 'src/utils/wait'
import { CanonicalMessengerRootConfirmationGasLimit, Chain } from 'src/constants'
import { FinalityBlockTag, IChainBridge } from '../IChainBridge'
import { NetworkSlug, networks } from '@hop-protocol/core/networks'
import { Signer, providers } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmBridge, ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'

interface ZkEvmBridges {
  sourceBridge: ZkEvmBridge
  destBridge: ZkEvmBridge
}

const polygonChainSlugs: Record<string, string> = {
  mainnet: 'matic',
  goerli: 'mumbai'
}

const polygonSdkNetwork: Record<string, string> = {
  mainnet: 'mainnet',
  goerli: 'testnet'
}

const polygonSdkVersion: Record<string, string> = {
  mainnet: 'v1',
  goerli: 'blueberry'
}

const finalityNameMap: Record<string, string> = {
  safe: 'virtual',
  finalized: 'verified' // also called consolidated in their docs
}

type Batch = {
  number: string
  coinbase: string
  stateRoot: string
  globalExitRoot: string
  mainnetExitRoot: string
  rollupExitRoot: string
  localExitRoot: string
  accInputHash: string
  timestamp: string
  sendSequencesTxHash: string
  // exists only if batch has been verified (finalized)
  verifyBatchTxHash: string | null
  // closed is true after all txs have been included, maybe 1-2s after the batch is created.
  closed: boolean
  blocks: string[]
  transactions: string[]
  batchL2Data: string
}

class PolygonZkBridge extends AbstractChainBridge implements IChainBridge {
  ready: boolean = false
  apiUrl: string
  zkEvmClient: ZkEvmClient
  doesSupportZkEvmRpc: boolean

  constructor (chainSlug: string) {
    super(chainSlug)

    let l1Network: string | undefined
    for (const network in networks) {
      const chainId = networks[network as NetworkSlug]?.polygonzk?.networkId
      if (chainId === this.chainId) {
        l1Network = network
        break
      }
    }

    if (!l1Network) {
      throw new Error('polygon network name not found')
    }

    const polygonNetwork = polygonChainSlugs[l1Network]
    this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${polygonNetwork}/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()
    this.#init(l1Network)
      .then(() => {
        this.ready = true
        this.logger.debug('zkEVM client initialized')
      })
      .catch((err: any) => {
        this.logger.error('zkEvm client initialize error:', err)
      })
  }

  async #init (l1Network: string) {
    const from = await this.l1Wallet.getAddress()
    const sdkNetwork = polygonSdkNetwork[l1Network]
    const sdkVersion = polygonSdkVersion[l1Network]
    await this.zkEvmClient.init({
      network: sdkNetwork,
      version: sdkVersion,
      parent: {
        provider: this.l1Wallet,
        defaultConfig: {
          from
        }
      },
      child: {
        provider: this.l2Wallet,
        defaultConfig: {
          from
        }
      }
    })

    // Verify that the RPC endpoint supports the zkEVM_* RPC methods
    try {
      await this.#fetchRpcCall(`zkevm_${finalityNameMap[FinalityBlockTag.Safe]}BatchNumber`)
      this.doesSupportZkEvmRpc = true
    } catch (err) {
      this.logger.warn('RPC endpoint does not support zkEVM_* methods')
      this.doesSupportZkEvmRpc = false
    }
  }

  async #tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.#tilReady()
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    await this.#tilReady()

    const isSourceTxOnL1 = true
    const signer = this.l2Wallet
    return await this._relayXDomainMessage(l1TxHash, isSourceTxOnL1, signer)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    await this.#tilReady()

    const isSourceTxOnL1 = false
    const signer = this.l1Wallet
    return this._relayXDomainMessage(l2TxHash, isSourceTxOnL1, signer)
  }

  private async _relayXDomainMessage (txHash: string, isSourceTxOnL1: boolean, wallet: Signer): Promise<providers.TransactionResponse> {
    const isRelayable = await this._isCheckpointed(txHash, isSourceTxOnL1)
    if (!isRelayable) {
      throw new Error('expected deposit to be claimable')
    }

    // The bridge to claim on will be on the opposite chain that the source tx is on
    const { sourceBridge, destBridge } = this.#getSourceAndDestBridge(isSourceTxOnL1)

    // Get the payload to claim the tx
    const networkId: number = await sourceBridge.networkID()
    const claimPayload = await this.zkEvmClient.bridgeUtil.buildPayloadForClaim(txHash, isSourceTxOnL1, networkId)

    // Execute the claim tx
    const claimMessageTx = await destBridge.claimMessage(
      claimPayload.smtProof,
      claimPayload.index,
      claimPayload.mainnetExitRoot,
      claimPayload.rollupExitRoot,
      claimPayload.originNetwork,
      claimPayload.originTokenAddress,
      claimPayload.destinationNetwork,
      claimPayload.destinationAddress,
      claimPayload.amount,
      claimPayload.metadata,
      {
        gasLimit: CanonicalMessengerRootConfirmationGasLimit
      }
    )

    const claimMessageTxHash: string = await claimMessageTx.getTransactionHash()
    return await wallet.provider!.getTransaction(claimMessageTxHash)
  }

  private async _isCheckpointed (txHash: string, isSourceTxOnL1: boolean): Promise<boolean> {
    if (isSourceTxOnL1) {
      return this.zkEvmClient.isDepositClaimable(txHash)
    }
    return this.zkEvmClient.isWithdrawExitable(txHash)
  }

  #getSourceAndDestBridge (isSourceTxOnL1: boolean): ZkEvmBridges {
    if (isSourceTxOnL1) {
      return {
        sourceBridge: this.zkEvmClient.rootChainBridge,
        destBridge: this.zkEvmClient.childChainBridge
      }
    } else {
      return {
        sourceBridge: this.zkEvmClient.childChainBridge,
        destBridge: this.zkEvmClient.rootChainBridge
      }
    }
  }

  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    await this.#tilReady()

    if (!this.doesSupportZkEvmRpc) {
      this.logger.error('getCustomBlockNumber: RPC endpoint does not support zkEVM_* methods')
      return
    }

    if (!this.#isCustomBlockNumberSupported(blockTag)) {
      this.logger.error(`getCustomBlockNumber: blockTag ${blockTag} not supported`)
      return
    }

    // Use a cache since the granularity of finality updates on l1 is on the order of minutes
    const customBlockNumberCacheKey = `${this.chainSlug}-${blockTag}`
    const cacheValue = this.getCacheValue(customBlockNumberCacheKey)
    if (cacheValue) {
      this.logger.debug('getCustomBlockNumber: using cached value')
      return cacheValue
    }

    const customBlockNumber = await this.#getCustomBlockNumber(blockTag)
    if (!customBlockNumber) {
      this.logger.error('getCustomBlockNumber: no customBlockNumber found')
      return
    }

    this.updateCache(customBlockNumberCacheKey, customBlockNumber)
    return customBlockNumber
  }

  async #getCustomBlockNumber (blockTag: providers.BlockTag): Promise<number | undefined> {
    const finalityName = finalityNameMap[blockTag]

    // Get batch number
    const batchNumber: number | undefined = await this.#getBatchNumber(finalityName)
    if (!batchNumber) {
      this.logger.error('getCustomBlockNumber: no batchNumber found')
      return
    }

    // Arbitrarily wait for L1 safe by looking back 6 minutes after the batch was posted.
    // As of Dec 2023, it is not trivial to associate L1 blocks with L2 batch data. If Polygon zkEVM
    // ever exposes this ability, update this logic to be exact.
    const appxBatchesPerMin = 3
    const appxL1SafetyMin = 6
    const appxBatches = appxBatchesPerMin * appxL1SafetyMin
    const safeBatchNumber = batchNumber - appxBatches

    // Get batch info
    const batch: Batch | undefined = await this.#getBatch(safeBatchNumber)
    if (!batch?.blocks?.length) {
      this.logger.error('getCustomBlockNumber: no blocks found in batch')
      return
    }

    // Get latest block number from batch. The latest block number is the last block in the batch.
    const latestBlockHashInBatch = batch.blocks[batch.blocks.length - 1]
    const latestBlockInBatch: providers.Block = await this.l2Wallet.provider!.getBlock(latestBlockHashInBatch)
    if (!latestBlockInBatch?.number) {
      this.logger.error('getCustomBlockNumber: no latestBlockInBatch found')
      return
    }

    return latestBlockInBatch.number
  }

  async #getBatchNumber (finalityName: string): Promise<number | undefined> {
    let batchNumber: number | undefined
    try {
      const batchNumberRes: string = await this.#fetchRpcCall(`zkevm_${finalityName}BatchNumber`)
      batchNumber = Number(batchNumberRes)
    } catch {
      return
    }

    return batchNumber
  }

  async #getBatch (batchNumber: number): Promise<Batch | undefined> {
    let batch: Batch | undefined
    try {
      batch = await this.#fetchRpcCall('zkevm_getBatchByNumber', [batchNumber])
    } catch {
      return
    }
    return batch
  }

  async #fetchRpcCall (method: string, params: any[] = []): Promise<any> {
    const res = await fetch(getRpcUrl(Chain.PolygonZk)!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1
      })
    })

    const jsonRes = await res.json()
    if (!jsonRes?.result) {
      throw new Error(`No response for ${method}, with params ${params}`)
    }
    return jsonRes.result
  }

  #isCustomBlockNumberSupported (blockTag: FinalityBlockTag): boolean {
    if (
      blockTag === FinalityBlockTag.Safe ||
      blockTag === FinalityBlockTag.Finalized
    ) {
      return true
    }
    return false
  }
}
export default PolygonZkBridge
