import {
  AbstractMessageService,
  IMessageService,
  MessageDirection
} from 'src/chains/Services/AbstractMessageService'
import { DefaultL1RelayGasLimit } from 'src/chains/Services/AbstractMessageService'
import {
  IL1ToL2MessageWriter,
  IL2ToL1MessageWriter,
  L1ToL2MessageStatus,
  L1TransactionReceipt,
  L2ToL1MessageStatus,
  L2TransactionReceipt
} from '@arbitrum/sdk'
import { Overrides, providers } from 'ethers'

type Message = IL1ToL2MessageWriter | IL2ToL1MessageWriter
type MessageStatus = L1ToL2MessageStatus | L2ToL1MessageStatus

export class ArbitrumMessageService extends AbstractMessageService<Message, MessageStatus> implements IMessageService {
  protected async sendRelayTx (message: Message, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return (message as IL1ToL2MessageWriter).redeem()
    }

    const overrides: Overrides = {
      gasLimit: DefaultL1RelayGasLimit
    }
    return (message as IL2ToL1MessageWriter).execute(this.l2Wallet.provider!, overrides)
  }

  protected async getMessage (txHash: string, messageDirection: MessageDirection, messageIndex?: number): Promise<Message> {
    messageIndex ??= 0
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return this.#getL1ToL2Message(txHash, messageIndex)
    }
    return this.#getL2ToL1Message(txHash, messageIndex)
  }

  async #getL1ToL2Message (txHash: string, messageIndex: number): Promise<Message> {
    const txReceipt: providers.TransactionReceipt = await this.l1Wallet.provider!.getTransactionReceipt(txHash)
    if (!txReceipt) {
      throw new Error(`txReceipt not found for tx hash ${txHash}`)
    }
    const arbitrumTxReceipt: L1TransactionReceipt = new L1TransactionReceipt(txReceipt)
    const messages: Message[] = await arbitrumTxReceipt.getL1ToL2Messages(this.l2Wallet) as Message[]
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }

    return messages[messageIndex]
  }

  async #getL2ToL1Message (txHash: string, messageIndex: number): Promise<Message> {
    const txReceipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(txHash)
    if (!txReceipt) {
      throw new Error(`txReceipt not found for tx hash ${txHash}`)
    }
    const arbitrumTxReceipt: L2TransactionReceipt = new L2TransactionReceipt(txReceipt)
    const messages: Message[] = await arbitrumTxReceipt.getL2ToL1Messages(this.l1Wallet, this.l2Wallet.provider!) as Message[]
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }

    return messages[messageIndex]
  }

  protected async getMessageStatus (message: Message, messageDirection: MessageDirection): Promise<MessageStatus> {
    // Note: the rateLimitRetry provider should not retry if calls fail here so it doesn't exponentially backoff as it retries an on-chain call
    const statusInput: any = {}
    if (messageDirection === MessageDirection.L2_TO_L1) {
      statusInput.l2Provider = this.l2Wallet.provider!
    }
    return message.status(statusInput)
  }

  protected isMessageInFlight (messageStatus: MessageStatus, messageDirection: MessageDirection): boolean {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return messageStatus === L1ToL2MessageStatus.NOT_YET_CREATED
    }
    return messageStatus === L2ToL1MessageStatus.UNCONFIRMED
  }

  protected isMessageRelayable (messageStatus: MessageStatus, messageDirection: MessageDirection): boolean {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return messageStatus === L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2
    }
    return messageStatus === L2ToL1MessageStatus.CONFIRMED
  }

  protected isMessageRelayed (messageStatus: MessageStatus, messageDirection: MessageDirection): boolean {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return messageStatus === L1ToL2MessageStatus.REDEEMED
    }
    return messageStatus === L2ToL1MessageStatus.EXECUTED
  }
}
