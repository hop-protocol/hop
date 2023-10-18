import AbstractChainBridge from '../AbstractChainBridge'
import { IChainBridge } from '../IChainBridge'
import { Signer, providers } from 'ethers'
import { LineaSDK } from '@consensys/linea-sdk'

/*
import wait from 'src/utils/wait'
import { CanonicalMessengerRootConfirmationGasLimit } from 'src/constants'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { ZkEvmClient, setProofApi, use } from '@maticnetwork/maticjs'
*/

class LineaBridge extends AbstractChainBridge implements IChainBridge {
  ready: boolean = false
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
  chainId: number
  apiUrl: string
  lineaMainnetChainId: number = 59144
  LineaSDK: LineaSDK
  messengerAddress: string

  constructor (chainSlug: string) {
    super(chainSlug)

    // this.apiUrl = `https://proof-generator.polygon.technology/api/v1/${
    //   this.chainId === this.polygonzkMainnetChainId ? 'matic' : 'mumbai'
    // }/block-included`

    // use(Web3ClientPlugin)
    // setProofApi('https://proof-generator.polygon.technology/')

    this.LineaSDK = new LineaSDK({
      l1RpcUrl: process.env.L1_RPC_URL ?? "", // L1 rpc url
      l2RpcUrl: process.env.L2_RPC_URL ?? "", // L2 rpc url
      l1SignerPrivateKey: this.l1Wallet // process.env.L1_SIGNER_PRIVATE_KEY ?? "", // L1 account private key (optional if you use mode = read-only)
      l2SignerPrivateKey: this.l2Wallet // process.env.L2_SIGNER_PRIVATE_KEY ?? "", // L2 account private key (optional if you use mode = read-only)
      network: "linea-goerli", // network you want to interact with (either linea-mainnet or linea-goerli)
      mode: "read-write", // contract wrapper class mode (read-only or read-write), read-only: only read contracts state, read-write: read contracts state and claim messages 
    })

    // this.messengerAddress = this.chainId === this.polygonzkMainnetChainId ? '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe' : '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7'

    // this.init()
    //   .catch((err: any) => {
    //     this.logger.error('zkEvmClient initialize error:', err)
    //   })
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    const networkId = 0
    const signer = this.l2Wallet
    return await this._relayXDomainMessage(l1TxHash, networkId, signer)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const networkId = 1
    const signer = this.l1Wallet
    return this._relayXDomainMessage(l2TxHash, networkId, signer)
  }

  private async _relayXDomainMessage (txHash: string, networkId: number, wallet: Signer): Promise<providers.TransactionResponse> {
    const isRelayable = await this._isCheckpointed(txHash, networkId)
    if (!isRelayable) {
      throw new Error('expected deposit to be claimable')
    }

    const isParent = networkId === 0
    const claimPayload = await this.zkEvmClient.bridgeUtil.buildPayloadForClaim(txHash, isParent, networkId)

    return await l2Contract.claim({ // claims message by message 
      messageSender: "", // address of message sender
      messageHash: "", // message hash
      fee: BigNumber.from(1), // fee
      destination: "", // destination address of message
      value: BigNumber.from(2), // value of message
      calldata: "0x", // call data
      messageNonce: BigNumber.from(1), // message nonce
      feeRecipient: "0x", // address that will receive fees. by default it is the message sender
    })
  }

  private async _isCheckpointed (txHash: string, networkId: number): Promise<boolean> {
    if (networkId === 0) {
      return this.LineaSDK.isDepositClaimable(txHash)
    } else if (networkId === 1) {
      return this.LineaSDK.isWithdrawExitable(txHash)
    } else {
      throw new Error('invalid networkId')
    }
  }
}
export default LineaBridge
