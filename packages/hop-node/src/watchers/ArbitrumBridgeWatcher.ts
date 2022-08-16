import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { IL1ToL2MessageWriter, L1ToL2MessageStatus, L1TransactionReceipt, L2TransactionReceipt } from '@arbitrum/sdk'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Wallet, providers } from 'ethers'

type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class ArbitrumBridgeWatcher extends BaseWatcher {
  l1Wallet: Wallet
  l2Wallet: Wallet
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
    this.l2Wallet = wallets.get(Chain.Arbitrum)
  }

  async relayXDomainMessage (
    txHash: string
  ): Promise<providers.TransactionResponse> {
    const txReceipt = await this.l2Wallet.provider.getTransactionReceipt(txHash)
    const initiatingTxnReceipt = new L2TransactionReceipt(
      txReceipt
    )

    if (!initiatingTxnReceipt) {
      throw new Error(
        `no arbitrum transaction found for tx hash ${txHash}`
      )
    }

    const outGoingMessagesFromTxn = await initiatingTxnReceipt.getL2ToL1Messages(this.l1Wallet, this.l2Wallet.provider)
    if (outGoingMessagesFromTxn.length === 0) {
      throw new Error(`tx hash ${txHash} did not initiate an outgoing messages`)
    }

    const msg: any = outGoingMessagesFromTxn[0]
    if (!msg) {
      throw new Error(`msg not found for tx hash ${txHash}`)
    }

    return msg.execute(this.l2Wallet.provider)
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    logger.debug(
      `attempting to send relay message on arbitrum for commit tx hash ${commitTxHash}`
    )
    if (this.dryMode) {
      this.logger.warn(`dry: ${this.dryMode}, skipping relayXDomainMessage`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })
    const tx = await this.relayXDomainMessage(commitTxHash)
    if (!tx) {
      logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
      return
    }

    const msg = `sent chain ${this.bridge.chainId} confirmTransferRoot exit tx ${tx.hash}`
    logger.info(msg)
    this.notifier.info(msg)
  }

  async redeemArbitrumTransaction (l1TxHash: string, messageIndex: number = 0): Promise<providers.TransactionResponse> {
    const l1ToL2Message = await this.getL1ToL2Message(l1TxHash, messageIndex)
    const res = await l1ToL2Message.waitForStatus()
    const status = res.status
    if (status !== L1ToL2MessageStatus.REDEEMED) {
      this.logger.error(`Transaction not redeemable. Status: ${L1ToL2MessageStatus[status]}`)
      throw new Error('Transaction unredeemable')
    }

    return await l1ToL2Message.redeem()
  }

  async getL1ToL2Message (l1TxHash: string, messageIndex: number = 0): Promise<IL1ToL2MessageWriter> {
    const l1ToL2Messages = await this.getL1ToL2Messages(l1TxHash)
    return l1ToL2Messages[messageIndex]
  }

  async getL1ToL2Messages (l1TxHash: string): Promise<IL1ToL2MessageWriter[]> {
    const txReceipt = await this.l1Wallet.provider.getTransactionReceipt(l1TxHash)
    const l1TxnReceipt = new L1TransactionReceipt(txReceipt)
    return l1TxnReceipt.getL1ToL2Messages(this.l2Wallet)
  }

  async isTransactionRedeemed (l1TxHash: string, messageIndex: number = 0): Promise<boolean> {
    const l1ToL2Message = await this.getL1ToL2Message(l1TxHash, messageIndex)
    const res = await l1ToL2Message.waitForStatus()
    const status = res.status
    return status === L1ToL2MessageStatus.REDEEMED
  }
}

export default ArbitrumBridgeWatcher
