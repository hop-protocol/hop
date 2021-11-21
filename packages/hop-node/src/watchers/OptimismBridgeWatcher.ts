import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, Wallet } from 'ethers'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L1ERC20Bridge as L1ERC20BridgeContract } from '@hop-protocol/core/contracts/L1ERC20Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Watcher } from '@eth-optimism/core-utils'
import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import { getMessagesAndProofsForL2Transaction } from '@eth-optimism/message-relayer'
type Config = {
  chainSlug: string
  tokenSymbol: string
  label?: string
  bridgeContract?: L1BridgeContract | L1ERC20BridgeContract | L2BridgeContract
  isL1?: boolean
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
      prefix: config.label,
      tag: 'OptimismBridgeWatcher',
      logColor: 'yellow',
      bridgeContract: config.bridgeContract,
      isL1: config.isL1,
      dryMode: config.dryMode
    })

    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Optimism)
    this.l1Provider = this.l1Wallet.provider
    this.l2Provider = this.l2Wallet.provider

    const sccAddress = '0xE969C2724d2448F1d1A6189d3e2aA1F37d5998c1'
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

  async relayXDomainMessages (
    txHash: string
  ): Promise<any> {
    const messagePairs = await getMessagesAndProofsForL2Transaction(
      this.l1Provider,
      this.l2Provider,
      this.scc.address,
      predeploys.OVM_L2CrossDomainMessenger,
      txHash
    )

    if (!messagePairs) {
      throw new Error('messagePairs not found')
    }

    const { message, proof } = messagePairs[0]
    const inChallengeWindow = await this.scc.insideFraudProofWindow(proof.stateRootBatchHeader)
    if (inChallengeWindow) {
      return
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

  async handleCommitTxHash (commitTxHash: string, transferRootHash: string, logger: Logger) {
    logger.debug(
      `attempting to send relay message on optimism for commit tx hash ${commitTxHash}`
    )

    await this.handleStateSwitch()
    if (this.isDryOrPauseMode) {
      logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping executeExitTx`)
      return
    }

    await this.db.transferRoots.update(transferRootHash, {
      sentConfirmTxAt: Date.now()
    })

    try {
      const tx = await this.relayXDomainMessages(commitTxHash)
      if (!tx) {
        logger.warn(`No tx exists for exit, commitTxHash ${commitTxHash}`)
        return
      }

      const msg = `sent chainId ${this.bridge.chainId} confirmTransferRoot L1 exit tx ${tx.hash}`
      logger.info(msg)
      this.notifier.info(msg)
    } catch (err) {
      this.logger.error(err.message)
      const isNotCheckpointedYet = err.message.includes('unable to find state root batch for tx')
      const isProofNotFound = err.message.includes('messagePairs not found')
      const notReadyForExit = isNotCheckpointedYet || isProofNotFound
      if (notReadyForExit) {
        logger.debug('state root batch not yet on L1. cannot exit yet')
        return
      }
      const isAlreadyRelayed = err.message.includes('message has already been received')
      if (isAlreadyRelayed) {
        logger.debug('message has already been relayed')
        return
      }
      // isEventLow() does not handle the case where `batchEvents` is null
      // https://github.com/ethereum-optimism/optimism/blob/26b39199bef0bea62a2ff070cd66fd92918a556f/packages/message-relayer/src/relay-tx.ts#L179
      const cannotReadProperty = err.message.includes('Cannot read property')
      if (cannotReadProperty) {
        logger.debug('event not found in optimism sdk')
        return
      }
      throw err
    }
  }
}

export default OptimismBridgeWatcher
