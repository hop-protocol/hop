import { IL1ToL2MessageReader, IL1ToL2MessageWriter, L1ToL2MessageStatus, L1TransactionReceipt, L2TransactionReceipt } from '@arbitrum/sdk'
import { providers } from 'ethers'

export class ArbitrumRelayer {
  network: string
  l1Provider: any
  l2Provider: any

  constructor (network: string = 'goerli', l1Provider: providers.Provider, l2Provider: providers.Provider) {
    this.network = network
    this.l1Provider = l1Provider
    this.l2Provider = l2Provider
  }

  async getExitPopulatedTx (l2TxHash: string): Promise<any> {
    const l2Receipt = await this.l2Provider.getTransactionReceipt(l2TxHash)
    const initiatingTxReceipt = new L2TransactionReceipt(l2Receipt)

    if (!initiatingTxReceipt) {
      throw new Error('Could not find initiating transaction')
    }

    const outgoingMessagesFromTx = await initiatingTxReceipt.getL2ToL1Messages(this.l1Provider, this.l2Provider)
    if (outgoingMessagesFromTx.length === 0) {
      throw new Error('Could not find outgoing message')
    }

    const msg: any = outgoingMessagesFromTx[0]
    if (!msg) {
      throw new Error('Could not find outgoing message')
    }

    // TODO: return populated tx only
    return msg.execute(this.l2Provider)
  }

  async redeemArbitrumTransaction (l1TxHash: string, messageIndex : number = 0): Promise<providers.TransactionResponse> {
    const status = await this.getMessageStatus(l1TxHash, messageIndex)
    if (status !== L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2) {
      throw new Error('Message not deposited on L2')
    }

    const l1ToL2Message: any = await this.getL1ToL2Message(l1TxHash, messageIndex)
    return l1ToL2Message.redeem(this.l1Provider)
  }

  async getMessageStatus (l1TxHash: string, messageIndex : number = 0) : Promise<L1ToL2MessageStatus> {
    const l1ToL2Message = await this.getL1ToL2Message(l1TxHash, messageIndex)
    const res = await l1ToL2Message.waitForStatus()
    return res.status
  }

  async getL1ToL2Message (l1TxHash: string, messageIndex : number = 0): Promise<IL1ToL2MessageWriter | IL1ToL2MessageReader> {
    const l1ToL2Messages = await this.getL1ToL2Messages(l1TxHash)
    if (!l1ToL2Messages) {
      throw new Error('Could not find L1ToL2Message')
    }
    return l1ToL2Messages[messageIndex]
  }

  async getL1ToL2Messages (l1TxHash: string): Promise<any[]> {
    const l1Receipt = await this.l1Provider.getTransactionReceipt(l1TxHash)
    const l1TxReceipt = new L1TransactionReceipt(l1Receipt)
    return l1TxReceipt.getL1ToL2Messages(this.l2Provider)
  }

  async isTransactionRedeemed (l1TxHash: string, messageIndex : number = 0): Promise<boolean> {
    const status = await this.getMessageStatus(l1TxHash, messageIndex)
    return status === L1ToL2MessageStatus.REDEEMED
  }
}
