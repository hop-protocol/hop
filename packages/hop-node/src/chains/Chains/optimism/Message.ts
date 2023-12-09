import {
  CrossChainMessage,
  CrossChainMessenger,
  MessageStatus
} from '@eth-optimism/sdk'
import { IMessageService, MessageDirection, MessageService } from '../../Services/MessageService'
import { config as globalConfig } from 'src/config'
import { networkSlugToId } from 'src/utils/networkSlugToId'
import { providers } from 'ethers'

type RelayOpts = {
  messageDirection: MessageDirection
  messageIndex: number
}

export class OptimismMessageService extends MessageService<CrossChainMessage, MessageStatus, RelayOpts> implements IMessageService {
  private readonly csm: CrossChainMessenger

  constructor () {
    super()

    this.csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: networkSlugToId(globalConfig.network),
      l2ChainId: this.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })
  }

  async relayL1ToL2Message (l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L1_TO_L2,
      messageIndex: messageIndex ?? 0
    }
    return this.validateMessageAndSendTransaction(l1TxHash, relayOpts)
  }

  async relayL2ToL1Message (l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L2_TO_L1,
      messageIndex: messageIndex ?? 0
    }
    return this.validateMessageAndSendTransaction(l2TxHash, relayOpts)
  }

  protected async sendRelayTransaction (message: CrossChainMessage, relayOpts: RelayOpts): Promise<providers.TransactionResponse> {
    const { messageDirection } = relayOpts
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return this.csm.proveMessage(message)
    } else {
      // Need an arbitrary value that will always succeed
      // Signer is needed to execute tx with SDK
      const gasLimit = 1000000
      const txOpts: any = {
        signer: this.l2Wallet,
        overrides: {
          gasLimit
        }
      }
      return this.csm.resendMessage(message, txOpts)
    }
  }

  protected async getMessage (txHash: string, relayOpts: RelayOpts): Promise<CrossChainMessage> {
    const { messageIndex } = relayOpts

    const messages: CrossChainMessage[] = await this.csm.getMessagesByTransaction(txHash)
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }
    return messages[messageIndex]
  }

  protected async getMessageStatus (message: CrossChainMessage): Promise<MessageStatus> {
    return this.csm.getMessageStatus(message.transactionHash)
  }

  protected isMessageInFlight (messageStatus: MessageStatus): boolean {
    return (
      messageStatus === MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
      messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED
    )
  }

  protected isMessageRelayable (messageStatus: MessageStatus): boolean {
    return messageStatus === MessageStatus.READY_FOR_RELAY
  }

  protected isMessageRelayed (messageStatus: MessageStatus): boolean {
    return messageStatus === MessageStatus.RELAYED
  }
}
