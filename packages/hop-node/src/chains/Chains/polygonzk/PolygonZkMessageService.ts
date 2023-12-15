import wait from 'src/utils/wait'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { AbstractMessageService, IMessageService, MessageDirection } from 'src/chains/Services/AbstractMessageService'
import { providers } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmBridge, ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'
import { getNetworkSlugByChainSlug } from 'src/chains/utils'

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

type RelayOpts = {
  messageDirection: MessageDirection
}

type MessageType = string
type MessageStatus = string

export class PolygonZkMessageService extends AbstractMessageService<MessageType, MessageStatus, RelayOpts> implements IMessageService {
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
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L1_TO_L2
    }

    return this.validateMessageAndSendTransaction(l1TxHash, relayOpts)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    await this.#tilReady()
    const relayOpts: RelayOpts = {
      messageDirection: MessageDirection.L2_TO_L1
    }

    return this.validateMessageAndSendTransaction(l2TxHash, relayOpts)
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

  protected async sendRelayTransaction (message: MessageType, relayOpts: RelayOpts): Promise<providers.TransactionResponse> {
    const { messageDirection } = relayOpts

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

  protected async getMessage (message: MessageType): Promise<MessageType> {
    // PolygonZk message is the txHash
    return message
  }

  protected async getMessageStatus (message: MessageType): Promise<MessageStatus> {
    // PolygonZk status is validated by just the message, so we return that
    return message
  }

  protected async isMessageInFlight (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageRelayable (messageStatus: MessageStatus): Promise<boolean> {
    const isL1ToL2AndRelayable = await this.zkEvmClient.isDepositClaimable(messageStatus)
    const isL2ToL1AndRelayable = await this.zkEvmClient.isWithdrawExitable(messageStatus)
    return (
      messageStatus === isL1ToL2AndRelayable ||
      messageStatus === isL2ToL1AndRelayable
    )
  }

  protected async isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> {
    const isL1ToL2AndRelayed = await this.zkEvmClient.isDeposited(messageStatus)
    const isL2ToL1AndRelayed = await this.zkEvmClient.isExited(messageStatus)
    return (
      messageStatus === isL1ToL2AndRelayed ||
      messageStatus === isL2ToL1AndRelayed
    )
  }
}
