import { chainIdToSlug } from '@hop-protocol/hop-node-core/utils'
import { chainSlugToId } from '@hop-protocol/hop-node-core/utils'
import { getBumpedGasPrice } from '@hop-protocol/hop-node-core/utils'
import { getProviderChainSlug } from '@hop-protocol/hop-node-core/utils'
import { BigNumber, Contract, providers } from 'ethers'
import {
  Chain,
  MinGnosisGasPrice,
  MinPolygonGasPrice,
} from '@hop-protocol/hop-node-core/constants'
import { Event } from '@ethersproject/contracts'
import { EventEmitter } from 'node:events'
import { FinalityService } from '@hop-protocol/hop-node-core/finality'
import {
  SyncType
} from '#src/constants/index.js'
import { TxOverrides } from '@hop-protocol/hop-node-core/types'
import { getNetworkCustomSyncType, config as globalConfig } from '#src/config/index.js'

export default class ContractBase extends EventEmitter {
  contract: Contract
  public chainId: number
  public chainSlug: Chain
  private readonly finalityService: FinalityService

  constructor (contract: Contract) {
    super()
    this.contract = contract
    if (!this.contract.provider) {
      throw new Error('no provider found for contract')
    }
    const chainSlug = getProviderChainSlug(contract.provider)
    if (!chainSlug) {
      throw new Error('chain slug not found for contract provider')
    }
    this.chainSlug = chainSlug
    this.chainId = chainSlugToId(chainSlug)

    const syncType = getNetworkCustomSyncType(this.chainSlug) ?? SyncType.Bonder as unknown // note: ts type checker suggests using 'unknown' type first to fix type error
    this.finalityService = new FinalityService(
      this.contract.provider,
      this.chainSlug,
      syncType as any
    )

    if (syncType !== SyncType.Bonder) {
      if (!this.finalityService.isCustomBlockNumberImplemented()) {
        throw new Error(`getCustomSafeBlockNumber not implemented for chain ${this.chainSlug}`)
      }
    }
  }

  getChainId = async (): Promise<number> => {
    return this.getChainIdFn()
  }

  getChainIdFn = async (): Promise<number> => {
    if (this.chainId) {
      return this.chainId
    }
    const { chainId } = await this.contract.provider.getNetwork()
    const _chainId = Number(chainId.toString())
    this.chainId = _chainId
    return _chainId
  }

  chainIdToSlug (chainId: number): Chain {
    return chainIdToSlug(chainId)
  }

  chainSlugToId (chainSlug: string): number {
    return Number(chainSlugToId(chainSlug))
  }

  get provider () {
    return this.contract.provider
  }

  get address (): string {
    return this.contract.address
  }

  getTransaction = async (txHash: string): Promise<providers.TransactionResponse> => {
    if (!txHash) {
      throw new Error('tx hash is required')
    }
    return this.contract.provider.getTransaction(txHash)
  }

  getTransactionReceipt = async (
    txHash: string
  ): Promise<providers.TransactionReceipt> => {
    return this.contract.provider.getTransactionReceipt(txHash)
  }

  getBlockNumber = async (): Promise<number> => {
    return this.finalityService.getBlockNumber()
  }

  getSafeBlockNumber = async (): Promise<number> => {
    return this.finalityService.getSafeBlockNumber()
  }

  getFinalizedBlockNumber = async (): Promise<number> => {
    return this.finalityService.getFinalizedBlockNumber()
  }

  getSyncBlockNumber = async (): Promise<number> => {
    if (!this.finalityService.isCustomBlockNumberImplemented()) {
      throw new Error('Custom block number is not supported')
    }
    return this.finalityService.getCustomBlockNumber()
  }

  getTransactionBlockNumber = async (txHash: string): Promise<number> => {
    const tx = await this.contract.provider.getTransaction(txHash)
    if (!tx) {
      throw new Error(`transaction not found. transactionHash: ${txHash}`)
    }
    return tx.blockNumber!
  }

  getBlockTimestamp = async (
    blockNumber: number | string = 'latest'
  ): Promise<number> => {
    const block = await this.contract.provider.getBlock(blockNumber)
    if (!block) {
      throw new Error(`expected block. blockNumber: ${blockNumber}`)
    }
    return block.timestamp
  }

  async getTransactionTimestamp (
    txHash: string
  ): Promise<number> {
    const blockNumber = await this.getTransactionBlockNumber(txHash)
    return this.getBlockTimestamp(blockNumber)
  }

  async getEventTimestamp (event: Event): Promise<number> {
    const tx = await event.getBlock()
    if (!tx) {
      return 0
    }
    if (!tx.timestamp) {
      return 0
    }
    return Number(tx.timestamp.toString())
  }

  getCode = async (
    address: string,
    blockNumber: string | number = 'latest'
  ): Promise<string> => {
    return this.contract.provider.getCode(address, blockNumber)
  }

  getBalance = async (
    address: string
  ): Promise<BigNumber> => {
    if (!address) {
      throw new Error('expected address')
    }
    return this.contract.provider.getBalance(address)
  }

  protected getGasPrice = async (): Promise<BigNumber> => {
    return this.contract.provider.getGasPrice()
  }

  protected async getBumpedGasPrice (multiplier: number): Promise<BigNumber> {
    const gasPrice = await this.getGasPrice()
    return getBumpedGasPrice(gasPrice, multiplier)
  }

  async txOverrides (): Promise<TxOverrides> {
    const txOptions: TxOverrides = {}
    if (globalConfig.isMainnet) {
      // Not all Polygon nodes follow recommended 30 Gwei gasPrice
      // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
      if (this.chainSlug === Chain.Polygon) {
        txOptions.gasPrice = await this.getBumpedGasPrice(1)

        const gasPriceBn = BigNumber.from(txOptions.gasPrice)
        if (gasPriceBn.lt(MinPolygonGasPrice)) {
          txOptions.gasPrice = MinPolygonGasPrice
        }
      } else if (this.chainSlug === Chain.Gnosis) {
        // increasing more gas multiplier for gnosis
        // to avoid the error "code:-32010, message: FeeTooLowToCompete"
        const multiplier = 3
        txOptions.gasPrice = await this.getBumpedGasPrice(multiplier)

        const gasPriceBn = BigNumber.from(txOptions.gasPrice)
        if (gasPriceBn.lt(MinGnosisGasPrice)) {
          txOptions.gasPrice = MinGnosisGasPrice
        }
      }
    } else {
      if (this.chainSlug === Chain.Gnosis) {
        txOptions.gasPrice = 50_000_000_000
        txOptions.gasLimit = 10_000_000
      } else if (this.chainSlug === Chain.Polygon) {
        txOptions.gasLimit = 10_000_000
      } else if (this.chainSlug === Chain.Linea) {
        txOptions.gasLimit = 10_000_000
      }
    }

    return txOptions
  }
}
