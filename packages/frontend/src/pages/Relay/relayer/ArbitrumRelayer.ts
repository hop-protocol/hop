import {
  type ParentToChildMessageWriter,
  type ChildToParentMessageWriter,
  ParentToChildMessageStatus,
  ParentTransactionReceipt,
  ChildToParentMessageStatus,
  ChildTransactionReceipt
} from '@arbitrum/sdk'
import type { Overrides, Signer, providers } from 'ethers'
import { MessageDirection } from './types.js'
import { Relayer } from './Relayer.js'
import { NetworkSlug, ChainSlug } from '@hop-protocol/sdk'

type Message = ParentToChildMessageWriter | ChildToParentMessageWriter
type MessageStatus = ParentToChildMessageStatus | ChildToParentMessageStatus

type Provider = providers.Provider

const DefaultL1RelayGasLimit = 1_000_000

export class ArbitrumRelayer extends Relayer<Message, MessageStatus> {
  constructor (networkSlug: NetworkSlug, chainSlug: ChainSlug, l1Wallet: Signer | Provider, l2Wallet: Signer | Provider) {
    super(networkSlug, chainSlug, l1Wallet, l2Wallet)
  }

  protected async sendRelayTx (message: Message, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return (message as ParentToChildMessageWriter).redeem()
    }

    const overrides: Overrides = {
      gasLimit: DefaultL1RelayGasLimit
    }
    return (message as ChildToParentMessageWriter).execute(this.l2Wallet as Provider, overrides)
  }

  protected async getMessage (txHash: string, messageDirection: MessageDirection, messageIndex?: number): Promise<Message> {
    messageIndex ??= 0
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return this.#getL1ToL2Message(txHash, messageIndex)
    }
    return this.#getL2ToL1Message(txHash, messageIndex)
  }

  async #getL1ToL2Message (txHash: string, messageIndex: number): Promise<Message> {
    const txReceipt: providers.TransactionReceipt = await (this.l1Wallet as Provider).getTransactionReceipt(txHash)
    if (!txReceipt) {
      throw new Error(`txReceipt not found for tx hash ${txHash}`)
    }
    const arbitrumTxReceipt: ParentTransactionReceipt = new ParentTransactionReceipt(txReceipt)
    const messages: Message[] = await arbitrumTxReceipt.getParentToChildMessages(this.l2Wallet) as Message[]
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }

    const message: Message | undefined = messages[messageIndex]
    if (!message) {
      throw new Error(`could not find message at index ${messageIndex}`)
    }
    return message
  }

  async #getL2ToL1Message (txHash: string, messageIndex: number): Promise<Message> {
    const txReceipt: providers.TransactionReceipt = await (this.l2Wallet as Provider).getTransactionReceipt(txHash)
    if (!txReceipt) {
      throw new Error(`txReceipt not found for tx hash ${txHash}`)
    }
    const arbitrumTxReceipt: ChildTransactionReceipt = new ChildTransactionReceipt(txReceipt)
    const messages: Message[] = await arbitrumTxReceipt.getChildToParentMessages(this.l1Wallet) as Message[]
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }

    const message: Message | undefined = messages[messageIndex]
    if (!message) {
      throw new Error(`could not find message at index ${messageIndex}`)
    }
    return message
  }

  protected async getMessageStatus (message: Message, messageDirection: MessageDirection): Promise<MessageStatus> {
    // Note: the rateLimitRetry provider should not retry if calls fail here so it doesn't exponentially backoff as it retries an on-chain call
    const statusInput: any = {}
    if (messageDirection === MessageDirection.L2_TO_L1) {
      return message.status(this.l2Wallet as Provider)
    }
    // TODO: Shouldn't need to cast
    return (message as ParentToChildMessageWriter).status()
  }

  protected isMessageInFlight (messageStatus: MessageStatus, messageDirection: MessageDirection): boolean {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return messageStatus === ParentToChildMessageStatus.NOT_YET_CREATED
    }
    return messageStatus === ChildToParentMessageStatus.UNCONFIRMED
  }

  protected isMessageRelayable (messageStatus: MessageStatus, messageDirection: MessageDirection): boolean {
    console.log('messageStatus', messageStatus, ChildToParentMessageStatus)
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return messageStatus === ParentToChildMessageStatus.FUNDS_DEPOSITED_ON_CHILD
    }
    return messageStatus === ChildToParentMessageStatus.CONFIRMED
  }

  protected isMessageRelayed (messageStatus: MessageStatus, messageDirection: MessageDirection): boolean {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return messageStatus === ParentToChildMessageStatus.REDEEMED
    }
    return messageStatus === ChildToParentMessageStatus.EXECUTED
  }
}
