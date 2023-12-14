import getRpcUrlFromProvider from 'src/utils/getRpcUrlFromProvider'
import { BytesLike, CallOverrides, Contract, Signer, constants, providers } from 'ethers'
import { IMessageService, MessageDirection, MessageService } from 'src/chains/Services/MessageService'
import {
  Message as LineaMessage,
  LineaSDK,
  LineaSDKOptions,
  OnChainMessageStatus
} from '@consensys/linea-sdk'
import { NetworkSlug, networks } from '@hop-protocol/core/networks'

// TODO: Get these from the SDK when they become exported
interface LineaMessageServiceContract {
  getMessagesByTransactionHash(transactionHash: string): Promise<LineaMessage[] | null>
  getMessageStatus(messageHash: BytesLike, overrides?: CallOverrides): Promise<OnChainMessageStatus>
  contract: Contract
}

type RelayOpts = {
  sourceBridge: LineaMessageServiceContract
  destBridge: LineaMessageServiceContract
  wallet: Signer
  messageIndex: number
}

export class LineaMessageService extends MessageService<LineaMessage, OnChainMessageStatus, RelayOpts> implements IMessageService {
  LineaSDK: LineaSDK

  constructor () {
    super()

    let lineaNetwork: any
    for (const network in networks) {
      const chainId = networks[network as NetworkSlug]?.linea?.networkId
      if (chainId === this.chainId) {
        lineaNetwork = `linea-${network}`
        break
      }
    }

    if (!lineaNetwork) {
      throw new Error('linea sdk network name not found')
    }

    // TODO: as of Oct 2023, there is no way to use the SDK in read-write with an ethers signer rather than private keys
    const sdkOptions: Partial<LineaSDKOptions> = {
      mode: 'read-only',
      network: lineaNetwork // options are: "linea-mainnet", "linea-goerli"
    }
    this.LineaSDK = new LineaSDK({
      l1RpcUrl: getRpcUrlFromProvider(this.l1Wallet.provider!),
      l2RpcUrl: getRpcUrlFromProvider(this.l2Wallet.provider!),
      network: sdkOptions.network!,
      mode: sdkOptions.mode!
    })
  }

  async relayL1ToL2Message (l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    const signer = this.l2Wallet

    return await this._relayXDomainMessage(l1TxHash, MessageDirection.L1_TO_L2, signer, messageIndex)
  }

  async relayL2ToL1Message (l2TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse> {
    const signer = this.l1Wallet

    return this._relayXDomainMessage(l2TxHash, MessageDirection.L2_TO_L1, signer, messageIndex)
  }

  private async _relayXDomainMessage (txHash: string, messageDirection: MessageDirection, wallet: Signer, messageIndex?: number): Promise<providers.TransactionResponse> {
    // TODO: Add types to this and the bridge. Maybe define these in parent methods and pass thru
    const l1Contract = this.LineaSDK.getL1Contract()
    const l2Contract = this.LineaSDK.getL2Contract()

    const sourceBridge = messageDirection === MessageDirection.L1_TO_L2 ? l1Contract : l2Contract
    const destBridge = messageDirection === MessageDirection.L1_TO_L2 ? l2Contract : l1Contract

    const relayOpts: RelayOpts = {
      sourceBridge,
      destBridge,
      wallet,
      messageIndex: messageIndex ?? 0
    }
    return this.validateMessageAndSendTransaction(txHash, relayOpts)
  }

  protected async sendRelayTransaction (message: LineaMessage, opts: RelayOpts): Promise<providers.TransactionResponse> {
    const { destBridge, wallet } = opts
    // Gas estimation does not work sometimes, so manual limit is needed
    // https://lineascan.build/tx/0x8e3c6d7bd3b7d39154c9463535a576db1a1e4d1e99d3a6526feb5bde26a926c0#internal
    const gasLimit = 500000
    const txOverrides = { gasLimit }
    // When the fee recipient is the zero address, the fee is sent to the msg.sender
    const feeRecipient = constants.AddressZero
    return await destBridge.contract.connect(wallet).claimMessage(
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

  protected async getMessage (txHash: string, opts: RelayOpts): Promise<LineaMessage> {
    const { sourceBridge, messageIndex } = opts
    const messages: LineaMessage[] | null = await sourceBridge.getMessagesByTransactionHash(txHash)
    if (!messages?.length) {
      throw new Error('could not find messages for tx hash')
    }
    return messages[messageIndex]
  }

  protected async getMessageStatus (message: LineaMessage, opts: RelayOpts): Promise<OnChainMessageStatus> {
    const { destBridge } = opts
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
}