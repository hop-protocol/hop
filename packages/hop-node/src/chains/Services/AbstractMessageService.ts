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

/**
 * @todo Future features:
 * - messageDirection and messageIndex should in a single object, along with child class specific options, such
 *   as messageBlockNumber or API response. They should all be optional. The former two items resolve the case
 *   where a getMessage call by a child class needs the messageIndex but not the direction. The latter allows
 *   for cacheing of data that is used in multiple methods, such as the block number of a message so that it
 *   does not need to be derived via an RPC call for each status check method.
 */

export abstract class AbstractMessageService<Message, MessageStatus> extends AbstractService implements IMessageService {
  protected readonly l1Wallet: Signer
  protected readonly l2Wallet: Signer

  protected abstract sendRelayTx (message: Message, messageDirection?: MessageDirection): Promise<providers.TransactionResponse>

  protected abstract getMessage (txHash: string, messageDirection?: MessageDirection, messageIndex?: number): Promise<Message>
  protected abstract getMessageStatus (message: Message, messageDirection: MessageDirection): Promise<MessageStatus>

  protected abstract isMessageInFlight (messageStatus: MessageStatus, messageDirection?: MessageDirection): Promise<boolean> | boolean
  protected abstract isMessageRelayable (messageStatus: MessageStatus, messageDirection?: MessageDirection): Promise<boolean> | boolean
  protected abstract isMessageRelayed (messageStatus: MessageStatus, messageDirection?: MessageDirection): Promise<boolean> | boolean

  constructor (chainSlug: string) {
    super(chainSlug)

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(this.chainSlug)
  }

  setup() {
    console.log("hi")
  }

  /**
   *  Public Interface Methods
   *  @dev Do not override these methods in subclasses unless you know what you are doing
   *  @dev If a subclass does not implement relays for a certain direction, override this method and throw
   */

  async relayL1ToL2Message (l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    const messageDirection: MessageDirection = MessageDirection.L1_TO_L2
    return this.#relayMessage(l1TxHash, messageDirection, messageIndex)
  }

  async relayL2ToL1Message (l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    const messageDirection: MessageDirection = MessageDirection.L2_TO_L1
    return this.#relayMessage(l2TxHash, messageDirection, messageIndex)
  }

  /**
   * Internal Methods
   */

  async #relayMessage (txHash: string, messageDirection: MessageDirection, messageIndex?: number): Promise<providers.TransactionResponse> {
    const message: Message = await this.getMessage(txHash, messageDirection, messageIndex)
    await this.#validateMessage(message, messageDirection)
    return this.sendRelayTx(message, messageDirection)
  }

  async #validateMessage (message: Message, messageDirection: MessageDirection): Promise<void> {
    const messageStatus: MessageStatus = await this.getMessageStatus(message, messageDirection)
    await this.#validateMessageStatus(messageStatus, messageDirection)
  }

  async #validateMessageStatus (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<void> {
    if (!messageStatus) {
      throw new MessageUnknownError('validateMessageStatus: Unknown message status')
    }

    if (await this.isMessageInFlight(messageStatus, messageDirection)) {
      throw new MessageInFlightError('validateMessageStatus: Message has not yet been checkpointed')
    }

    if (await this.isMessageRelayed(messageStatus, messageDirection)) {
      throw new MessageRelayedError('validateMessageStatus: Message has already been relayed')
    }

    // If the message is here but is not relayable, it is in an invalid state
    if (!(await this.isMessageRelayable(messageStatus, messageDirection))) {
      throw new MessageInvalidError('validateMessageStatus: Invalid message state')
    }
  }
}
