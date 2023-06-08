import BaseWatcher from './classes/BaseWatcher'
import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { CrossChainMessenger, MessageStatus } from '@eth-optimism/sdk'
import { Interface } from 'ethers/lib/utils'
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
      bedrock: true,
      l1ChainId: this.chainId === 420 ? 5 : 1,
      l2ChainId: this.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })
  }

  // This function will only handle one stage at a time. Upon completion of a stage, the poller will re-call
  // this when the next stage is ready.
  // It is expected that the poller re-calls this message every hour during the challenge period, if the
  // transfer was challenged. The complexity of adding DB state to track successful/failed root prove txs
  // and challenges is not worth saving the additional RPC calls (2) per hour during the challenge period.
  async relayXDomainMessage (
    txHash: string
  ): Promise<providers.TransactionResponse | undefined> {
    const messageStatus: MessageStatus = await this.csm.getMessageStatus(txHash)
    if (
      messageStatus === MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE ||
      messageStatus === MessageStatus.FAILED_L1_TO_L2_MESSAGE ||
      messageStatus === MessageStatus.RELAYED
    ) {
      throw new Error(`unexpected message status: ${messageStatus}, txHash: ${txHash}`)
    }

    if (messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
      throw new Error('state root not published')
    }

    if (messageStatus === MessageStatus.READY_TO_PROVE) {
      console.log('sending proveMessage tx')
      const resolved = await this.csm.toCrossChainMessage(txHash)
      return this.csm.proveMessage(resolved)
    }

    if (messageStatus === MessageStatus.IN_CHALLENGE_PERIOD) {
      throw new Error('message in challenge period')
    }

    if (messageStatus === MessageStatus.READY_FOR_RELAY) {
      console.log('sending finalizeMessage tx')
      return this.csm.finalizeMessage(txHash)
    }

    throw new Error(`state not handled for tx ${txHash}`)
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

      const {
        unexpectedPollError,
        unexpectedRelayErrors,
        invalidMessageError,
        onchainError,
        cannotReadPropertyError,
        preBedrockErrors
      } = this.getErrorType(err.message)

      // This error occurs if a poll happened while a message was either not yet published or in the challenge period
      if (unexpectedPollError) {
        return
      }

      if (unexpectedRelayErrors) {
        throw new Error('unexpected message status')
      }
      if (invalidMessageError) {
        throw new Error('invalid message')
      }
      if (onchainError) {
        throw new Error('message has already been relayed')
      }
      if (cannotReadPropertyError) {
        throw new Error('event not found in optimism sdk')
      }
      if (preBedrockErrors) {
        throw new Error('unexpected Optimism SDK error')
      }

      throw err
    }
  }

  // At this time, most aof these errors are only informational and not explicitly handled
  getErrorType (errMessage: string) {
    // Hop errors
    const unexpectedPollError =
      errMessage.includes('state root not published') ||
      errMessage.includes('message in challenge period')

    const unexpectedRelayErrors =
      errMessage.includes('unexpected message status') ||
      errMessage.includes('state not handled for tx ')

    // Optimism SDK errors
    const invalidMessageError =
      errMessage.includes('unable to find transaction receipt for') ||
      errMessage.includes('message is undefined') ||
      errMessage.includes('could not find SentMessage event for message') ||
      errMessage.includes('expected 1 message, got')

    const onchainError = errMessage.includes('message has already been relayed')

    // isEventLow() does not handle the case where `batchEvents` is null
    // https://github.com/ethereum-optimism/optimism/blob/26b39199bef0bea62a2ff070cd66fd92918a556f/packages/message-relayer/src/relay-tx.ts#L179
    const cannotReadPropertyError = errMessage.includes('Cannot read property')

    const preBedrockErrors =
      errMessage.includes('unable to find state root batch for tx') ||
      errMessage.includes('messagePairs not found') ||
      errMessage.includes('exit within challenge window')

    return {
      unexpectedPollError,
      unexpectedRelayErrors,
      invalidMessageError,
      onchainError,
      cannotReadPropertyError,
      preBedrockErrors
    }
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    try {
      // TODO: Rip all this out and use this.csm.relayTx(l1TxHash) function once the Optimism SDK supports it
      const message = await this.csm.toCrossChainMessage(l1TxHash)
      // Use a custom gasLimit that is high enough for all transactions. This is because the original relay
      // failed due to too low of an estimation, so we need to manually set it
      const gasLimit = 1000000
      const l2CrossDomainMessengerAddress = '0x4200000000000000000000000000000000000007'
      const abi = ['function relayMessage(uint256,address,address,uint256,uint256,bytes calldata) external payable']
      const ethersInterface = new Interface(abi)
      const data = ethersInterface.encodeFunctionData(
        'relayMessage', [
          message.messageNonce,
          message.sender,
          message.target,
          message.value,
          message.minGasLimit,
          message.message
        ]
      )
      const tx: providers.TransactionRequest = {
        to: l2CrossDomainMessengerAddress,
        gasLimit,
        data
      }
      return this.l2Wallet.sendTransaction(tx)
    } catch (err) {
      throw new Error(`relayL1ToL2Message error: ${err.message}`)
    }
  }
}

export default OptimismBridgeWatcher
