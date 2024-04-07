import type {
  ChainServices,
  IChainBridge
} from './IChainBridge.js'
import type {
  FinalityBlockTag
} from './IChainBridge.js'
import type { IFinalityService } from './Services/AbstractFinalityService.js'
import type { IMessageService } from './Services/AbstractMessageService.js'
import type { providers } from 'ethers'

type ChainBridgeParams = {
  chainSlug: string
  chainServices: ChainServices
}

export abstract class AbstractChainBridge implements IChainBridge {
  readonly #messageService: IMessageService
  readonly #finalityService: IFinalityService

  constructor (params: ChainBridgeParams) {
    const { chainSlug, chainServices } = params

    // let ab = 333
    // console.log(ab)
    // const abc = 123

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
