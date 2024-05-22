import { providers, Signer } from 'ethers'
import { wait } from '#utils/wait.js'
import * as MaticJsDefaults from '@maticnetwork/maticjs-pos-zkevm'
// import MaticJs from '@maticnetwork/maticjs-pos-zkevm'
import * as MaticJsEthers from '@maticnetwork/maticjs-ethers'
import { MessageDirection } from './types.js'
import { NetworkSlug, ChainSlug } from '../index.js'
import { Relayer } from './Relayer.js'

const { ZkEvmClient, setProofApi } = MaticJsDefaults
const { default: maticJsDefault } = MaticJsDefaults
const { Web3ClientPlugin } = MaticJsEthers

type ZkEvmBridgeType = any // MaticJs.ZkEvmBridge
type ZkEvmClientType = any // MaticJs.ZkEvmClient

type Provider = providers.Provider

interface ZkEvmBridges {
  sourceBridge: ZkEvmBridgeType
  destBridge: ZkEvmBridgeType
}

type Message = string
type MessageStatus = string

const DefaultL1RelayGasLimit = 1_000_000

const polygonSdkNetwork: Record<string, string> = {
  mainnet: 'mainnet',
  goerli: 'testnet'
}

// Reference: https://github.com/maticnetwork/static/blob/0964fe422a5e8e9082edd0298dbe53f5a8799bea/network/networks.json
const polygonSdkVersion: Record<string, string> = {
  mainnet: 'cherry',
  goerli: 'blueberry'
}

export class PolygonZkRelayer extends Relayer<Message, MessageStatus> {
  ready: boolean = false
  zkEvmClient: ZkEvmClientType

  constructor (networkSlug: NetworkSlug, chainSlug: ChainSlug, l1Wallet: Signer | Provider, l2Wallet: Signer | Provider) {
    super(networkSlug, chainSlug, l1Wallet, l2Wallet)

    if (!(l1Wallet as any).getSigner) {
      (this.l1Wallet as any).getSigner = () => l1Wallet
    }
    if (!(l2Wallet as any).getSigner) {
      (this.l2Wallet as any).getSigner = () => l2Wallet
    }

    maticJsDefault.use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()
    this.#init(networkSlug)
      .then(() => {
        this.ready = true
        console.debug('zkEVM client initialized')
      })
      .catch((err: any) => {
        console.error('zkEvmClient initialize error:', err)
        process.exit(1)
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

  async #init (l1Network: string): Promise<void> {
    const from = await (this.l1Wallet as Signer).getAddress()
    const sdkNetwork = polygonSdkNetwork[l1Network]
    const sdkVersion = polygonSdkVersion[l1Network]
    await this.zkEvmClient.init({
      network: sdkNetwork!,
      version: sdkVersion!,
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

  async sendRelayTx (message: Message, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
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
      claimPayload.smtProofRollup,
      claimPayload.globalIndex,
      claimPayload.mainnetExitRoot,
      claimPayload.rollupExitRoot,
      claimPayload.originNetwork,
      claimPayload.originTokenAddress,
      claimPayload.destinationNetwork,
      claimPayload.destinationAddress,
      claimPayload.amount,
      claimPayload.metadata,
      {
        gasLimit: DefaultL1RelayGasLimit
      }
    )

    const claimMessageTxHash: string = await claimMessageTx.getTransactionHash()

    const wallet = (messageDirection === MessageDirection.L1_TO_L2 ? this.l2Wallet : this.l1Wallet) as Signer
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
    /**
     * A message is in flight if:
     * 1. It is neither relayable nor relayed
     * 2. The client does not know about it
     */

    let isRelayable: boolean
    let isRelayed: boolean
    try {
      console.log('debug000', messageStatus, messageDirection)
      isRelayable = await this.#isMessageRelayable(messageStatus, messageDirection)
      console.log('debug111', messageStatus, messageDirection, isRelayable)
      isRelayed = await this.#isMessageRelayed(messageStatus, messageDirection)
      console.log('debug222', messageStatus, messageDirection, isRelayed)
    } catch (err) {
      console.log('debug333', messageStatus, messageDirection, err)
      return true
    }

    console.log('debug444', messageStatus, messageDirection)
    if (isRelayable || isRelayed) {
      console.log('debug555', messageStatus, messageDirection)
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
