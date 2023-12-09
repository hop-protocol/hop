import wallets from 'src/wallets'
import { CacheService } from './Services/CacheService'
import { Chain } from 'src/constants'
import { FinalityBlockTag } from 'src/chains/IChainBridge'
import {
  FinalityService,
  IChainBridge,
  InclusionService,
  MessageService
} from './IChainBridge'
import { IFinalityService } from './Services/FinalityService'
import { IInclusionService } from './Services/InclusionService'
import { IMessageService } from './Services/MessageService'
import { Logger } from 'src/logger'
import { Signer, providers } from 'ethers'
import { chainSlugToId } from 'src/utils/chainSlugToId'

abstract class AbstractChainBridge extends CacheService implements IChainBridge {
  private readonly message: IMessageService | undefined
  private readonly inclusion: IInclusionService | undefined
  private readonly finality: IFinalityService | undefined

  logger: Logger
  chainSlug: string
  chainId: number
  l1Wallet: Signer
  l2Wallet: Signer

  constructor (chainSlug: Chain, Message: MessageService, Inclusion?: InclusionService, Finality?: FinalityService) {
    super()
    this.message = new Message(chainSlug)
    if (Inclusion) {
      this.inclusion = new Inclusion(chainSlug)
    }
    if (Finality) {
      this.finality = new Finality(chainSlug, this.inclusion)
    }

    // Set up config
    this.chainSlug = chainSlug
    this.chainId = chainSlugToId(chainSlug)
    const prefix = `${this.chainSlug}`
    const tag = this.constructor.name
    this.logger = new Logger({
      tag,
      prefix,
      color: 'blue'
    })

    // Set up signers
    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(chainSlug)
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
}

export default AbstractChainBridge
