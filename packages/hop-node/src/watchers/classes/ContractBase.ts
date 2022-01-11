import chainIdToSlug from 'src/utils/chainIdToSlug'
import chainSlugToId from 'src/utils/chainSlugToId'
import getBumpedGasPrice from 'src/utils/getBumpedGasPrice'
import getProviderChainSlug from 'src/utils/getProviderChainSlug'
import { BigNumber, BigNumberish, Contract, providers } from 'ethers'
import { Chain, MinPolygonGasPrice } from 'src/constants'
import { Event, PayableOverrides } from '@ethersproject/contracts'
import { EventEmitter } from 'events'
import { Transaction } from 'src/types'
import { config as globalConfig } from 'src/config'

type TxOverrides = PayableOverrides & {from?: string, value?: BigNumberish}

export default class ContractBase extends EventEmitter {
  contract: Contract
  public chainId: number
  public chainSlug: Chain

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
    this.chainId = chainSlugToId(chainSlug)! // eslint-disable-line
  }

  getChainId = async (): Promise<number> => {
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

  getTransaction = async (txHash: string): Promise<Transaction> => {
    if (!txHash) {
      throw new Error('tx hash is required')
    }
    return await this.contract.provider.getTransaction(txHash)
  }

  getTransactionReceipt = async (
    txHash: string
  ): Promise<providers.TransactionReceipt> => {
    return await this.contract.provider.getTransactionReceipt(txHash)
  }

  getBlockNumber = async (): Promise<number> => {
    return await this.contract.provider.getBlockNumber()
  }

  getTransactionBlockNumber = async (txHash: string): Promise<number> => {
    const tx = await this.contract.provider.getTransaction(txHash)
    if (!tx) {
      throw new Error(`transaction not found. transactionHash: ${txHash}`)
    }
    return tx.blockNumber! // eslint-disable-line
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
    return await this.getBlockTimestamp(blockNumber)
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
    return await this.contract.provider.getCode(address, blockNumber)
  }

  getBalance = async (
    address: string
  ): Promise<BigNumber> => {
    if (!address) {
      throw new Error('expected address')
    }
    return await this.contract.provider.getBalance(address)
  }

  protected getGasPrice = async (): Promise<BigNumber> => {
    return await this.contract.provider.getGasPrice()
  }

  protected async getBumpedGasPrice (multiplier: number): Promise<BigNumber> {
    const gasPrice = await this.getGasPrice()
    return getBumpedGasPrice(gasPrice, multiplier)
  }

  get waitConfirmations () {
    const chainConfig = globalConfig.networks[this.chainSlug]
    if (!chainConfig) {
      throw new Error(`config for chain ${this.chainSlug} not found`)
    }
    const { waitConfirmations } = chainConfig
    if (waitConfirmations <= 0) {
      throw new Error('expected waitConfirmations to be > 0')
    }
    return waitConfirmations
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
      }

      // increasing more gas multiplier for gnosis
      // to avoid the error "code:-32010, message: FeeTooLowToCompete"
      if (this.chainSlug === Chain.Gnosis) {
        const multiplier = 3
        txOptions.gasPrice = await this.getBumpedGasPrice(multiplier)
      }
    } else {
      if (this.chainSlug === Chain.Gnosis) {
        txOptions.gasPrice = 50_000_000_000
        txOptions.gasLimit = 5_000_000
      } else if (this.chainSlug === Chain.Polygon) {
        txOptions.gasLimit = 5_000_000
      }
    }

    return txOptions
  }
}
