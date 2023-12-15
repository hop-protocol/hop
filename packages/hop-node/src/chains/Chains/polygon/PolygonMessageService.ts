import fetch from 'node-fetch'
import { AbstractMessageService, IMessageService } from 'src/chains/Services/AbstractMessageService'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { FxPortalClient } from '@fxportal/maticjs-fxportal'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { getNetworkSlugByChainSlug } from 'src/chains/utils'
import { providers, utils } from 'ethers'
import { setProofApi, use } from '@maticnetwork/maticjs'

type PolygonMessage = string
type PolygonMessageStatus = string

type MessageOpts = {
  rootTunnelAddress: string
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
  goerli: 'mumbai'
}

export class PolygonMessageService extends AbstractMessageService<PolygonMessage, PolygonMessageStatus, MessageOpts> implements IMessageService {
  ready: boolean = false
  apiUrl: string
  maticClient: any

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

    this.maticClient = new FxPortalClient()

    this.#_initClient(networkSlug)
      .then(() => {
        this.ready = true
        console.log('Matic client initialized')
      })
      .catch((err: any) => {
        this.logger.error('Matic client initialize error:', err)
      })
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('L1 to L2 message relay not supported. Messages are relayed with a system tx.')
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    // As of Jun 2023, the maticjs-fxportal client errors out with an underflow error
    // To resolve the issue, this logic just rips out the payload generation and sends the tx manually
    const rootTunnelAddress: string = await this.#getRootTunnelAddressFromTxHash(l2TxHash)

    const messageOpts: MessageOpts = {
      rootTunnelAddress
    }

    // Message is a txHash for Polygon
    return this.validateMessageAndSendTransaction(l2TxHash, messageOpts)
  }

  async #_initClient (l1Network: string): Promise<void> {
    const from = await this.l1Wallet.getAddress()
    const sdkNetwork = polygonSdkNetwork[l1Network]
    const sdkVersion = polygonSdkVersion[l1Network]
    await this.maticClient.init({
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

  async #getRootTunnelAddressFromTxHash (l2TxHash: string): Promise<string> {
    // Get the bridge address from the logs
    // TransfersCommitted(uint256,bytes32,uint256,uint256)
    const logEvent = '0xf52ad20d3b4f50d1c40901dfb95a9ce5270b2fc32694e5c668354721cd87aa74'
    const receipt: providers.TransactionReceipt = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    if (!receipt.logs) {
      throw new Error(`no logs found for ${l2TxHash}`)
    }

    let bridgeAddress: string | undefined
    for (const log of receipt.logs) {
      if (log.topics[0] === logEvent) {
        bridgeAddress = log.address
      }
    }

    if (!bridgeAddress) {
      throw new Error(`bridge address not found for ${l2TxHash}`)
    }

    // Get the messengerProxy address from the bridge state
    // function messengerProxy() view returns (address)
    const messengerProxySelector = '0xce2d280e'
    let messengerProxyAddress = await this.l2Wallet.provider!.call({
      to: bridgeAddress,
      data: messengerProxySelector
    })

    if (!messengerProxyAddress) {
      throw new Error(`messenger proxy address not found for ${l2TxHash}`)
    }

    // Get the rootTunnel from the messengerProxy
    // function fxRootTunnel() view returns (address)
    messengerProxyAddress = defaultAbiCoder.decode(['address'], messengerProxyAddress)[0]
    const fxRootTunnelSelector = '0x7f1e9cb0'
    const rootTunnelAddress = await this.l2Wallet.provider!.call({
      to: messengerProxyAddress,
      data: fxRootTunnelSelector
    })

    if (!rootTunnelAddress) {
      throw new Error(`root tunnel address not found for ${l2TxHash}`)
    }
    return defaultAbiCoder.decode(['address'], rootTunnelAddress)[0]
  }

  protected async sendRelayTransaction (message: PolygonMessage, messageOpts: MessageOpts): Promise<providers.TransactionResponse> {
    const { rootTunnelAddress } = messageOpts

    // Generate payload
    const logEventSig = '0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036'
    const payload = await this.maticClient.exitUtil.buildPayloadForExit(message, logEventSig, true)

    // Create tx data and send
    const abi = ['function receiveMessage(bytes)']
    const iface = new utils.Interface(abi)
    const data = iface.encodeFunctionData('receiveMessage', [payload])
    return this.l1Wallet.sendTransaction({
      to: rootTunnelAddress,
      data,
      gasLimit: CanonicalMessengerRootConfirmationGasLimit
    })
  }

  protected async getMessage (txHash: string): Promise<PolygonMessage> {
    // Polygon message is defined by the txHash, so we return that
    return txHash
  }

  protected async getMessageStatus (message: PolygonMessage): Promise<PolygonMessageStatus> {
    // Polygon status is defined by the message (txHash), so we return that
    return message
  }

  protected async isMessageInFlight (messageStatus: PolygonMessageStatus): Promise<boolean> {
    const apiRes = await this.#fetchBlockIncluded(messageStatus)
    return apiRes.message === 'No block found'
  }

  protected async isMessageRelayable (messageStatus: PolygonMessageStatus): Promise<boolean> {
    const apiRes = await this.#fetchBlockIncluded(messageStatus)
    return apiRes.message === 'success'
  }

  protected async isMessageRelayed (messageStatus: PolygonMessageStatus): Promise<boolean> {
    // This is not accurate, but we don't have a way to check if a message has been relayed
    // This will suffice for how the bonder uses this call, but will not work more broadly
    const apiRes = await this.#fetchBlockIncluded(messageStatus)
    return apiRes.message === 'success'
  }

  async #fetchBlockIncluded (messageStatus: PolygonMessageStatus): Promise<any> {
    const l2Block = await this.l2Wallet.provider!.getTransactionReceipt(messageStatus)
    const url = `${this.apiUrl}/${l2Block.blockNumber}`
    const res = await fetch(url)
    return res.json()
  }
}
