import wait from 'src/utils/wait'
import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { CrossChainMessenger, MessageStatus, hashLowLevelMessage } from '@eth-optimism/sdk'
import { L1Bridge as L1BridgeContract } from '@hop-protocol/core/contracts/L1Bridge'
import { L2Bridge as L2BridgeContract } from '@hop-protocol/core/contracts/L2Bridge'
import { Wallet, providers } from 'ethers'

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
  csm: CrossChainMessenger
  chainId: number

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

    this.chainId = chainSlugToId(config.chainSlug)

    this.csm = new CrossChainMessenger({
      bedrock: this.chainId === 420,
      l1ChainId: this.chainId === 420 ? 5 : 1,
      l2ChainId: this.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })
  }

  async relayXDomainMessage (
    txHash: string
  ): Promise<providers.TransactionResponse | undefined> {
    let messageStatus = await this.csm.getMessageStatus(txHash)
    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      console.log('message ready to prove')
      const resolved = await this.csm.toCrossChainMessage(txHash)
      const tx = await this.csm.proveMessage(resolved)
      await tx.wait()
      console.log('waiting challenge period')
      const challengePeriod = await this.csm.getChallengePeriodSeconds()
      await wait(challengePeriod * 1000)
    }

    messageStatus = await this.csm.getMessageStatus(txHash)
    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      console.log('message in challenge period')
      const challengePeriod = await this.csm.getChallengePeriodSeconds()
      const latestBlock = await this.csm.l1Provider.getBlock('latest')
      const resolved = await this.csm.toCrossChainMessage(txHash)
      const withdrawal = await this.csm.toLowLevelMessage(resolved)
      const provenWithdrawal =
        await this.csm.contracts.l1.OptimismPortal.provenWithdrawals(
          hashLowLevelMessage(withdrawal)
        )
      const timestamp = provenWithdrawal.timestamp.toNumber()
      const secondsLeft = (timestamp + challengePeriod) - latestBlock.timestamp
      console.log('seconds left:', secondsLeft)
      return
    }

    messageStatus = await this.csm.getMessageStatus(txHash)
    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      console.log('ready for relay')
    } else {
      console.log(MessageStatus)
      console.log(`not ready for relay. statusCode: ${messageStatus}`)
      return
    }

    const tx = await this.csm.finalizeMessage(txHash)
    return tx
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
