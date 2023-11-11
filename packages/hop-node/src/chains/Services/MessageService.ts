import AbstractService from './AbstractService'
import { providers } from 'ethers'

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
  relayL2ToL1Message (l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse>
}

abstract class MessageService<T, U, V = null> extends AbstractService {
  protected abstract getMessage (txHash: string, opts: V | null): Promise<T>
  protected abstract getMessageStatus (message: T, opts: V | null): Promise<U>
  protected abstract sendRelayTransaction (message: T, opts: V | null): Promise<providers.TransactionResponse>
  protected abstract isMessageInFlight (messageStatus: U): Promise<boolean> | boolean
  protected abstract isMessageRelayable (messageStatus: U): Promise<boolean> | boolean
  protected abstract isMessageRelayed (messageStatus: U): Promise<boolean> | boolean

  // Call a private method so the validation is guaranteed to run in order
  protected async validateMessageAndSendTransaction (txHash: string, relayOpts: V | null = null): Promise<providers.TransactionResponse> {
    return this._validateMessageAndSendTransaction(txHash, relayOpts)
  }

  private async _validateMessageAndSendTransaction (txHash: string, relayOpts: V | null): Promise<providers.TransactionResponse> {
    const message: T = await this.getMessage(txHash, relayOpts)
    const messageStatus: U = await this.getMessageStatus(message, relayOpts)
    await this.validateMessageStatus(messageStatus)
    return this.sendRelayTransaction(message, relayOpts)
  }

  private async validateMessageStatus (messageStatus: U): Promise<void> {
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

export default MessageService
