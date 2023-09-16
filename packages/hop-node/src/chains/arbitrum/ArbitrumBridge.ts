import AbstractBridge from '../AbstractBridge'
import getNonRetryableRpcProvider from 'src/utils/getNonRetryableRpcProvider'
import { IChainBridge, RelayL1ToL2MessageOpts } from '.././IChainBridge'
import { IL1ToL2MessageWriter, L1ToL2MessageStatus, L1TransactionReceipt, L2TransactionReceipt } from '@arbitrum/sdk'
import { providers } from 'ethers'

class ArbitrumBridge extends AbstractBridge implements IChainBridge {
  nonRetryableProvider: providers.Provider

  constructor (chainSlug: string) {
    super(chainSlug)
    this.nonRetryableProvider = getNonRetryableRpcProvider(chainSlug)!
  }

  async relayL1ToL2Message (l1TxHash: string, opts?: RelayL1ToL2MessageOpts): Promise<providers.TransactionResponse> {
    const messageIndex = opts?.messageIndex ?? 0
    this.logger.debug(`attempting to relay L1 to L2 message for l1TxHash: ${l1TxHash} messageIndex: ${messageIndex}`)
    const status = await this._getMessageStatus(l1TxHash, messageIndex)
    if (status !== L1ToL2MessageStatus.FUNDS_DEPOSITED_ON_L2) {
      this.logger.error(`Transaction not redeemable. Status: ${L1ToL2MessageStatus[status]}, l1TxHash: ${l1TxHash}`)
      throw new Error('Transaction unredeemable')
    }

    this.logger.debug(`getL1ToL2Message for l1TxHash: ${l1TxHash} messageIndex: ${messageIndex}`)
    const l1ToL2Message = await this._getL1ToL2Message(l1TxHash, messageIndex)
    this.logger.debug(`attempting l1ToL2Message.redeem() for l1TxHash: ${l1TxHash} messageIndex: ${messageIndex}`)
    return await l1ToL2Message.redeem()
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const txReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const initiatingTxnReceipt = new L2TransactionReceipt(
      txReceipt
    )

    if (!initiatingTxnReceipt) {
      throw new Error(
        `no arbitrum transaction found for tx hash ${l2TxHash}`
      )
    }

    const outGoingMessagesFromTxn = await initiatingTxnReceipt.getL2ToL1Messages(this.l1Wallet, this.l2Wallet.provider!)
    if (outGoingMessagesFromTxn.length === 0) {
      throw new Error(`tx hash ${l2TxHash} did not initiate an outgoing messages`)
    }

    const msg: any = outGoingMessagesFromTxn[0]
    if (!msg) {
      throw new Error(`msg not found for tx hash ${l2TxHash}`)
    }

    return msg.execute(this.l2Wallet.provider)
  }

  private async _getL1ToL2Message (l1TxHash: string, messageIndex: number = 0, useNonRetryableProvider: boolean = false): Promise<IL1ToL2MessageWriter> {
    const l1ToL2Messages = await this._getL1ToL2Messages(l1TxHash, useNonRetryableProvider)
    return l1ToL2Messages[messageIndex]
  }

  private async _getL1ToL2Messages (l1TxHash: string, useNonRetryableProvider: boolean = false): Promise<IL1ToL2MessageWriter[]> {
    const l2Wallet = useNonRetryableProvider ? this.l2Wallet.connect(this.nonRetryableProvider) : this.l2Wallet
    const txReceipt = await this.l1Wallet.provider!.getTransactionReceipt(l1TxHash)
    const l1TxnReceipt = new L1TransactionReceipt(txReceipt)
    return l1TxnReceipt.getL1ToL2Messages(l2Wallet)
  }

  private async _getMessageStatus (l1TxHash: string, messageIndex: number = 0): Promise<L1ToL2MessageStatus> {
    // We cannot use our provider here because the SDK will rateLimitRetry and exponentially backoff as it retries an on-chain call
    const useNonRetryableProvider = true
    const l1ToL2Message = await this._getL1ToL2Message(l1TxHash, messageIndex, useNonRetryableProvider)
    const res = await l1ToL2Message.waitForStatus()
    return res.status
  }
}

export default ArbitrumBridge
