import MaticJs from '@maticnetwork/maticjs-pos-zkevm'
import MaticJsEthers from '@maticnetwork/maticjs-ethers'
import { AbstractMessageService, type IMessageService, MessageDirection } from '../../Services/AbstractMessageService.js'
import { DefaultL1RelayGasLimit } from '../../Services/AbstractMessageService.js'
import * as MaticJsDefaults from '@maticnetwork/maticjs-pos-zkevm'
import type { providers } from 'ethers'
import type { ChainSlug } from '@hop-protocol/sdk'

const { ZkEvmClient, setProofApi } = MaticJs
const { default: maticJsDefault } = MaticJsDefaults
const { Web3ClientPlugin } = MaticJsEthers

type ZkEvmBridgeType = MaticJs.ZkEvmBridge
type ZkEvmClientType = MaticJs.ZkEvmClient

/**
 * @notice The Matic SDK has a cacheing issue that blocks a long-standing client from being able to send messages.
 * They have acknowledged this and put a fix in place, but it does not work with other versions of the required
 * ethers Matic package.
 * 
 * To avoid this, we create a new client for each message sent. This is not ideal, but it is the only way to
 * ensure that messages are sent.
 */

/**
 * PolygonZk Implementation References
 * - Proof generator URL (1 of 2): https://proof-generator.polygon.technology/api/zkevm/mainnet/bridge?net_id=0&deposit_cnt=163514
 * - Proof generator URL (2 of 2): https://proof-generator.polygon.technology/api/zkevm/mainnet/merkle-proof?net_id=0&deposit_cnt=163514
 * - Proof generator interface: https://github.com/maticnetwork/proof-generation-api/blob/362833c8c1b18b89ad013c363addc819919a8872/src/routes/zkEVM.js
 */

interface ZkEvmBridges {
  sourceBridge: ZkEvmBridgeType
  destBridge: ZkEvmBridgeType
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

  constructor (chainSlug: ChainSlug) {
    super(chainSlug)

    maticJsDefault.use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')
    this.logger.debug('PolygonZkMessageService initialized')
  }

  protected async sendRelayTx (message: Message, messageDirection: MessageDirection): Promise<providers.TransactionResponse> {
    const zkEvmClient = await this.#createClient()

    // The bridge to claim on will be on the opposite chain that the source tx is on
    const { sourceBridge, destBridge } = await this.#getSourceAndDestBridge(messageDirection)

    // Get the payload to claim the tx
    const isL1ToL2: boolean = messageDirection === MessageDirection.L1_TO_L2
    const networkId: number = await sourceBridge.networkID()
    const claimPayload = await zkEvmClient.bridgeUtil.buildPayloadForClaim(message, isL1ToL2, networkId)

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

    const wallet = messageDirection === MessageDirection.L1_TO_L2 ? this.l2Wallet : this.l1Wallet
    return wallet.provider!.getTransaction(claimMessageTxHash)
  }

  protected async getMessage (txHash: string): Promise<Message> {
    // PolygonZk message is just the tx hash
    return txHash
  }

  protected async getMessageStatus (message: Message): Promise<MessageStatus> {
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

  async #getSourceAndDestBridge (messageDirection: MessageDirection): Promise<ZkEvmBridges> {
    const zkEvmClient = await this.#createClient()
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return {
        sourceBridge: zkEvmClient.rootChainBridge,
        destBridge: zkEvmClient.childChainBridge
      }
    }
      return {
        sourceBridge: zkEvmClient.childChainBridge,
        destBridge: zkEvmClient.rootChainBridge
      }

  }

  async #isMessageRelayable (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<boolean> {
    const zkEvmClient = await this.#createClient()
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return zkEvmClient.isDepositClaimable(messageStatus)
    } else {
      return zkEvmClient.isWithdrawExitable(messageStatus)
    }
  }

  async #isMessageRelayed (messageStatus: MessageStatus, messageDirection: MessageDirection): Promise<boolean> {
    // The SDK return type is says string but it returns a bool so we have to convert it to unknown first
    const zkEvmClient = await this.#createClient()
    if (messageDirection === MessageDirection.L1_TO_L2) {
      return ((await zkEvmClient.isDeposited(messageStatus)) as unknown) as boolean
    } else {
      return ((await zkEvmClient.isExited(messageStatus)) as unknown) as boolean
    }
  }

  async #createClient (): Promise<ZkEvmClientType> {
    const zkEvmClient = new ZkEvmClient()

    const from = await this.l1Wallet.getAddress()
    const sdkNetwork = polygonSdkNetwork[this.networkSlug]
    const sdkVersion = polygonSdkVersion[this.networkSlug]

    await zkEvmClient.init({
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

    return zkEvmClient
  }
}
