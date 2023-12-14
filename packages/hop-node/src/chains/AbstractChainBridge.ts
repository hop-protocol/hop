import {
  ChainServices,
  FinalityBlockTag,
  IChainBridge
} from 'src/chains/IChainBridge'
import { IFinalityService } from 'src/chains/Services/AbstractFinalityService'
import { IMessageService } from 'src/chains/Services/AbstractMessageService'
import { getEnabledNetworks } from 'src/config'
import { providers } from 'ethers'

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
  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    if (!this.finalityService?.getCustomBlockNumber) {
      throw new Error('getCustomBlockNumber not implemented')
    }
    return this.finalityService.getCustomBlockNumber(blockTag)
  }

  hasOwnImplementation (methodName: keyof AbstractChainBridge): boolean {
    const baseMethod = AbstractChainBridge.prototype[methodName]
    const derivedMethod = Object.getPrototypeOf(this)[methodName]
    return derivedMethod !== baseMethod
  }
}
