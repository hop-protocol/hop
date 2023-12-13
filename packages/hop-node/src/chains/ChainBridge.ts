import { Chain } from 'src/constants'
import {
  FinalityBlockTag,
  FinalityService,
  IChainBridge,
  InclusionService,
  MessageService
} from 'src/chains/IChainBridge'
import { IFinalityService } from 'src/chains/Services/FinalityService'
import { IInclusionService } from 'src/chains/Services/InclusionService'
import { IMessageService } from 'src/chains/Services/MessageService'
import { providers } from 'ethers'
import { getEnabledNetworks } from 'src/config'

export type ChainBridgeParams = {
  chainSlug: Chain
  Message?: MessageService
  Inclusion?: InclusionService
  Finality?: FinalityService
}

export class ChainBridge implements IChainBridge {
  private readonly chainSlug: Chain
  private readonly message?: IMessageService
  private readonly inclusion?: IInclusionService
  private readonly finality?: IFinalityService

  constructor (params: ChainBridgeParams) {
    const { chainSlug, Message, Inclusion, Finality } = params

    if (!chainSlug) {
      throw new Error('chainSlug not set')
    }

    this.chainSlug = chainSlug

    if (Message) {
      this.message = new Message()
    }
    if (Inclusion) {
      this.inclusion = new Inclusion()
    }
    if (Finality) {
      this.finality = new Finality(this.inclusion)
    }

    const enabledNetworks = getEnabledNetworks()
    if (!enabledNetworks.includes(this.chainSlug)) {
      throw new Error(`Chain ${this.chainSlug} is not enabled`)
    }
  }

  async relayL1ToL2Message (l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    if (!this.message?.relayL1ToL2Message) {
      throw new Error('relayL1ToL2Message not implemented')
    }
    return this.message.relayL1ToL2Message(l1TxHash, messageIndex)
  }

  async relayL2ToL1Message (l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    if (!this.message?.relayL2ToL1Message) {
      throw new Error('relayL2ToL1Message not implemented')
    }
    return this.message.relayL2ToL1Message(l2TxHash, messageIndex)
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusion?.getL1InclusionTx) {
      throw new Error('getL1InclusionTx not implemented')
    }
    return this.inclusion.getL1InclusionTx(l2TxHash)
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusion?.getL2InclusionTx) {
      throw new Error('getL2InclusionTx not implemented')
    }
    return this.inclusion.getL2InclusionTx(l1TxHash)
  }

  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (!this.finality?.getCustomBlockNumber) {
      throw new Error('getCustomBlockNumber not implemented')
    }
    return this.finality.getCustomBlockNumber(blockTag)
  }

  hasOwnImplementation (methodName: keyof ChainBridge): boolean {
    const baseMethod = ChainBridge.prototype[methodName]
    const derivedMethod = Object.getPrototypeOf(this)[methodName]
    return derivedMethod !== baseMethod
  }
}
