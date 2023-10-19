import AbstractChainBridge from '../AbstractChainBridge'
import { IChainBridge } from '../IChainBridge'
import { Signer, providers, BigNumber, Contract } from 'ethers'
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
      l1RpcUrl: "https://goerli.gateway.tenderly.co", // process.env.L1_RPC_URL ?? "", // L1 rpc url
      l2RpcUrl: "https://rpc.goerli.linea.build", // process.env.L2_RPC_URL ?? "", // L2 rpc url
      // l1SignerPrivateKey: this.l1Wallet // process.env.L1_SIGNER_PRIVATE_KEY ?? "", // L1 account private key (optional if you use mode = read-only)
      // l2SignerPrivateKey: this.l2Wallet // process.env.L2_SIGNER_PRIVATE_KEY ?? "", // L2 account private key (optional if you use mode = read-only)
      network: "linea-goerli", // network you want to interact with (either linea-mainnet or linea-goerli)
      mode: "read-only", // contract wrapper class mode (read-only or read-write), read-only: only read contracts state, read-write: read contracts state and claim messages 
    })
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    const signer = this.l2Wallet
    const isSourceTxOnL1 = true

    return await this._relayXDomainMessage(l1TxHash, isSourceTxOnL1, signer)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const signer = this.l1Wallet
    const isSourceTxOnL1 = false

    return this._relayXDomainMessage(l2TxHash, isSourceTxOnL1, signer)
  }

  private async _relayXDomainMessage (txHash: string, isSourceTxOnL1: boolean, wallet: Signer): Promise<providers.TransactionResponse> {
    const contract = isSourceTxOnL1 ? this.LineaSDK.getL2Contract() : this.LineaSDK.getL1Contract()

    const isRelayable = await this._isCheckpointed(txHash, contract)
    if (!isRelayable) {
      throw new Error('expected deposit to be claimable')
    }

    const messages = await contract.getMessagesByTransactionHash(txHash)
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }
    
    const message = messages[0]
    // const txReceipt = await contract.getTransactionReceiptByMessageHash(message.messageHash)
    
    return await contract.claim(message)

    /*
      return await contract.contract.connect(wallet).claimMessage(
        messageSender: message.messageSender, // "", // address of message sender
        messageHash: message.messageHash, // "", // message hash
        fee: message.fee, // BigNumber.from(1), // fee
        destination: message.destination, // "", // destination address of message
        value: message.value, // BigNumber.from(2), // value of message
        calldata: message.calldata, // "0x", // call data
        messageNonce: message.messageNonce, // BigNumber.from(1), // message nonce
        // feeRecipient: txReceipt.feeRecipient // "0x", // address that will receive fees. by default it is the message sender
      )
    */
  }

  private async _isCheckpointed (txHash: string, contract: any): Promise<boolean> {
    const messageStatus = await contract.getMessageStatus(txHash)
    
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