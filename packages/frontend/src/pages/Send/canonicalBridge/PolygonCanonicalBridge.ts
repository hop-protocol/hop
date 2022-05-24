import { ethers, BigNumber, BigNumberish } from 'ethers'
import {
  L1PolygonPlasmaBridgeDepositManager,
  L1PolygonPlasmaBridgeDepositManager__factory,
  L1PolygonPosRootChainManager,
  L1PolygonPosRootChainManager__factory,
} from '@hop-protocol/core/contracts'
import {
  TokenModel as Token,
  CanonicalToken
} from '@hop-protocol/sdk'
import { CanonicalBridge, L1CanonicalBridge } from './CanonicalBridge'

export class PolygonCanonicalBridge extends CanonicalBridge {
  public async getNativeBridgeContract(
    address: string
  ): Promise<L1CanonicalBridge> {
    let bridge: L1PolygonPlasmaBridgeDepositManager | L1PolygonPosRootChainManager
    const isToNativeToken = this.tokenSymbol === CanonicalToken.MATIC
    if (isToNativeToken) {
      bridge = L1PolygonPlasmaBridgeDepositManager__factory.connect(address, this.signer)
    } else {
      bridge = L1PolygonPosRootChainManager__factory.connect(address, this.signer)
    }
    return bridge
  }

  public async populateDepositTx(amount: BigNumberish, options?: any): Promise<any> {
    const signerAddress = await this.getSignerAddress()
    const from = signerAddress
    const l1CanonicalBridgeAddress = this.getL1CanonicalBridgeAddress()
    const l1CanonicalTokenAddress = this.getL1CanonicalTokenAddress(this.tokenSymbol)
    const recipient = options?.customRecipient || signerAddress
    const coder = ethers.utils.defaultAbiCoder
    const payload = coder.encode(['uint256'], [amount])
    const isToNativeToken = this.tokenSymbol === Token.MATIC
    const isEther = this.tokenSymbol === Token.ETH
    const gasLimit = BigNumber.from(500_000)
    const nativeBridge = await this.getNativeBridgeContract(
      l1CanonicalBridgeAddress
    )

    if (isToNativeToken) {
      return (
        nativeBridge as L1PolygonPlasmaBridgeDepositManager
      ).populateTransaction.depositERC20ForUser(
        l1CanonicalTokenAddress,
        recipient,
        BigNumber.from(amount),
        {
          from,
          gasLimit,
        }
      )
    }

    if (isEther) {
      return (
        nativeBridge as L1PolygonPosRootChainManager
      ).populateTransaction.depositEtherFor(recipient, {
        from,
        gasLimit,
        value: BigNumber.from(amount),
      })
    }

    return (nativeBridge as L1PolygonPosRootChainManager).populateTransaction.depositFor(
      recipient,
      l1CanonicalTokenAddress,
      payload,
      {
        from,
        gasLimit
      }
    )
  }

  public async getDestTxHash(l1TxHash: string): Promise<string | null> {
    try {
      if (!l1TxHash) {
        return null
      }

      const url = `https://open-api.polygon.technology/api/v1/deposit/tx?txHash=${l1TxHash}`
      const res = await fetch(url, {
        headers: {
          'x-access-token': '64cbf956-198a-47e0-b4a1-2b3432d8f70d'
        }
      })
      const json = await res.json()
      if (!json) {
        return null
      }
      if (json.success) {
        const data = json.result[0]
        if (data.transactionStatus === 'deposited') {
          const destTxHash = data.transactionHash
          return destTxHash
        }
        return null
      } else {
        throw new Error(json.message)
      }
    } catch (err) {
      return null
    }
  }
}
