import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, Wallet, providers } from 'ethers'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Watcher } from '@eth-optimism/core-utils'
import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import { getMessagesAndProofsForL2Transaction } from '@eth-optimism/message-relayer'
type Config = {
  chainSlug: string
  tokenSymbol: string
  bridgeContract?: L1BridgeContract | L2BridgeContract
  dryMode?: boolean
}

class OptimismBridgeWatcher extends BaseWatcher {
  l1Provider: any
  l2Provider: any
  l1Wallet: Wallet
  l2Wallet: Wallet
  l1Messenger: Contract
  scc: Contract
  watcher: Watcher

  constructor (config: Config) {
    super({
      chainSlug: config.chainSlug,
      tokenSymbol: config.tokenSymbol,
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Optimism)
    this.l1Provider = this.l1Wallet.provider
    this.l2Provider = this.l2Wallet.provider

    const sccAddress = '0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19'
    const l1MessengerAddress = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007'

    this.watcher = new Watcher({
      l1: {
        provider: this.l1Provider,
        messengerAddress: l1MessengerAddress
      },
      l2: {
        provider: this.l2Provider,
        messengerAddress: l2MessengerAddress
      }
    })

    this.l1Messenger = getContractFactory('IL1CrossDomainMessenger')
      .connect(this.l1Wallet)
      .attach(this.watcher.l1.messengerAddress)
    this.scc = getContractFactory('IStateCommitmentChain')
      .connect(this.l1Wallet)
      .attach(sccAddress)
  }

  async relayXDomainMessage (
    txHash: string
  ): Promise<providers.TransactionResponse> {
    const messagePairs = await getMessagesAndProofsForL2Transaction(
      this.l1Provider,
      this.l2Provider,
      this.scc.address,
      predeploys.L2CrossDomainMessenger,
      txHash
    )

    if (!messagePairs) {
      throw new Error('messagePairs not found')
    }

    const { message, proof } = messagePairs[0]
    const inChallengeWindow = await this.scc.insideFraudProofWindow(proof.stateRootBatchHeader)
    if (inChallengeWindow) {
      throw new Error('exit within challenge window')
    }

    return this.l1Messenger
      .connect(this.l1Wallet)
      .relayMessage(
        message.target,
        message.sender,
        message.message,
        message.messageNonce,
        proof
      )
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    logger.debug(
      `attempting to send relay message on optimism for commit tx hash ${commitTxHash}`
    )

    if (this.dryMode) {
      logger.warn(`dry: ${this.dryMode}, skipping relayXDomainMessage`)
      return
    }

    await this.db.transferRoots.update(transferRootId, {
      sentConfirmTxAt: Date.now()
    })

    try {
      const tx = await this.relayXDomainMessage(commitTxHash)
      if (!tx) {
        logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
        return
      }

      const msg = `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx ${tx.hash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      this.logger.error('relayXDomainMessage error:', err.message)
      const isNotCheckpointedYet = err.message.includes('unable to find state root batch for tx')
      const isProofNotFound = err.message.includes('messagePairs not found')
      const isInsideFraudProofWindow = err.message.includes('exit within challenge window')
      const notReadyForExit = isNotCheckpointedYet || isProofNotFound || isInsideFraudProofWindow
      if (notReadyForExit) {
        throw new Error('too early to exit')
      }
      const isAlreadyRelayed = err.message.includes('message has already been received')
      if (isAlreadyRelayed) {
        throw new Error('message has already been relayed')
      }
      // isEventLow() does not handle the case where `batchEvents` is null
      // https://github.com/ethereum-optimism/optimism/blob/26b39199bef0bea62a2ff070cd66fd92918a556f/packages/message-relayer/src/relay-tx.ts#L179
      const cannotReadProperty = err.message.includes('Cannot read property')
      if (cannotReadProperty) {
        throw new Error('event not found in optimism sdk')
      }
      throw err
    }
  }
}

export default OptimismBridgeWatcher
