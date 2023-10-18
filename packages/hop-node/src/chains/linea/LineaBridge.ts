import AbstractChainBridge from '../AbstractChainBridge'
import { IChainBridge } from '../IChainBridge'
import { Signer, providers, BigNumber, Contract } from 'ethers'
import { LineaSDK } from '@consensys/linea-sdk'
// import { L1MessageServiceContract, L2MessageServiceContract } from "../contracts"

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
    const contract = networkId === 0 ? this.LineaSDK.getL1Contract  : this.LineaSDK.getL2Contract

    const isRelayable = await this._isCheckpointed(contract)
    if (!isRelayable) {
      throw new Error('expected deposit to be claimable')
    }

    const messages = await contract.getMessagesByTransactionHash("0x4b72c6abacd3e2372a32e2797c41cab08df8d5e6fb2eb453e896e52fe7b70a27")
    const txReceipt = await contract.getTransactionReceiptByMessageHash("0x13dd0f5e3611b44c88e80f5206bbe1ce1c6996514cef1e209e9eb06d9f5b9a2d")

    // return await contract.claim({ // claims message by message 
    return await contract.connect(this.l2Wallet).claim({
      messageSender: txReceipt.messageSender, // "", // address of message sender
      messageHash: txReceipt.messageHash, // "", // message hash
      fee: txReceipt.fee, // BigNumber.from(1), // fee
      destination: txReceipt.destination, // "", // destination address of message
      value: txReceipt.value, // BigNumber.from(2), // value of message
      calldata: txReceipt.calldata, // "0x", // call data
      messageNonce: txReceipt.messageNonce, // BigNumber.from(1), // message nonce
      feeRecipient: txReceipt.feeRecipient // "0x", // address that will receive fees. by default it is the message sender
    })
  }

  private async _isCheckpointed (contract): Promise<boolean> {
    const messageStatus = await contract.getMessageStatus("0x13dd0f5e3611b44c88e80f5206bbe1ce1c6996514cef1e209e9eb06d9f5b9a2d")
    
    // if (messageStatus === 'isClaimable' || 'isExitable') {
    //   return true
    // } else {
    //   return false
    // }

    return Promise.resolve(true)
  }
}
export default LineaBridge


/*
  import AbstractChainBridge from '../AbstractChainBridge'
  import { IChainBridge } from '../IChainBridge'
  import { providers } from 'ethers'

  class LineaBridge extends AbstractChainBridge implements IChainBridge {
    async relayL2ToL1Message (txHash: string): Promise<providers.TransactionResponse> {
      throw new Error('unimplemented')
    }
  }

  export default LineaBridge
*/
