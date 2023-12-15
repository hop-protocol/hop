import wait from 'src/utils/wait'
import { AbstractMessageService, IMessageService, MessageDirection } from 'src/chains/Services/AbstractMessageService'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmBridge, ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'
import { getNetworkSlugByChainSlug } from 'src/chains/utils'
import { providers } from 'ethers'

interface ZkEvmBridges {
  sourceBridge: ZkEvmBridge
  destBridge: ZkEvmBridge
}

const polygonChainSlugs: Record<string, string> = {
  mainnet: 'matic',
  goerli: 'mumbai'
}

const polygonSdkNetwork: Record<string, string> = {
  mainnet: 'mainnet',
  goerli: 'testnet'
}

const polygonSdkVersion: Record<string, string> = {
  mainnet: 'v1',
  goerli: 'blueberry'
}

type MessageOpts = {
  messageDirection: MessageDirection
}

type Message = string
type MessageStatus = string

export class PolygonZkMessageService extends AbstractMessageService<Message, MessageStatus, MessageOpts> implements IMessageService {
  ready: boolean = false
  apiUrl: string
  zkEvmClient: ZkEvmClient

  constructor (chainSlug: string) {
    super(chainSlug)

    const networkSlug = getNetworkSlugByChainSlug(chainSlug)
    if (!networkSlug) {
      throw new Error(`Network slug not found for chain slug ${chainSlug}`)
    }
    const polygonNetwork: string = polygonChainSlugs[networkSlug]
    this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${polygonNetwork}/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()

    this.#init(networkSlug)
      .then(() => {
        this.ready = true
        this.logger.debug('zkEVM client initialized')
      })
      .catch((err: any) => {
        this.logger.error('zkEvmClient initialize error:', err)
        throw err
      })
  }

  async #init (l1Network: string) {
    const from = await this.l1Wallet.getAddress()
    const sdkNetwork = polygonSdkNetwork[l1Network]
    const sdkVersion = polygonSdkVersion[l1Network]
    await this.zkEvmClient.init({
      network: sdkNetwork,
      version: sdkVersion,
      parent: {
        provider: this.l1Wallet,
        defaultConfig: {
          from
        }
      },
      child: {
        provider: this.l2Wallet,
        defaultConfig: {
          from
        }
      }
    })
  }

  async #tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }
    await wait(100)
    return await this.#tilReady()
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    await this.#tilReady()
    const messageOpts: MessageOpts = {
      messageDirection: MessageDirection.L1_TO_L2
    }

    return this.validateMessageAndSendTransaction(l1TxHash, messageOpts)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    await this.#tilReady()
    const messageOpts: MessageOpts = {
      messageDirection: MessageDirection.L2_TO_L1
    }

    return this.validateMessageAndSendTransaction(l2TxHash, messageOpts)
  }

  protected async sendRelayTransaction (message: Message, messageOpts: MessageOpts): Promise<providers.TransactionResponse> {
    const { messageDirection } = messageOpts

    // The bridge to claim on will be on the opposite chain that the source tx is on
    const { sourceBridge, destBridge } = this.#getSourceAndDestBridge(messageDirection)

    // Get the payload to claim the tx
    const isL1ToL2: boolean = messageDirection === MessageDirection.L1_TO_L2
    const networkId: number = await sourceBridge.networkID()
    const claimPayload = await this.zkEvmClient.bridgeUtil.buildPayloadForClaim(message, isL1ToL2, networkId)

    // Execute the claim tx
    const claimMessageTx = await destBridge.claimMessage(
      claimPayload.smtProof,
      claimPayload.index,
      claimPayload.mainnetExitRoot,
      claimPayload.rollupExitRoot,
      claimPayload.originNetwork,
      claimPayload.originTokenAddress,
      claimPayload.destinationNetwork,
      claimPayload.destinationAddress,
      claimPayload.amount,
      claimPayload.metadata,
      {
        gasLimit: CanonicalMessengerRootConfirmationGasLimit
      }
    )

    const claimMessageTxHash: string = await claimMessageTx.getTransactionHash()

    const wallet = messageDirection === MessageDirection.L1_TO_L2 ? this.l2Wallet : this.l1Wallet
    return await wallet.provider!.getTransaction(claimMessageTxHash)
  }

  protected async getMessage (txHash: string): Promise<Message> {
    // PolygonZk message is just the tx hash
    return txHash
  }

  protected async getMessageStatus (message: Message): Promise<MessageStatus> {
    // PolygonZk status is retrieved from the hash
    return message
  }

  protected async isMessageInFlight (messageStatus: MessageStatus, messageOpts: MessageOpts): Promise<boolean> {
    // A message is in flight if the client does not know about it
    try {
      if (messageOpts.messageDirection === MessageDirection.L1_TO_L2) {
        await this.zkEvmClient.isDepositClaimable(messageStatus)
      } else {
        await this.zkEvmClient.isWithdrawExitable(messageStatus)
      }
    } catch (err) {
      return true
    }
    return false
  }

  protected async isMessageRelayable (messageStatus: MessageStatus, messageOpts: MessageOpts): Promise<boolean> {
    if (messageOpts.messageDirection === MessageDirection.L1_TO_L2) {
      return this.zkEvmClient.isDepositClaimable(messageStatus)
    } else {
      return this.zkEvmClient.isWithdrawExitable(messageStatus)
    }
  }

  protected async isMessageRelayed (messageStatus: MessageStatus, messageOpts: MessageOpts): Promise<boolean> {
    // The SDK return type is says string but it returns a bool so we have to convert it to unknown first
    if (messageOpts.messageDirection === MessageDirection.L1_TO_L2) {
      return ((await this.zkEvmClient.isDeposited(messageStatus)) as unknown) as boolean
    } else {
      return ((await this.zkEvmClient.isExited(messageStatus)) as unknown) as boolean
    }
  }

  #getSourceAndDestBridge (messageDirection: MessageDirection): ZkEvmBridges {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return {
        sourceBridge: this.zkEvmClient.rootChainBridge,
        destBridge: this.zkEvmClient.childChainBridge
      }
    } else {
      return {
        sourceBridge: this.zkEvmClient.childChainBridge,
        destBridge: this.zkEvmClient.rootChainBridge
      }
    }
  }
}
