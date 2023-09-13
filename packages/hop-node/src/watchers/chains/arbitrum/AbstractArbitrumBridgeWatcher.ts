import BaseWatcher from '../../classes/BaseWatcher'
import Logger from 'src/logger'
import getNonRetryableRpcProvider from 'src/utils/getNonRetryableRpcProvider'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { IChainWatcher, RelayL1ToL2MessageOpts } from '../../classes/IChainWatcher'
import { IL1ToL2MessageWriter, L1ToL2MessageStatus, L1TransactionReceipt, L2TransactionReceipt } from '@arbitrum/sdk'
import { L1_Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/generated/L1_Bridge'
import { L2_Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/generated/L2_Bridge'
import { Signer, providers } from 'ethers'
import { config as globalConfig } from 'src/config'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

abstract class AbstractArbitrumBridgeWatcher extends BaseWatcher implements IChainWatcher {
  l1Wallet: Signer
  l2Wallet: Signer
  nonRetryableProvider: providers.Provider
  ready: boolean

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(config.chainSlug)

    this.nonRetryableProvider = getNonRetryableRpcProvider(config.chainSlug)!
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger): Promise<void> {
    logger.debug(
      `attempting to send relay message on arbitrum for commit tx hash ${commitTxHash}`
    )
    if (this.dryMode || globalConfig.emergencyDryMode) {
      this.logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode} skipping relayL2ToL1Message`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })
    const tx = await this.relayL2ToL1Message(commitTxHash)
    if (!tx) {
      logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
      return
    }

    const msg = `sent chain ${this.bridge.chainId} confirmTransferRoot exit tx ${tx.hash}`
    logger.info(msg)
    this.notifier.info(msg)
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

export default AbstractArbitrumBridgeWatcher
