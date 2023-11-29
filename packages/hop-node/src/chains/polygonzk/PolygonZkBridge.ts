import AbstractChainBridge from '../AbstractChainBridge'
import wait from 'src/utils/wait'
import { IChainBridge } from '../IChainBridge'
import { Signer, providers } from 'ethers'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'
import { networks } from '@hop-protocol/core/networks'

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

class PolygonZkBridge extends AbstractChainBridge implements IChainBridge {
  ready: boolean = false
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
  chainId: number
  apiUrl: string
  polygonNetwork: string
  zkEvmClient: ZkEvmClient
  messengerAddress: string
  l1Network: string

  constructor (chainSlug: string) {
    super(chainSlug)

    for (const network in networks) {
      const chainId = (networks as any)[network]?.polygonzk?.networkId
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

  private async _tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this._tilReady()
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('not implemented')
    // await this._tilReady()

    // const isSourceTxOnL1 = true
    // const signer = this.l2Wallet
    // return await this._relayXDomainMessage(l1TxHash, isSourceTxOnL1, signer)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    throw new Error('not implemented')
    // await this._tilReady()

    // const isSourceTxOnL1 = false
    // const signer = this.l1Wallet
    // return this._relayXDomainMessage(l2TxHash, isSourceTxOnL1, signer)
  }

  // private async _relayXDomainMessage (txHash: string, isSourceTxOnL1: boolean, wallet: Signer): Promise<providers.TransactionResponse> {
  //   const isRelayable = await this._isCheckpointed(txHash, isSourceTxOnL1)
  //   if (!isRelayable) {
  //     throw new Error('expected deposit to be claimable')
  //   }

  //   // The bridge to claim on will be on the opposite chain that the source tx is on
  //   const zkEvmClaimBridge = isSourceTxOnL1 ? this.zkEvmClient.childChainBridge : this.zkEvmClient.rootChainBridge

  //   // Get the payload to claim the tx
  //   const networkId = await zkEvmClaimBridge.networkID()
  //   const claimPayload = await this.zkEvmClient.bridgeUtil.buildPayloadForClaim(txHash, isSourceTxOnL1, networkId)

  //   // Execute the claim tx
  //   const claimMessageTx = await zkEvmClaimBridge.claimMessage(
  //     claimPayload.smtProof,
  //     claimPayload.index,
  //     claimPayload.mainnetExitRoot,
  //     claimPayload.rollupExitRoot,
  //     claimPayload.originNetwork,
  //     claimPayload.originTokenAddress,
  //     claimPayload.destinationNetwork,
  //     claimPayload.destinationAddress,
  //     claimPayload.amount,
  //     claimPayload.metadata,
  //     { gasLimit: CanonicalMessengerRootConfirmationGasLimit }
  //   )

  //   const claimMessageTxHash: string = await claimMessageTx.getTransactionHash()
  //   return await wallet.provider!.getTransaction(claimMessageTxHash)
  // }

  // private async _isCheckpointed (txHash: string, isSourceTxOnL1: boolean): Promise<boolean> {
  //   if (isSourceTxOnL1) {
  //     return this.zkEvmClient.isDepositClaimable(txHash)
  //   }
  //   return this.zkEvmClient.isWithdrawExitable(txHash)
  // }
}
export default PolygonZkBridge
