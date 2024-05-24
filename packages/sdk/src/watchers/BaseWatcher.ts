import { Base, ChainProviders } from '../Base.js'
import { Chain } from '#chains/index.js'
import { EventEmitter } from 'eventemitter3'
import { HopBridge } from '../HopBridge.js'
import { TChain, TProvider, TToken } from '../types.js'
import { wait } from '../utils/index.js'
import { TokenModel } from '#models/index.js'

/**
 * @desc Event types for transaction watcher.
 */
export enum Event {
  Receipt = 'receipt',
  SourceTxReceipt = 'sourceTxReceipt',
  DestinationTxReceipt = 'destinationTxReceipt'
}

type WatchOptions = {
  destinationHeadBlockNumber?: number
}

export type Config = {
  network: string
  signer: TProvider
  sourceTxHash: string
  token: TToken
  sourceChain: TChain
  destinationChain: TChain
  options?: WatchOptions
  chainProviders?: ChainProviders
}

export class BaseWatcher extends Base {
  ee: EventEmitter
  sourceTxHash: string
  sourceTx: any
  sourceBlock: any
  sourceReceipt: any
  token: TokenModel
  sourceChain: Chain
  destinationChain: Chain
  pollDelayMs = 10 * 1000
  bridge: HopBridge
  options: any = {}

  constructor (config: Config) {
    super(config.network, config.signer, config.chainProviders)
    const { token, sourceTxHash, sourceChain, destinationChain, options } = config
    this.token = this.toTokenModel(token)
    this.sourceTxHash = sourceTxHash
    this.sourceChain = this.toChainModel(sourceChain)
    this.destinationChain = this.toChainModel(destinationChain)
    this.options = options
    this.ee = new EventEmitter()
  }

  public async startBase () {
    this.bridge = new HopBridge(this.network, this.signer, this.token)

    const sourceChainProvider = this.getChainProvider(this.sourceChain)
    const receipt = await sourceChainProvider.waitForTransaction(
      this.sourceTxHash
    )
    await this.emitSourceTxEvent(receipt)
    if (!receipt?.status) {
      return
    }
    const sourceTx = await sourceChainProvider.getTransaction(
      this.sourceTxHash
    )
    if (!sourceTx?.blockNumber) {
      return
    }
    const sourceBlock = await sourceChainProvider.getBlock(
      sourceTx.blockNumber
    )
    if (!sourceBlock) {
      return
    }
    this.sourceTx = sourceTx
    this.sourceBlock = sourceBlock
    this.sourceReceipt = receipt
  }

  async poll (pollFn: any) {
    try {
      if (!pollFn) {
        return
      }
      let res = false
      while (!res) {
        res = await pollFn()
        await wait(this.pollDelayMs)
      }
    } catch (err) {
      this.ee.emit('error', err)
    }
  }

  async emitSourceTxEvent (receipt: any) {
    this.ee.emit(Event.Receipt, { chain: this.sourceChain, receipt })
    this.ee.emit(Event.SourceTxReceipt, { chain: this.sourceChain, receipt })
  }

  async emitDestTxEvent (destTx: any, data: any = {}) {
    if (!destTx) {
      return false
    }
    const destinationChainProvider = this.getChainProvider(this.destinationChain)
    const destTxReceipt = await destinationChainProvider.waitForTransaction(
      destTx.hash
    )
    this.ee.emit(
      Event.Receipt,
      Object.assign(
        {
          chain: this.destinationChain,
          receipt: destTxReceipt
        },
        data
      )
    )
    this.ee.emit(
      Event.DestinationTxReceipt,
      Object.assign(
        {
          chain: this.destinationChain,
          receipt: destTxReceipt
        },
        data
      )
    )
    return true
  }
}
