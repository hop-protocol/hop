import BaseWatcher from './classes/BaseWatcher'
import chalk from 'chalk'
import wallets from 'src/wallets'
import { Bridge, OutgoingMessageState } from 'arb-ts'
import { Chain } from 'src/constants'
import { Wallet } from 'ethers'

type Config = {
  chainSlug: string
  tokenSymbol: string
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
      tag: 'ArbitrumBridgeWatcher',
      logColor: 'yellow',
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Arbitrum)

    this.init()
  }

  async init () {
    this.arbBridge = await Bridge.init(this.l1Wallet, this.l2Wallet)
    this.ready = true
  }

  async relayMessage (
    txHash: string
  ): Promise<any> {
    if (!this.ready) {
      return
    }
    const initiatingTxnReceipt = await this.arbBridge.l2Provider.getTransactionReceipt(
      txHash
    )

    if (!initiatingTxnReceipt) {
      throw new Error(
        `no arbitrum transaction found for tx hash ${txHash}`
      )
    }

    const outGoingMessagesFromTxn = await this.arbBridge.getWithdrawalsInL2Transaction(initiatingTxnReceipt)
    if (!outGoingMessagesFromTxn.length) {
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
      return
    } else if (outgoingMessageState === OutgoingMessageState.UNCONFIRMED) {
      return
    } else if (outgoingMessageState !== OutgoingMessageState.CONFIRMED) {
      return
    }

    this.logger.debug(
         `attempting to send relay message on arbitrum for commit tx hash ${txHash}`
    )

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      this.logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping executeExitTx`)
      return
    }

    return this.arbBridge.triggerL2ToL1Transaction(batchNumber, indexInBatch)
  }

  async handleCommitTxHash (commitTxHash: string, transferRootHash: string) {
    const tx = await this.relayMessage(commitTxHash)
    if (!tx) {
      return
    }

    await this.db.transferRoots.update(transferRootHash, {
      sentConfirmTxAt: Date.now()
    })
    this.logger.info(
         `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx`,
         chalk.bgYellow.black.bold(tx.hash)
    )
    this.notifier.info(
         `chainId: ${this.bridge.chainId} confirmTransferRoot L1 exit tx: ${tx.hash}`
    )
    tx.wait()
      .then(async (receipt: any) => {
        if (receipt.status !== 1) {
          await this.db.transferRoots.update(transferRootHash, {
            sentConfirmTxAt: 0
          })
          throw new Error('status=0')
        }
      })
      .catch(async (err: Error) => {
        this.db.transferRoots.update(transferRootHash, {
          sentConfirmTxAt: 0
        })

        throw err
      })
  }
}

export default ArbitrumBridgeWatcher
