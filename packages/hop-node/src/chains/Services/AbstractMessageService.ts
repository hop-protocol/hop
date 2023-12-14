import { AbstractService } from 'src/chains/Services/AbstractService'
import { providers } from 'ethers'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Signer } from 'ethers'

export class MessageUnknownError extends Error {}
export class MessageInFlightError extends Error {}
export class MessageRelayedError extends Error {}
export class MessageInvalidError extends Error {}

export enum MessageDirection {
  L1_TO_L2 = 0,
  L2_TO_L1 = 1
}

export interface IMessageService {
  relayL1ToL2Message?(l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse>
  relayL2ToL1Message?(l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse>
}

export abstract class AbstractMessageService<Message, MessageStatus, RelayOptions = null> extends AbstractService {
  protected readonly l1Wallet: Signer
  protected readonly l2Wallet: Signer

  protected abstract getMessage (txHash: string, opts: RelayOptions | null): Promise<Message>
  protected abstract getMessageStatus (message: Message, opts: RelayOptions | null): Promise<MessageStatus>
  protected abstract sendRelayTransaction (message: Message, relayOpts: RelayOptions | null): Promise<providers.TransactionResponse>
  protected abstract isMessageInFlight (messageStatus: MessageStatus): Promise<boolean> | boolean
  protected abstract isMessageRelayable (messageStatus: MessageStatus): Promise<boolean> | boolean
  protected abstract isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> | boolean

  constructor (chainSlug: string) {
    super(chainSlug)

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(this.chainSlug)
  }

  // Call a private method so the validation is guaranteed to run in order
  protected async validateMessageAndSendTransaction (txHash: string, relayOpts: RelayOptions | null = null): Promise<providers.TransactionResponse> {
    return this.#validateMessageAndSendTransaction(txHash, relayOpts)
  }

  async #validateMessageAndSendTransaction (txHash: string, relayOpts: RelayOptions | null): Promise<providers.TransactionResponse> {
    const message: Message = await this.getMessage(txHash, relayOpts)
    const messageStatus: MessageStatus = await this.getMessageStatus(message, relayOpts)
    await this.#validateMessageStatus(messageStatus)
    return this.sendRelayTransaction(message, relayOpts)
  }

  async #validateMessageStatus (messageStatus: MessageStatus): Promise<void> {
    if (!messageStatus) {
      throw new MessageUnknownError('validateMessageStatus: Unknown message status')
    }

    if (await this.isMessageInFlight(messageStatus)) {
      throw new MessageInFlightError('validateMessageStatus: Message has not yet been checkpointed')
    }

    if (await this.isMessageRelayed(messageStatus)) {
      throw new MessageRelayedError('validateMessageStatus: Message has already been relayed')
    }

    // If the message is here but is not relayable, it is in an invalid state
    if (!(await this.isMessageRelayable(messageStatus))) {
      throw new MessageInvalidError('validateMessageStatus: Invalid message state')
    }
  }
}
