import AbstractChainBridge from '../AbstractChainBridge'
import { IChainBridge } from '../IChainBridge'
import { Signer, providers, BigNumber } from 'ethers'
import { LineaSDK } from '@consensys/linea-sdk'

class LineaBridge extends AbstractChainBridge implements IChainBridge {
  l1Provider: any
  l2Provider: any
  l1Wallet: Signer
  l2Wallet: Signer
  chainId: number
  apiUrl: string
  lineaMainnetChainId: number = 59144
  LineaSDK: LineaSDK

  constructor (chainSlug: string) {
    super(chainSlug)

    this.LineaSDK = new LineaSDK({
      l1RpcUrl: process.env.L1_RPC_URL ?? "", // L1 rpc url
      l2RpcUrl: process.env.L2_RPC_URL ?? "", // L2 rpc url
      // l1SignerPrivateKey: this.l1Wallet // process.env.L1_SIGNER_PRIVATE_KEY ?? "", // L1 account private key (optional if you use mode = read-only)
      // l2SignerPrivateKey: this.l2Wallet // process.env.L2_SIGNER_PRIVATE_KEY ?? "", // L2 account private key (optional if you use mode = read-only)
      network: "linea-goerli", // network you want to interact with (either linea-mainnet or linea-goerli)
      mode: "read-only", // contract wrapper class mode (read-only or read-write), read-only: only read contracts state, read-write: read contracts state and claim messages 
    })
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

    const contract = networkId === 0 ? this.LineaSDK.getL1Contract : this.LineaSDK.getL2Contract 

    // return await contract.claim({ // claims message by message 
    await contract.connect(this.l2Wallet).claim({
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
    // if (networkId === 0) {
    //   return this.LineaSDK.isDepositClaimable(txHash)
    // } else if (networkId === 1) {
    //   return this.LineaSDK.isWithdrawExitable(txHash)
    // } else {
    //   throw new Error('invalid networkId')
    // }

    return Promise.resolve(true)
  }
}
export default LineaBridge
