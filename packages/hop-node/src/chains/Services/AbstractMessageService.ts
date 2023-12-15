import wallets from 'src/wallets'
import { AbstractService } from 'src/chains/Services/AbstractService'
import { Chain } from 'src/constants'
import { Signer, providers } from 'ethers'

export class MessageUnknownError extends Error {}
export class MessageInFlightError extends Error {}
export class MessageRelayedError extends Error {}
export class MessageInvalidError extends Error {}

export enum MessageDirection {
  L1_TO_L2 = 0,
  L2_TO_L1 = 1
}

export interface IMessageService {
  relayL1ToL2Message(l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse>
  relayL2ToL1Message(l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse>
}

export abstract class AbstractMessageService<Message, MessageStatus, MessageOpts = null> extends AbstractService {
  protected readonly l1Wallet: Signer
  protected readonly l2Wallet: Signer

  protected abstract getMessage (txHash: string, opts: MessageOpts | null): Promise<Message>
  protected abstract getMessageStatus (message: Message, opts: MessageOpts | null): Promise<MessageStatus>
  protected abstract sendRelayTransaction (message: Message, messageOpts: MessageOpts | null): Promise<providers.TransactionResponse>
  protected abstract isMessageInFlight (messageStatus: MessageStatus, messageOpts: MessageOpts | null): Promise<boolean> | boolean
  protected abstract isMessageRelayable (messageStatus: MessageStatus, messageOpts: MessageOpts | null): Promise<boolean> | boolean
  protected abstract isMessageRelayed (messageStatus: MessageStatus, messageOpts: MessageOpts | null): Promise<boolean> | boolean

  constructor (chainSlug: string) {
    super(chainSlug)

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(this.chainSlug)
  }

  /**
   * To be overridden by subclasses that support manual L1 to L2 message relaying
   */
  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('L1 to L2 message relay not supported. Messages may be relayed with a system tx.')
  }

  // Call a private method so the validation is guaranteed to run in order
  protected async validateMessageAndSendTransaction (txHash: string, messageOpts: MessageOpts | null = null): Promise<providers.TransactionResponse> {
    return this.#validateMessageAndSendTransaction(txHash, messageOpts)
  }

  async #validateMessageAndSendTransaction (txHash: string, messageOpts: MessageOpts | null): Promise<providers.TransactionResponse> {
    const message: Message = await this.getMessage(txHash, messageOpts)
    const messageStatus: MessageStatus = await this.getMessageStatus(message, messageOpts)
    await this.#validateMessageStatus(messageStatus, messageOpts)
    return this.sendRelayTransaction(message, messageOpts)
  }

  async #validateMessageStatus (messageStatus: MessageStatus, messageOpts: MessageOpts | null): Promise<void> {
    if (!messageStatus) {
      throw new MessageUnknownError('validateMessageStatus: Unknown message status')
    }

    if (await this.isMessageInFlight(messageStatus, messageOpts)) {
      throw new MessageInFlightError('validateMessageStatus: Message has not yet been checkpointed')
    }

    if (await this.isMessageRelayed(messageStatus, messageOpts)) {
      throw new MessageRelayedError('validateMessageStatus: Message has already been relayed')
    }

    // If the message is here but is not relayable, it is in an invalid state
    if (!(await this.isMessageRelayable(messageStatus, messageOpts))) {
      throw new MessageInvalidError('validateMessageStatus: Invalid message state')
    }
  }
}
