import wait from 'src/utils/wait'
import { AbstractMessageService, IMessageService, MessageDirection } from 'src/chains/Services/AbstractMessageService'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmBridge, ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'
import { providers } from 'ethers'

interface ZkEvmBridges {
  sourceBridge: ZkEvmBridge
  destBridge: ZkEvmBridge
}

const polygonSdkNetwork: Record<string, string> = {
  mainnet: 'mainnet',
  goerli: 'testnet'
}

// Reference: https://github.com/maticnetwork/static/blob/0964fe422a5e8e9082edd0298dbe53f5a8799bea/network/networks.json
const polygonSdkVersion: Record<string, string> = {
  mainnet: 'cherry',
  goerli: 'blueberry'
}

type Message = string
type MessageStatus = string

export class PolygonZkMessageService extends AbstractMessageService<Message, MessageStatus> implements IMessageService {
  ready: boolean = false
  zkEvmClient: ZkEvmClient

  constructor (chainSlug: string) {
    super(chainSlug)

    use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()
    this.#init(this.networkSlug)
      .then(() => {
        this.ready = true
        this.logger.debug('zkEVM client initialized')
      })
      .catch((err: any) => {
        this.logger.error('zkEvmClient initialize error:', err)
        process.exit(1)
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
    while (true) {
      if (this.ready) {
        return true
      }
      await wait(100)
    }
  }

  protected async sendRelayTx (message: Message, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
    await this.#tilReady()

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
    return wallet.provider!.getTransaction(claimMessageTxHash)
  }

  protected async getMessage (txHash: string): Promise<Message> {
    await this.#tilReady()
    // PolygonZk message is just the tx hash
    return txHash
  }

  protected async getMessageStatus (message: Message): Promise<MessageStatus> {
    await this.#tilReady()
    // PolygonZk status is retrieved from the hash
    return message
  }

  protected async isMessageInFlight (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<boolean> {
    // A message is in flight if:
    // 1. It is neither relayable nor relayed
    // 2. The client does not know about it

    let isRelayable: boolean
    let isRelayed: boolean
    try {
      isRelayable = await this.#isMessageRelayable(messageStatus, messageDirection)
      isRelayed = await this.#isMessageRelayed(messageStatus, messageDirection)
    } catch (err) {
      return true
    }

    if (isRelayable || isRelayed) {
      return false
    }
    return true
  }

  protected async isMessageRelayable (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<boolean> {
    return this.#isMessageRelayable(messageStatus, messageDirection)
  }

  protected async isMessageRelayed (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<boolean> {
    return this.#isMessageRelayed(messageStatus, messageDirection)
  }

  #getSourceAndDestBridge (messageDirection: MessageDirection): ZkEvmBridges {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return {
        sourceBridge: this.zkEvmClient.rootChainBridge,
        destBridge: this.zkEvmClient.childChainBridge
      }
    }
      return {
        sourceBridge: this.zkEvmClient.childChainBridge,
        destBridge: this.zkEvmClient.rootChainBridge
      }

  }

  async #isMessageRelayable (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<boolean> {
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return this.zkEvmClient.isDepositClaimable(messageStatus)
    } else {
      return this.zkEvmClient.isWithdrawExitable(messageStatus)
    }
  }

  async #isMessageRelayed (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<boolean> {
    // The SDK return type is says string but it returns a bool so we have to convert it to unknown first
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return ((await this.zkEvmClient.isDeposited(messageStatus)) as unknown) as boolean
    } else {
      return ((await this.zkEvmClient.isExited(messageStatus)) as unknown) as boolean
    }
  }

}
