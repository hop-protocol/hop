import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import {
  IL1ToL2MessageWriter,
  IL2ToL1MessageWriter,
  L1ToL2MessageStatus,
  L1TransactionReceipt,
  L2ToL1MessageStatus,
  L2TransactionReceipt
} from '@arbitrum/sdk'
import {
  IMessageService,
  MessageDirection,
  MessageService
} from '../../Services/MessageService'
import { providers } from 'ethers'

type MessageType = IL1ToL2MessageWriter | IL2ToL1MessageWriter
type MessageStatus = L1ToL2MessageStatus | L2ToL1MessageStatus
type RelayOpts = {
  messageDirection: MessageDirection
  messageIndex: number
}

export class ArbitrumMessageService extends MessageService<MessageType, MessageStatus, RelayOpts> implements IMessageService {
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

  protected async sendRelayTransaction (message: MessageType, relayOpts: RelayOpts): Promise<providers.TransactionResponse> {
    const { messageDirection } = relayOpts
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return (message as IL1ToL2MessageWriter).redeem()
    } else {
      const overrides: any = {
        gasLimit: CanonicalMessengerRootConfirmationGasLimit
      }
      return (message as IL2ToL1MessageWriter).execute(this.l2Wallet.provider!, overrides)
    }
  }

  protected async getMessage (txHash: string, relayOpts: RelayOpts): Promise<MessageType> {
    const { messageDirection, messageIndex } = relayOpts

    let messages: MessageType[]
    if (messageDirection === MessageDirection.L1_TO_L2) {
      const txReceipt: providers.TransactionReceipt = await this.l1Wallet.provider!.getTransactionReceipt(txHash)
      if (!txReceipt) {
        throw new Error(`txReceipt not found for tx hash ${txHash}`)
      }
      const arbitrumTxReceipt: L1TransactionReceipt = new L1TransactionReceipt(txReceipt)
      messages = await arbitrumTxReceipt.getL1ToL2Messages(this.l2Wallet.provider!) as MessageType[]
    } else {
      const txReceipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(txHash)
      if (!txReceipt) {
        throw new Error(`txReceipt not found for tx hash ${txHash}`)
      }
      const arbitrumTxReceipt: L2TransactionReceipt = new L2TransactionReceipt(txReceipt)
      messages = await arbitrumTxReceipt.getL2ToL1Messages(this.l1Wallet, this.l2Wallet.provider!) as MessageType[]
    }

    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }

    return messages[messageIndex]
  }

  protected async getMessageStatus (message: MessageType): Promise<MessageStatus> {
    // Note: the rateLimitRetry provider should not retry if calls fail here so it doesn't exponentially backoff as it retries an on-chain call
    const res = await (message as IL1ToL2MessageWriter).waitForStatus()
    return res.status
  }

  protected isMessageInFlight (messageStatus: MessageStatus): boolean {
    return (
      messageStatus === L1ToL2MessageStatus.NOT_YET_CREATED ||
      messageStatus === L2ToL1MessageStatus.UNCONFIRMED
    )
  }

  protected isMessageRelayable (messageStatus: MessageStatus): boolean {
    return (
      messageStatus === L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2 ||
      messageStatus === L2ToL1MessageStatus.CONFIRMED
    )
  }

  protected isMessageRelayed (messageStatus: MessageStatus): boolean {
    return (
      messageStatus === L1ToL2MessageStatus.REDEEMED ||
      messageStatus === L2ToL1MessageStatus.EXECUTED
    )
  }
}
