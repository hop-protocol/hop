import {
  StandardBridgeAdapter,
  CrossChainMessenger,
} from '@eth-optimism/sdk'
import { BigNumber, BigNumberish, providers } from 'ethers'
import {
  L1OptimismDaiTokenBridge,
  L1OptimismDaiTokenBridge__factory,
  L1OptimismGateway,
  L1OptimismGateway__factory,
} from '@hop-protocol/core/contracts'
import {
  TokenModel as Token,
  CanonicalToken
} from '@hop-protocol/sdk'
import { CanonicalBridge, L1CanonicalBridge } from './CanonicalBridge'

export class OptimismCanonicalBridge extends CanonicalBridge {
  async getNativeBridgeContract(
    address: string
  ): Promise<L1CanonicalBridge> {
    let bridge: L1OptimismDaiTokenBridge | L1OptimismGateway
    const isToNativeToken = this.tokenSymbol === CanonicalToken.DAI
    if (isToNativeToken) {
      bridge = L1OptimismDaiTokenBridge__factory.connect(address, this.signer)
    } else {
      bridge = L1OptimismGateway__factory.connect(address, this.signer)
    }
    return bridge
  }

  public async populateDepositTx(amount: BigNumberish, options?: any): Promise<any> {
    const signerAddress = await this.getSignerAddress()
    const from = signerAddress
    const l1CanonicalBridgeAddress = this.getL1CanonicalBridgeAddress()
    const recipient = options?.customRecipient || signerAddress
    const l1CanonicalToken = this.getL1Token()
    const l2TokenAddress = this.getL2CanonicalTokenAddress(this.tokenSymbol, this.chain)
    const l2Gas = BigNumber.from(2_000_000)
    const data = '0x'
    const isToNativeToken = this.tokenSymbol === Token.ETH
    const gasLimit = BigNumber.from(500_000)

    if (!l2TokenAddress) {
      throw new Error(
        `token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`
      )
    }

    const nativeBridge = await this.getNativeBridgeContract(
      l1CanonicalBridgeAddress
    )

    if (isToNativeToken) {
      return (nativeBridge as L1OptimismGateway).populateTransaction.depositETHTo(
        recipient,
        l2Gas,
        data,
        {
          from,
          gasLimit,
          value: amount,
        }
      )
    }

    return (nativeBridge as L1OptimismGateway).populateTransaction.depositERC20To(
      l1CanonicalToken.address,
      l2TokenAddress,
      recipient,
      amount,
      l2Gas,
      data,
      {
        from,
        gasLimit
      }
    )
  }

  async getDestTxHash(l1TxHash: string): Promise<string | null> {
    try {
      if (!l1TxHash) {
        return null
      }

      const l1MessengerAddress = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'
      const l2MessengerAddress = '0x4200000000000000000000000000000000000007'
      const l1BridgeAddress = '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1'
      const l2BridgeAddress = '0x4200000000000000000000000000000000000010'

      const l1Provider = providers.getDefaultProvider('mainnet')
      const l2Provider = new providers.StaticJsonRpcProvider('https://mainnet.optimism.io')
      const messenger = new CrossChainMessenger({
        l1SignerOrProvider: l1Provider,
        l2SignerOrProvider: l2Provider,
        l1ChainId: 1,
        contracts: {
          l1: {
            L1CrossDomainMessenger: l1MessengerAddress,
            L1StandardBridge: l1BridgeAddress,
          },
          l2: {
            L2CrossDomainMessenger: l2MessengerAddress,
            L2StandardBridge: l2BridgeAddress,
          },
        },
        bridges: {
          Standard: {
            Adapter: StandardBridgeAdapter,
            l1Bridge: l1BridgeAddress,
            l2Bridge: l2BridgeAddress,
          },
        },
      })

      const l1ToL2MsgHash = await messenger.toCrossChainMessage(l1TxHash)
      if (!l1ToL2MsgHash) {
        return null
      }
      const receipt = await messenger.getMessageReceipt(l1ToL2MsgHash)
      const destTxHash = receipt?.transactionReceipt?.transactionHash
      if (!destTxHash) {
        return null
      }
      return destTxHash
    } catch (err) {
      return null
    }
  }
}
