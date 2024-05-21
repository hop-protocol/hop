import { providers, Signer } from 'ethers'
import { wait } from '#utils/wait.js'
import * as MaticJsDefaults from '@maticnetwork/maticjs-pos-zkevm'
// import MaticJs from '@maticnetwork/maticjs-pos-zkevm'
import * as MaticJsEthers from '@maticnetwork/maticjs-ethers'

const { ZkEvmClient, setProofApi } = MaticJsDefaults
const { default: maticJsDefault } = MaticJsDefaults
const { Web3ClientPlugin } = MaticJsEthers

type ZkEvmBridgeType = any // MaticJs.ZkEvmBridge
type ZkEvmClientType = any // MaticJs.ZkEvmClient

interface ZkEvmBridges {
  sourceBridge: ZkEvmBridgeType
  destBridge: ZkEvmBridgeType
}

type Message = string

const DefaultL1RelayGasLimit = 1_000_000
enum MessageDirection {
  L1_TO_L2 = 0,
  L2_TO_L1 = 1
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

export class PolygonZkRelayer {
  networkSlug: string
  l1Wallet: Signer | providers.Provider
  l2Wallet: Signer | providers.Provider

  ready: boolean = false
  zkEvmClient: ZkEvmClientType

  constructor (networkSlug: string, l1Wallet: Signer | providers.Provider, l2Wallet: Signer | providers.Provider) {
    this.networkSlug = networkSlug
    this.l1Wallet = l1Wallet
    this.l2Wallet = l2Wallet

    maticJsDefault.use(Web3ClientPlugin)
    setProofApi('https://proof-generator.polygon.technology/')

    this.zkEvmClient = new ZkEvmClient()
    this.#init(this.networkSlug)
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
    const from = await (this.l2Wallet as Signer).getAddress()
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
}
