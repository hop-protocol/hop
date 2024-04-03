import {
  ChainServices,
  FinalityBlockTag,
  IChainBridge
} from './IChainBridge.js'
import { IFinalityService } from './Services/AbstractFinalityService.js'
import { IMessageService } from './Services/AbstractMessageService.js'
import { providers } from 'ethers'

type ChainBridgeParams = {
  chainSlug: string
  chainServices: ChainServices
}

export abstract class AbstractChainBridge implements IChainBridge {
  readonly #messageService: IMessageService
  readonly #finalityService: IFinalityService

  constructor (params: ChainBridgeParams) {
    const { chainSlug, chainServices } = params

    if (!chainSlug) {
      throw new Error('chainSlug not set')
    }

    this.#messageService = chainServices.messageService
    this.#finalityService = chainServices.finalityService
  }

  async relayL1ToL2Message (l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    return this.#messageService.relayL1ToL2Message(l1TxHash, messageIndex)
  }

  async relayL2ToL1Message (l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    return this.#messageService.relayL2ToL1Message(l2TxHash, messageIndex)
  }

  async getCustomBlockNumber (blockTag: FinalityBlockTag): Promise<number | undefined> {
    return this.#finalityService.getCustomBlockNumber(blockTag)
  }
}
