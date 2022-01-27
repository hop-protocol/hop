import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import wallets from 'src/wallets'
import { Bridge, OutgoingMessageState } from 'arb-ts'
import { Chain } from 'src/constants'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Wallet, providers } from 'ethers'

type Config = {
  chainSlug: string
  tokenSymbol: string
  label?: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  isL1?: boolean
  dryMode?: boolean
}

class ArbitrumBridgeWatcher extends BaseWatcher {
  l1Wallet: Wallet
  l2Wallet: Wallet
  arbBridge: Bridge
  ready: boolean

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      prefix: config.label,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      isL1: config.isL1,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Arbitrum)

    this.init()
      .catch((err) => {
        this.logger.error('arbitrum bridge watcher init error:', err.message)
        this.quit()
      })
  }

  async init () {
    this.arbBridge = await Bridge.init(this.l1Wallet, this.l2Wallet)
    this.ready = true
  }

  async relayXDomainMessage (
    txHash: string
  ): Promise<providers.TransactionResponse> {
    const initiatingTxnReceipt = await this.arbBridge.l2Provider.getTransactionReceipt(
      txHash
    )

    if (!initiatingTxnReceipt) {
      throw new Error(
        `no arbitrum transaction found for tx hash ${txHash}`
      )
    }

    const outGoingMessagesFromTxn = await this.arbBridge.getWithdrawalsInL2Transaction(initiatingTxnReceipt)
    if (outGoingMessagesFromTxn.length === 0) {
      throw new Error(`tx hash ${txHash} did not initiate an outgoing messages`)
    }

    const { batchNumber, indexInBatch } = outGoingMessagesFromTxn[0]
    const outgoingMessageState = await this.arbBridge.getOutGoingMessageState(
      batchNumber,
      indexInBatch
    )

    if (outgoingMessageState === OutgoingMessageState.NOT_FOUND) {
      throw new Error('outgoing message not found')
    } else if (outgoingMessageState === OutgoingMessageState.EXECUTED) {
      throw new Error('outgoing message executed')
    } else if (outgoingMessageState === OutgoingMessageState.UNCONFIRMED) {
      throw new Error('outgoing message unconfirmed')
    } else if (outgoingMessageState !== OutgoingMessageState.CONFIRMED) {
      throw new Error('outgoing message already confirmed')
    }

    return await this.arbBridge.triggerL2ToL1Transaction(batchNumber, indexInBatch)
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    logger.debug(
      `attempting to send relay message on arbitrum for commit tx hash ${commitTxHash}`
    )
    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      this.logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping relayXDomainMessage`)
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
}

export default ArbitrumBridgeWatcher
