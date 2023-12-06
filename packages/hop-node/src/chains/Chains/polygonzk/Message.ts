import MessageService, { IMessageService } from '../../Services/MessageService'
import { NetworkSlug, networks } from '@hop-protocol/core/networks'
import { Signer, providers } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'

const polygonChainSlugs: Record<string, string> = {
  mainnet: 'matic',
  goerli: 'mumbai'
}

const polygonMessengers: Record<string, string> = {
  mainnet: '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
  goerli: '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7'
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

export class Message extends MessageService<MessageType, MessageStatus> implements IMessageService {
  ready: boolean = false
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
  chainId: number
  apiUrl: string
  zkEvmClient: ZkEvmClient
  messengerAddress: string
  l1Network: string

  constructor (chainSlug: string) {
    super(chainSlug)

    for (const network in networks) {
      const chainId = networks[network as NetworkSlug]?.polygonzk?.networkId
      if (chainId === this.chainId) {
        this.l1Network = network
        break
      }
    }

    if (!this.l1Network) {
      throw new Error('polygon network name not found')
    }

    const polygonNetwork = polygonChainSlugs[this.l1Network]
    this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${polygonNetwork}/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()
    this.messengerAddress = polygonMessengers[this.l1Network]

    this.init()
      .catch((err: any) => {
        this.logger.error('zkEvmClient initialize error:', err)
      })
  }

  async init () {
    const from = await this.l1Wallet.getAddress()
    const sdkNetwork = polygonSdkNetwork[this.l1Network]
    const sdkVersion = polygonSdkVersion[this.l1Network]
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
    this.ready = true
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('implement')
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

export default Message
