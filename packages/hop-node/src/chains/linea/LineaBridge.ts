import AbstractChainBridge from '../AbstractChainBridge'
import getRpcUrlFromProvider from 'src/utils/getRpcUrlFromProvider'
import { IChainBridge } from '../IChainBridge'
import { LineaSDK } from '@consensys/linea-sdk'
import { Signer, constants, providers } from 'ethers'
import { networks } from '@hop-protocol/core/networks'

class LineaBridge extends AbstractChainBridge implements IChainBridge {
  l1Wallet: Signer
  l2Wallet: Signer
  LineaSDK: LineaSDK
  private readonly lineaL1Contract
  private readonly lineaL2Contract

  constructor (chainSlug: string) {
    super(chainSlug)

    let lineaNetwork: any
    for (const network in networks) {
      const chainId = (networks as any)[network]?.linea?.networkId
      if (chainId === this.chainId) {
        lineaNetwork = `linea-${network}`
        break
      }
    }

    if (!lineaNetwork) {
      throw new Error('linea sdk network name not found')
    }

    // TODO: as of Oct 2023, there is no way to use the SDK in read-write with an ethers signer rather than private keys
    this.LineaSDK = new LineaSDK({
      l1RpcUrl: getRpcUrlFromProvider(this.l1Wallet.provider!),
      l2RpcUrl: getRpcUrlFromProvider(this.l2Wallet.provider!),
      network: lineaNetwork, // options are: "linea-mainnet", "linea-goerli
      mode: 'read-only'
    })

    this.lineaL1Contract = this.LineaSDK.getL1Contract()
    this.lineaL2Contract = this.LineaSDK.getL2Contract()
  }

  async relayL1ToL2Message (l1TxHash: string): Promise<providers.TransactionResponse> {
    const isSourceTxOnL1 = true
    return await this._relayXDomainMessage(l1TxHash, isSourceTxOnL1)
  }

  async relayL2ToL1Message (l2TxHash: string): Promise<providers.TransactionResponse> {
    const isSourceTxOnL1 = false
    return this._relayXDomainMessage(l2TxHash, isSourceTxOnL1)
  }

  private async _relayXDomainMessage (txHash: string, isSourceTxOnL1: boolean): Promise<providers.TransactionResponse> {
    const wallet: Signer = isSourceTxOnL1 ? this.l2Wallet : this.l1Wallet
    const sourceBridge = isSourceTxOnL1 ? this.lineaL1Contract : this.lineaL2Contract
    const destinationBridge = isSourceTxOnL1 ? this.lineaL2Contract : this.lineaL1Contract

    const messages = await sourceBridge.getMessagesByTransactionHash(txHash)
    if (!messages) {
      throw new Error('could not find messages for tx hash')
    }

    const message = messages[0]
    const messageHash = message.messageHash

    const isRelayable = await this._isCheckpointed(messageHash, destinationBridge)
    if (!isRelayable) {
      throw new Error('expected deposit to be claimable')
    }

    // Gas estimation does not work sometimes, so manual limit is needed
    // https://lineascan.build/tx/0x8e3c6d7bd3b7d39154c9463535a576db1a1e4d1e99d3a6526feb5bde26a926c0#internal
    const gasLimit = 500000
    const txOverrides = { gasLimit }
    // When the fee recipient is the zero address, the fee is sent to the msg.sender
    const feeRecipient = constants.AddressZero
    return await destinationBridge.contract.connect(wallet).claimMessage(
      message.messageSender,
      message.destination,
      message.fee,
      message.value,
      feeRecipient,
      message.calldata,
      message.messageNonce,
      txOverrides
    )
  }

  // TODO: Add types to this and the bridge
  private async _isCheckpointed (messageHash: string, destinationBridge: any): Promise<boolean> {
    const messageStatus = await destinationBridge.getMessageStatus(messageHash)
    if (messageStatus === 'CLAIMABLE') {
      return true
    }
    return false
  }
}
export default LineaBridge
