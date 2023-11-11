import AbstractChainBridge from '../AbstractChainBridge'
import { IChainBridge } from '../IChainBridge'
import { providers } from 'ethers'

type Message = string
type MessageStatus = string

class ZkSyncBridge extends AbstractChainBridge<Message, MessageStatus> implements IChainBridge {
  async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }

  protected async sendRelayTransaction (message: Message): Promise<providers.TransactionResponse> {
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

  protected async isMessageCheckpointed (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }
}

export default ZkSyncBridge
