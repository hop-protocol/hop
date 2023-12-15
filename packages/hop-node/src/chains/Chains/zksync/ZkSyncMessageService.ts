import { IMessageService, AbstractMessageService } from 'src/chains/Services/AbstractMessageService'
import { providers } from 'ethers'

type MessageType = string
type MessageStatus = string

export class ZkSyncMessageService extends AbstractMessageService<MessageType, MessageStatus> implements IMessageService {

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }
  async relayL2ToL1Message (l2THash: string): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }

  protected async sendRelayTransaction (message: MessageType): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }

  protected async getMessage (txHash: string): Promise<MessageType> {
    throw new Error('implement')
  }

  protected async getMessageStatus (message: MessageType): Promise<MessageStatus> {
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
