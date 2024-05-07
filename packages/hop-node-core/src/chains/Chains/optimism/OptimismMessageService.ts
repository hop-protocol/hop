import { AbstractMessageService, type IMessageService, MessageDirection } from '../../Services/AbstractMessageService.js'
import {
  type CrossChainMessage,
  CrossChainMessenger,
  MessageStatus
} from '@eth-optimism/sdk'
import type { providers } from 'ethers'
import { CoreEnvironment } from '#config/index.js'
import { getChain } from '@hop-protocol/sdk'
import type { ChainSlug } from '@hop-protocol/sdk'

export class OptimismMessageService extends AbstractMessageService<CrossChainMessage, MessageStatus> implements IMessageService {
  readonly #csm: CrossChainMessenger

  constructor (chainSlug: ChainSlug) {
    super(chainSlug)

    const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
    const l2Chain = getChain(coreEnvironmentVariables.envNetwork, chainSlug)
    this.#csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: Number(l2Chain.parentChainId),
      l2ChainId: l2Chain.chainId,
      l1SignerOrProvider: this.l1Wallet,
      l2SignerOrProvider: this.l2Wallet
    })
  }

  protected async sendRelayTx (message: CrossChainMessage, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
    if (messageDirection === MessageDirection.L2_TO_L1) {
      return this.#csm.proveMessage(message)
    }

    // Need an arbitrary value that will always succeed
    // Signer is needed to execute tx with SDK
    const gasLimit = 1000000
    const txOpts: any = {
      signer: this.l2Wallet,
      overrides: {
        gasLimit
      }
    }
    return this.#csm.resendMessage(message, txOpts)
  }

  protected async getMessage (txHash: string, messageDirection: MessageDirection, messageIndex: number): Promise<CrossChainMessage> {
    const messages: CrossChainMessage[] = await this.#csm.getMessagesByTransaction(txHash)
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }
    console.log(messages)
    const message: CrossChainMessage | undefined = messages[messageIndex]
    if (!message) {
      throw new Error(`could not find message at index ${messageIndex}`)
    }
    return message
  }

  protected async getMessageStatus (message: CrossChainMessage): Promise<MessageStatus> {
    return this.#csm.getMessageStatus(message.transactionHash)
  }

  protected isMessageInFlight (messageStatus: MessageStatus): boolean {
    return (
      messageStatus === MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE ||
      messageStatus === MessageStatus.STATE_ROOT_NOT_PUBLISHED
    )
  }

  protected isMessageRelayable (messageStatus: MessageStatus): boolean {
    // Relay is the term for L1_TO_L2 while prove is the term for L2_TO_L1
    return (
      messageStatus === MessageStatus.READY_FOR_RELAY ||
      messageStatus === MessageStatus.READY_TO_PROVE
    )
  }

  protected isMessageRelayed (messageStatus: MessageStatus): boolean {
    // This class is only concerned with the proving of a message on L1, not the finalizing
    return (
      messageStatus === MessageStatus.IN_CHALLENGE_PERIOD ||
      messageStatus === MessageStatus.RELAYED
    )
  }
}
