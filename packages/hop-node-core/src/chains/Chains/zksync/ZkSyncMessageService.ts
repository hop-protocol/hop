import { AbstractMessageService, IMessageService } from '#chains/Services/AbstractMessageService.js'
import { providers } from 'ethers'

type Message = string
type MessageStatus = string

export class ZkSyncMessageService extends AbstractMessageService<Message, MessageStatus> implements IMessageService {
  protected async sendRelayTx (message: Message): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }

  protected async getMessage (txHash: string): Promise<Message> {
    throw new Error('implement')
  }

  protected async getMessageStatus (message: Message): Promise<MessageStatus> {
    throw new Error('implement')
  }

  protected async isMessageInFlight (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageRelayable (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }
}
