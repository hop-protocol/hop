import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wait from 'src/utils/wait'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { CrossChainMessenger, MessageStatus, hashLowLevelMessage } from '@eth-optimism/sdk'
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

class OptimismBridgeWatcher extends BaseWatcher {
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
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

  // order: L2 Tx -> wait for state root to be published on L1 (240 seconds) -> proveMessage -> wait challenge period (7 days) -> finalizeMessage
  async relayXDomainMessage (
    txHash: string
  ): Promise<providers.TransactionResponse | undefined> {
    let messageStatus = await this.csm.getMessageStatus(txHash)
    if (messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
      console.log('waiting for state root to be published')
      // wait a max of 240 seconds for state root to be published on L1
      await wait(240 * 1000)
    }

    messageStatus = await this.csm.getMessageStatus(txHash)
    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      console.log('message ready to prove')
      const resolved = await this.csm.toCrossChainMessage(txHash)
      console.log('sending proveMessage tx')
      const tx = await this.csm.proveMessage(resolved)
      console.log('proveMessage tx:', tx?.hash)
      await tx.wait()
      console.log('waiting challenge period')
      const challengePeriod = await this.csm.getChallengePeriodSeconds()
      await wait(challengePeriod * 1000)
    }

    messageStatus = await this.csm.getMessageStatus(txHash)
    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      console.log('message is in challenge period')
      // challenge period is a few seconds on goerli, 7 days in production
      const challengePeriod = await this.csm.getChallengePeriodSeconds()
      const latestBlock = await this.csm.l1Provider.getBlock('latest')
      const resolved = await this.csm.toCrossChainMessage(txHash)
      const withdrawal = await this.csm.toLowLevelMessage(resolved)
      const provenWithdrawal =
        await this.csm.contracts.l1.OptimismPortal.provenWithdrawals(
          hashLowLevelMessage(withdrawal)
        )
      const timestamp = Number(provenWithdrawal.timestamp.toString())
      const bufferSeconds = 10
      const secondsLeft = (timestamp + challengePeriod + bufferSeconds) - Number(latestBlock.timestamp.toString())
      console.log('seconds left:', secondsLeft)
      await wait(secondsLeft * 1000)
    }

    messageStatus = await this.csm.getMessageStatus(txHash)
    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      console.log('ready for relay')
      console.log('sending finalizeMessage tx')
      const tx = await this.csm.finalizeMessage(txHash)
      console.log('finalizeMessage tx:', tx.hash)
      return tx
    }

    if (messageStatus === MessageStatus.RELAYED) {
      console.log('message already relayed')
      return
    }

    console.log(MessageStatus)
    console.log(`not ready for relay. statusCode: ${messageStatus}`)
  }

  async handleCommitTxHash (commitTxHash: string, transferRootId: string, logger: Logger) {
    logger.debug(
      `attempting to send relay message on optimism for commit tx hash ${commitTxHash}`
    )

    if (this.dryMode || globalConfig.emergencyDryMode) {
      logger.warn(`dry: ${this.dryMode}, emergencyDryMode: ${globalConfig.emergencyDryMode}, skipping relayXDomainMessage`)
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
