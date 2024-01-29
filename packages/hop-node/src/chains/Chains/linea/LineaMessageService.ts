import getRpcUrlFromProvider from 'src/utils/getRpcUrlFromProvider'
import { AbstractMessageService, IMessageService, MessageDirection } from 'src/chains/Services/AbstractMessageService'
import { BytesLike, CallOverrides, Contract, constants, providers } from 'ethers'
import {
  Message as LineaMessage,
  LineaSDK,
  LineaSDKOptions,
  Network,
  OnChainMessageStatus
} from '@consensys/linea-sdk'

// TODO: Get these from the SDK when they become exported
interface LineaMessageServiceContract {
  getMessagesByTransactionHash(transactionHash: string): Promise<LineaMessage[] | null>
  getMessageStatus(messageHash: BytesLike, overrides?: CallOverrides): Promise<OnChainMessageStatus>
  contract: Contract
}

interface LineaBridges {
  sourceBridge: LineaMessageServiceContract
  destBridge: LineaMessageServiceContract
}

export class LineaMessageService extends AbstractMessageService<LineaMessage, OnChainMessageStatus> implements IMessageService {
  readonly #l1Contract: LineaMessageServiceContract
  readonly #l2Contract: LineaMessageServiceContract

  constructor (chainSlug: string) {
    super(chainSlug)
    const lineaNetwork: Network = `linea-${this.networkSlug}` as Network

    // TODO: as of Oct 2023, there is no way to use the SDK in read-write with an ethers signer rather than private keys
    const sdkOptions: Partial<LineaSDKOptions> = {
      mode: 'read-only',
      network: lineaNetwork // options are: "linea-mainnet", "linea-goerli"
    }
    const lineaSdk: LineaSDK = new LineaSDK({
      l1RpcUrl: getRpcUrlFromProvider(this.l1Wallet.provider!),
      l2RpcUrl: getRpcUrlFromProvider(this.l2Wallet.provider!),
      network: sdkOptions.network!,
      mode: sdkOptions.mode!
    })

    // Better to define SDK here as class property instead but the SDK does not cache the contract so this is
    // less resource intensive
    this.#l1Contract = lineaSdk.getL1Contract()
    this.#l2Contract = lineaSdk.getL2Contract()
  }

  protected async sendRelayTx (message: LineaMessage, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
    const { destBridge } = this.#getSourceAndDestBridge(messageDirection)
    // Gas estimation does not work sometimes, so manual limit is needed
    // https://lineascan.build/tx/0x8e3c6d7bd3b7d39154c9463535a576db1a1e4d1e99d3a6526feb5bde26a926c0#internal
    const gasLimit = 500000
    const txOverrides = { gasLimit }
    // When the fee recipient is the zero address, the fee is sent to the msg.sender
    const feeRecipient = constants.AddressZero
    const wallet = messageDirection === MessageDirection.L1_TO_L2 ? this.l2Wallet : this.l1Wallet
    return destBridge.contract.connect(wallet).claimMessage(
      message.messageSender,
      message.destination,
      message.fee,
      message.value,
      feeRecipient,
      message.calldata,
      message.messageNonce,
      txOverrides
    )
  }

  protected async getMessage (txHash: string, messageDirection: MessageDirection, messageIndex: number): Promise<LineaMessage> {
    const { sourceBridge } = this.#getSourceAndDestBridge(messageDirection)
    const messages: LineaMessage[] | null = await sourceBridge.getMessagesByTransactionHash(txHash)
    if (!messages?.length) {
      throw new Error('could not find messages for tx hash')
    }
    return messages[messageIndex]
  }

  protected async getMessageStatus (message: LineaMessage, messageDirection: MessageDirection): Promise<OnChainMessageStatus> {
    const { destBridge } = this.#getSourceAndDestBridge(messageDirection)
    if (!message.messageHash) {
      throw new Error('message hash is missing. this might occur if there are multiple l1 to l2 messages in the tx')
    }
    return destBridge.getMessageStatus(message.messageHash)
  }

  protected isMessageInFlight (messageStatus: OnChainMessageStatus): boolean {
    return messageStatus === OnChainMessageStatus.UNKNOWN
  }

  protected isMessageRelayable (messageStatus: OnChainMessageStatus): boolean {
    return messageStatus === OnChainMessageStatus.CLAIMABLE
  }

  protected isMessageRelayed (messageStatus: OnChainMessageStatus): boolean {
    return messageStatus === OnChainMessageStatus.CLAIMED
  }

  #getSourceAndDestBridge (messageDirection: MessageDirection): LineaBridges {
    // Connect the wallet here since we cannot do so when the SDK is instantiated
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return {
        sourceBridge: this.#l1Contract,
        destBridge: this.#l2Contract
      }
    }

    return {
      sourceBridge: this.#l2Contract,
      destBridge: this.#l1Contract
    }
  }
}
