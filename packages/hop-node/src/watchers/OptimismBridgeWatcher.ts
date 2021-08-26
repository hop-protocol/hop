import BaseWatcher from './classes/BaseWatcher'
import chalk from 'chalk'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Contract, Wallet, providers } from 'ethers'
import { Watcher } from '@eth-optimism/core-utils'
import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import { getMessagesAndProofsForL2Transaction } from '@eth-optimism/message-relayer'
import { getRpcProvider, getRpcUrls } from 'src/utils'

type Config = {
  chainSlug: string
  tokenSymbol: string
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
      tag: 'OptimismBridgeWatcher',
      logColor: 'yellow',
      dryMode: config.dryMode
    })

    this.l1Provider = new providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Ethereum)[0]
    )
    this.l2Provider = new providers.StaticJsonRpcProvider(
      getRpcUrls(Chain.Optimism)[0]
    )
    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(Chain.Optimism)

    const sccAddress = '0xE969C2724d2448F1d1A6189d3e2aA1F37d5998c1'
    const l1MessengerAddress = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007'

    this.watcher = new Watcher({
      l1: {
        provider: getRpcProvider(Chain.Ethereum),
        messengerAddress: l1MessengerAddress
      },
      l2: {
        provider: getRpcProvider(Chain.Optimism),
        messengerAddress: l2MessengerAddress
      }
    })

    this.l1Messenger = getContractFactory('iOVM_L1CrossDomainMessenger')
      .connect(this.l1Wallet)
      .attach(this.watcher.l1.messengerAddress)
    this.scc = getContractFactory('iOVM_StateCommitmentChain')
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

    const { message, proof } = messagePairs[0]
    const inChallengeWindow = await this.scc.insideFraudProofWindow(proof.stateRootBatchHeader)
    if (inChallengeWindow) {
      return
    }

    await this.handleStateSwitch()

    this.logger.debug(
         `attempting to send relay message on optimism for commit tx hash ${txHash}`
    )

    if (this.isDryOrPauseMode) {
      this.logger.warn(`dry: ${this.dryMode}, pause: ${this.pauseMode}. skipping executeExitTx`)
      return
    }

    const tx = await this.l1Messenger
      .connect(this.l1Wallet)
      .relayMessage(
        message.target,
        message.sender,
        message.message,
        message.messageNonce,
        proof
      )

    return tx
  }

  async handleCommitTxHash (commitTxHash: string, transferRootHash: string) {
    try {
      await this.db.transferRoots.update(transferRootHash, {
        checkpointAttemptedAt: Date.now()
      })
      const tx = await this.relayXDomainMessages(commitTxHash)
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
              checkpointAttemptedAt: 0,
              sentConfirmTxAt: 0
            })
            throw new Error('status=0')
          }
        })
        .catch(async (err: Error) => {
          this.db.transferRoots.update(transferRootHash, {
            checkpointAttemptedAt: 0,
            sentConfirmTxAt: 0
          })

          throw err
        })
    } catch (err) {
      const isNotCheckpointedYet = err.message.includes('unable to find state root batch for tx')
      if (isNotCheckpointedYet) {
        this.logger.debug('state root batch not yet on L1. cannot exit yet')
        return
      }
      const isAlreadyRelayed = err.message.includes('message has already been received')
      if (isAlreadyRelayed) {
        return
      }
      throw err
    }
  }
}

export default OptimismBridgeWatcher
