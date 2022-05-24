import { Signer, BigNumber, BigNumberish, providers } from 'ethers'
import { L1TransactionReceipt, L1ToL2MessageStatus, Erc20Bridger, EthBridger, getL2Network } from '@arbitrum/sdk'
import {
  Chain,
  TokenModel as Token,
  CanonicalToken,
  ChainId
} from '@hop-protocol/sdk'
import { CanonicalBridge, L1CanonicalBridge } from './CanonicalBridge'

export class ArbitrumCanonicalBridge extends CanonicalBridge {
  public async getNativeBridgeContract(
    address: string
  ): Promise<L1CanonicalBridge> {
    const l2Network = await getL2Network(ChainId.Arbitrum)
    const isToNativeToken = this.tokenSymbol === CanonicalToken.ETH
    let bridge: EthBridger | Erc20Bridger
    if (isToNativeToken) {
      bridge = new EthBridger(l2Network)
    } else {
      bridge = new Erc20Bridger(l2Network)
    }
    return bridge
  }

  public async populateDepositTx(amount: BigNumberish, options?: any): Promise<any> {
    const signerAddress = await this.getSignerAddress()
    const from = signerAddress
    const l1CanonicalBridgeAddress = this.getL1CanonicalBridgeAddress()
    const l1CanonicalTokenAddress = this.getL1CanonicalTokenAddress(this.tokenSymbol)
    const isToNativeToken = this.tokenSymbol === Token.ETH

    if (options?.customRecipient) {
      throw new Error('custom recipient not supported with native bridge')
    }

    const nativeBridge = await this.getNativeBridgeContract(
      l1CanonicalBridgeAddress
    )

    const overrides: any = {
      ...this.txOverrides(Chain.Ethereum),
      from,
      gasLimit: BigNumber.from(500_000),
    }

    if (isToNativeToken) {
      return (nativeBridge as EthBridger).deposit({
        amount: BigNumber.from(amount),
        l1Signer: (await this.getSignerOrProvider(Chain.Ethereum, this.signer)) as Signer,
        l2Provider: (await this.getSignerOrProvider(
          Chain.Arbitrum
        )) as providers.JsonRpcProvider,
        ...overrides,
      })
    }

    const l1Signer = await this.getSignerOrProvider(Chain.Ethereum, this.signer)
    const l2Provider = await this.getSignerOrProvider(Chain.Arbitrum)
    return (nativeBridge as Erc20Bridger).deposit({
      erc20L1Address: l1CanonicalTokenAddress,
      amount: BigNumber.from(amount),
      l1Signer: l1Signer as Signer,
      l2Provider: l2Provider as providers.JsonRpcProvider,
      ...overrides,
    })
  }

  public async getDestTxHash(l1TxHash: string):  Promise<string | null> {
    try {
      if (!l1TxHash) {
        return null
      }
      const l1Provider = providers.getDefaultProvider('mainnet')
      const l2Signer = new providers.StaticJsonRpcProvider('https://arb1.arbitrum.io/rpc')
      const transactionHash = l1TxHash
      const txnReceipt = await l1Provider.getTransactionReceipt(transactionHash)
      if (!txnReceipt) {
        return null
      }

      const l1TxnReceipt = new L1TransactionReceipt(
        txnReceipt
      )

      if (!l1TxnReceipt) {
        return null
      }

      const l1ToL2Message = await l1TxnReceipt.getL1ToL2Message(
        l2Signer
      )

      const res = (await l1ToL2Message.waitForStatus()) as any
      if (res.l2TxReceipt) {
        return res.l2TxReceipt.transactionHash
      }

      return null
    } catch (err) {
      return null
    }
  }
}
