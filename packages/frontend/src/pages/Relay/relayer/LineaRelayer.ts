import {
  type Message as LineaMessage,
  LineaSDK,
  type LineaSDKOptions,
  type Network,
  OnChainMessageStatus
} from '@consensys/linea-sdk'
import { constants } from 'ethers'
import type { BytesLike, CallOverrides, Contract, providers, Signer } from 'ethers'
import type { ChainSlug } from '@hop-protocol/sdk'
import { NetworkSlug } from '@hop-protocol/sdk'
import { MessageDirection } from './types.js'
import { Relayer } from './Relayer.js'

interface LineaMessageServiceContract {
  getMessagesByTransactionHash(transactionHash: string): Promise<LineaMessage[] | null>
  getMessageStatus(messageHash: BytesLike, overrides?: CallOverrides): Promise<OnChainMessageStatus>
  contract: Contract
}

interface LineaBridges {
  sourceBridge: LineaMessageServiceContract
  destBridge: LineaMessageServiceContract
}

type Provider = providers.Provider & {
  connection?: {
    url: string
  }
  providers?: Provider[]
}

export function getRpcUrlFromProvider (provider: Provider): string {
  return provider?.connection?.url ?? provider.providers?.[0]?.connection?.url ?? ''
}

export class LineaRelayer extends Relayer<LineaMessage, OnChainMessageStatus> {
  readonly #l1Contract: LineaMessageServiceContract
  readonly #l2Contract: LineaMessageServiceContract

  constructor (networkSlug: NetworkSlug, chainSlug: ChainSlug, l1Wallet: Signer | Provider, l2Wallet: Signer | Provider) {
    super(networkSlug, chainSlug, l1Wallet, l2Wallet)
    const lineaNetwork: Network = `linea-${networkSlug}` as Network

    // TODO: as of Oct 2023, there is no way to use the SDK in read-write with an ethers signer rather than private keys
    const sdkOptions: Partial<LineaSDKOptions> = {
      mode: 'read-only',
      network: lineaNetwork // options are: "linea-mainnet", "linea-goerli"
    }
    const lineaSdk: LineaSDK = new LineaSDK({
      l1RpcUrl: getRpcUrlFromProvider((this.l1Wallet as Signer).provider as Provider),
      l2RpcUrl: getRpcUrlFromProvider(this.l2Wallet as Provider),
      network: sdkOptions.network!,
      mode: sdkOptions.mode!
    })

    // Better to define SDK here as class property instead but the SDK does not cache the contract so this is
    // less resource intensive
    this.#l1Contract = lineaSdk.getL1Contract()
    this.#l2Contract = lineaSdk.getL2Contract()
  }

  async sendRelayTx (message: LineaMessage, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
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

  protected async getMessage (txHash: string, messageDirection: MessageDirection, messageIndex?: number): Promise<LineaMessage> {
    messageIndex ??= 0
    const { sourceBridge } = this.#getSourceAndDestBridge(messageDirection)
    const messages: LineaMessage[] | null = await sourceBridge.getMessagesByTransactionHash(txHash)
    if (!messages?.length) {
      throw new Error('could not find messages for tx hash')
    }

    const message: LineaMessage | undefined = messages[messageIndex]
    if (!message) {
      throw new Error(`could not find message at index ${messageIndex}`)
    }
    return message
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
