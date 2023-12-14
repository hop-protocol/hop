import {
  ChainServices,
  FinalityBlockTag,
  IChainBridge,
} from 'src/chains/IChainBridge'
import { IFinalityService } from 'src/chains/Services/FinalityService'
import { IMessageService } from 'src/chains/Services/MessageService'
import { providers } from 'ethers'
import { getEnabledNetworks } from 'src/config'

type ChainBridgeParams = {
  chainSlug: string
  chainServices?: ChainServices
}

export abstract class AbstractChainBridge implements IChainBridge {
  private readonly messageService?: IMessageService
  private readonly finalityService?: IFinalityService

  constructor (params: ChainBridgeParams) {
    const { chainSlug, chainServices } = params
    const { messageService, finalityService } = chainServices ?? {}

    if (!chainSlug) {
      throw new Error('chainSlug not set')
    }

    this.messageService = messageService
    this.finalityService = finalityService

    const enabledNetworks = getEnabledNetworks()
    if (!enabledNetworks.includes(chainSlug)) {
      throw new Error(`Chain ${chainSlug} is not enabled`)
    }
  }

  async relayL1ToL2Message (l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    if (!this.messageService?.relayL1ToL2Message) {
      throw new Error('relayL1ToL2Message not implemented')
    }
    return this.messageService.relayL1ToL2Message(l1TxHash, messageIndex)
  }

  async relayL2ToL1Message (l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    if (!this.messageService?.relayL2ToL1Message) {
      throw new Error('relayL2ToL1Message not implemented')
    }
    return this.messageService.relayL2ToL1Message(l2TxHash, messageIndex)
  }

  async getL1InclusionTx (l2TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.finalityService?.getL1InclusionTx) {
      throw new Error('getL1InclusionTx not implemented')
    }
    return this.finalityService.getL1InclusionTx(l2TxHash)
  }

  async getL2InclusionTx (l1TxHash: string): Promise<providers.TransactionReceipt | undefined> {
    if (!this.finalityService?.getL2InclusionTx) {
      throw new Error('getL2InclusionTx not implemented')
    }
    return this.finalityService.getL2InclusionTx(l1TxHash)
  }

  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (!this.finalityService?.getCustomBlockNumber) {
      throw new Error('getCustomBlockNumber not implemented')
    }
    return this.finalityService.getCustomBlockNumber(blockTag)
  }


  hasOwnImplementation(methodName: keyof IChainBridge): boolean {
    switch (methodName) {
      case 'relayL1ToL2Message':
        return !!this.messageService?.relayL1ToL2Message;
      case 'relayL2ToL1Message':
        return !!this.messageService?.relayL2ToL1Message;
      case 'getL1InclusionTx':
        return !!this.finalityService?.getL1InclusionTx;
      case 'getL2InclusionTx':
        return !!this.finalityService?.getL2InclusionTx;
      case 'getCustomBlockNumber':
        return !!this.finalityService?.getCustomBlockNumber;
      default:
        return false;
    }
  }
}
