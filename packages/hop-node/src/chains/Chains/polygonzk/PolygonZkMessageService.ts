import wait from 'src/utils/wait'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { IMessageService, MessageService } from 'src/chains/Services/MessageService'
import { NetworkSlug, networks } from '@hop-protocol/core/networks'
import { Signer, providers } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmBridge, ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'

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

// TODO: Implement
type MessageType = string
type MessageStatus = string

export class PolygonZkMessageService extends MessageService<MessageType, MessageStatus> implements IMessageService {
  ready: boolean = false
  apiUrl: string
  zkEvmClient: ZkEvmClient

  constructor (chainSlug: string) {
    super(chainSlug)

    const polygonNetwork = polygonChainSlugs[this.networkSlug]
    this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${polygonNetwork}/block-included`

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

  private async _tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }
    await wait(100)
    return await this._tilReady()
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    await this._tilReady()

    const isSourceTxOnL1 = true
    const signer = this.l2Wallet
    return await this._relayXDomainMessage(l1TxHash, isSourceTxOnL1, signer)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    await this._tilReady()

    const isSourceTxOnL1 = false
    const signer = this.l1Wallet
    return this._relayXDomainMessage(l2TxHash, isSourceTxOnL1, signer)
  }

  private async _relayXDomainMessage (txHash: string, isSourceTxOnL1: boolean, wallet: Signer): Promise<providers.TransactionResponse> {
    const isRelayable = await this._isCheckpointed(txHash, isSourceTxOnL1)
    if (!isRelayable) {
      throw new Error('expected deposit to be claimable')
    }

    // The bridge to claim on will be on the opposite chain that the source tx is on
    const { sourceBridge, destBridge } = this.#getSourceAndDestBridge(isSourceTxOnL1)

    // Get the payload to claim the tx
    const networkId: number = await sourceBridge.networkID()
    const claimPayload = await this.zkEvmClient.bridgeUtil.buildPayloadForClaim(txHash, isSourceTxOnL1, networkId)

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
    return await wallet.provider!.getTransaction(claimMessageTxHash)
  }

  private async _isCheckpointed (txHash: string, isSourceTxOnL1: boolean): Promise<boolean> {
    if (isSourceTxOnL1) {
      return this.zkEvmClient.isDepositClaimable(txHash)
    }
    return this.zkEvmClient.isWithdrawExitable(txHash)
  }

  #getSourceAndDestBridge (isSourceTxOnL1: boolean): ZkEvmBridges {
    if (isSourceTxOnL1) {
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

  protected async sendRelayTransaction (message: MessageType): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }

  protected async getMessage (txHash: string): Promise<MessageType> {
    throw new Error('implement')
  }

  protected async getMessageStatus (message: MessageType): Promise<MessageStatus> {
    throw new Error('implement')
  }

  protected async isMessageInFlight (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageRelayable (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }
}
