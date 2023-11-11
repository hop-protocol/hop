import { Chain } from 'src/constants'
import {
  FinalityService,
  InclusionService,
  IFinalityService,
  IInclusionService,
  IMessageService,
  MessageService
} from './IChainBridge'
import {
  IChainBridge,
  RelayL1ToL2MessageOpts,
  RelayL2ToL1MessageOpts
} from './IChainBridge'
import { providers } from 'ethers'

abstract class AbstractBridge implements IChainBridge {
  private readonly message: IMessageService | undefined
  private readonly inclusion: IInclusionService | undefined
  private readonly finality: IFinalityService | undefined

  constructor (chainSlug: Chain, Message: MessageService, Inclusion?: InclusionService, Finality?: FinalityService) {
    if (Message) {
      this.message = new Message(chainSlug)
    }
    if (Inclusion) {
      this.inclusion = new Inclusion(chainSlug)
    }
    if (Finality) {
      this.finality = new Finality(chainSlug, this.inclusion)
    }
  }

  relayL1ToL2Message(l1TxHash: string, opts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse> {
    if (!this.message?.relayL1ToL2Message) {
      throw new Error('relayL1ToL2Message not implemented')
    }
    return this.message.relayL1ToL2Message(l1TxHash, opts)
  }

  relayL2ToL1Message (l2TxHash: string, opts?: RelayL2ToL1MessageOpts): Promise<providers.TransactionResponse> {
    if (!this.message?.relayL2ToL1Message) {
      throw new Error('relayL2ToL1Message not implemented')
    }
    return this.message.relayL2ToL1Message(l2TxHash, opts)
  }
  
  getL1InclusionTx(l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusion?.getL1InclusionTx) {
      throw new Error('getL1InclusionTx not implemented')
    }
    return this.inclusion.getL1InclusionTx(l2TxHash)
  }

  getL2InclusionTx(l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.inclusion?.getL2InclusionTx) {
      throw new Error('getL2InclusionTx not implemented')
    }
    return this.inclusion.getL2InclusionTx(l1TxHash)
  }

  getCustomSafeBlockNumber(): Promise<number | undefined> {
    if (!this.finality?.getCustomSafeBlockNumber) {
      throw new Error('getCustomSafeBlockNumber not implemented')
    }
    return this.finality.getCustomSafeBlockNumber()
  }
}

export default AbstractBridge
