import AbstractChainBridge from '../AbstractChainBridge'
import fetch from 'node-fetch'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { FxPortalClient } from '@fxportal/maticjs-fxportal'
import { IChainBridge } from '../IChainBridge'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { networks } from '@hop-protocol/core/networks'
import { providers, utils } from 'ethers'
import { setProofApi, use } from '@maticnetwork/maticjs'

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

class PolygonBridge extends AbstractChainBridge implements IChainBridge {
  ready: boolean = false
  apiUrl: string
  l1Network: string
  maticClient: any

  constructor (chainSlug: string) {
    super(chainSlug)

    for (const network in networks) {
      const chainId = (networks as any)[network]?.polygon?.networkId
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

    this.maticClient = new FxPortalClient()
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    // As of Jun 2023, the maticjs-fxportal client errors out with an underflow error
    // To resolve the issue, this logic just rips out the payload generation and sends the tx manually
    const rootTunnelAddress: string = await this._getRootTunnelAddressFromTxHash(l2TxHash)
    await this._initClient(rootTunnelAddress)

    const isCheckpointed = await this._isCheckpointed(l2TxHash)
    if (!isCheckpointed) {
      throw new Error(`l2TxHash ${l2TxHash} is not checkpointed`)
    }

    // Generate payload
    const logEventSig = '0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036'
    const payload = await this.maticClient.exitUtil.buildPayloadForExit(l2TxHash, logEventSig, true)

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

  private async _initClient (rootTunnelAddress: string): Promise<void> {
    const from = await this.l1Wallet.getAddress()
    const sdkNetwork = polygonSdkNetwork[this.l1Network]
    const sdkVersion = polygonSdkVersion[this.l1Network]
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
      },
      erc20: {
        rootTunnel: rootTunnelAddress
      }
    })
    this.ready = true
  }

  async _isCheckpointed (l2TxHash: string) {
    const l2Block = await this.l2Wallet.provider!.getTransactionReceipt(l2TxHash)
    const url = `${this.apiUrl}/${l2Block.blockNumber}`
    const res = await fetch(url)
    const json = await res.json()
    return json.message === 'success'
  }

  async _getRootTunnelAddressFromTxHash (l2TxHash: string): Promise<string> {
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
}

export default PolygonBridge
