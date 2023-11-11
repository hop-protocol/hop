import AbstractChainBridge from '../AbstractChainBridge'
import { IChainBridge } from '../IChainBridge'
import { Signer, providers } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'

// TODO: Implement
type Message = string
type MessageStatus = string

class PolygonZkBridge extends AbstractChainBridge<Message, MessageStatus> implements IChainBridge {
  ready: boolean = false
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
  chainId: number
  apiUrl: string
  polygonzkMainnetChainId: number = 1101
  zkEvmClient: ZkEvmClient
  messengerAddress: string

  constructor (chainSlug: string) {
    super(chainSlug)

    this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${
      this.chainId === this.polygonzkMainnetChainId ? 'matic' : 'mumbai'
    }/block-included`

    use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()
    this.messengerAddress = this.chainId === this.polygonzkMainnetChainId ? '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe' : '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7'

    this.init()
      .catch((err: any) => {
        this.logger.error('zkEvmClient initialize error:', err)
      })
  }

  async init () {
    const from = await this.l1Wallet.getAddress()
    await this.zkEvmClient.init({
      network: this.chainId === this.polygonzkMainnetChainId ? 'mainnet' : 'testnet',
      version: this.chainId === this.polygonzkMainnetChainId ? 'v1' : 'blueberry',
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

  protected async sendRelayTransaction (message: Message): Promise<providers.TransactionResponse> {
    throw new Error('implement')
  }

  protected async getMessage (txHash: string): Promise<Message> {
    throw new Error('implement')
  }

  protected async getMessageStatus (message: Message): Promise<MessageStatus> {
    throw new Error('implement')
  }

  protected async isMessageInFlight (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageCheckpointed (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }

  protected async isMessageRelayed (messageStatus: MessageStatus): Promise<boolean> {
    throw new Error('implement')
  }
}
export default PolygonZkBridge
