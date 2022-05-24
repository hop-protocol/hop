import { BigNumber, BigNumberish, providers } from 'ethers'
import {
  TokenModel as Token,
  CanonicalToken
} from '@hop-protocol/sdk'
import {
  L1XDaiForeignOmniBridge,
  L1XDaiForeignOmniBridge__factory,
  L1XDaiPoaBridge,
  L1XDaiPoaBridge__factory,
  L1XDaiWETHOmnibridgeRouter,
  L1XDaiWETHOmnibridgeRouter__factory,
} from '@hop-protocol/core/contracts'
import { CanonicalBridge, L1CanonicalBridge } from './CanonicalBridge'

export class GnosisCanonicalBridge extends CanonicalBridge {
  async getNativeBridgeContract(
    address: string
  ): Promise<L1CanonicalBridge> {
    let bridge: L1XDaiPoaBridge | L1XDaiWETHOmnibridgeRouter | L1XDaiForeignOmniBridge
    const isToNativeToken = this.tokenSymbol === CanonicalToken.DAI
    const isEther = this.tokenSymbol === CanonicalToken.ETH
    if (isToNativeToken) {
      bridge = L1XDaiPoaBridge__factory.connect(address, this.signer)
    } else if (isEther) {
      bridge = L1XDaiWETHOmnibridgeRouter__factory.connect(address, this.signer)
    } else {
      bridge = L1XDaiForeignOmniBridge__factory.connect(address, this.signer)
    }
    return bridge
  }

  public async populateDepositTx(amount: BigNumberish, options?: any): Promise<any> {
    const signerAddress = await this.getSignerAddress()
    const from = signerAddress
    const l1CanonicalBridgeAddress = this.getL1CanonicalBridgeAddress()
    const recipient = options?.customRecipient || signerAddress
    const l1CanonicalToken = this.getL1Token()
    const isToNativeToken = this.tokenSymbol === Token.DAI
    const isEther = this.tokenSymbol === Token.ETH
    const gasLimit = BigNumber.from(500_000)

    const nativeBridge = await this.getNativeBridgeContract(
      l1CanonicalBridgeAddress
    )

    if (isToNativeToken) {
      return (nativeBridge as L1XDaiPoaBridge).populateTransaction.relayTokens(
        recipient,
        amount,
        {
          gasLimit,
          from,
        }
      )
    }

    if (isEther) {
      return (nativeBridge as L1XDaiWETHOmnibridgeRouter).populateTransaction[
        'wrapAndRelayTokens(address)'
      ](recipient, {
        gasLimit,
        from,
        value: amount,
      })
    }

    return (nativeBridge as L1XDaiForeignOmniBridge).populateTransaction.relayTokens(
      l1CanonicalToken.address,
      recipient,
      amount,
      {
        gasLimit,
        from,
      }
    )
  }

  async getDestTxHash(l1TxHash: string): Promise<string | null> {
    try {
      if (!l1TxHash) {
        return null
      }

      const l1Provider = providers.getDefaultProvider('mainnet')
      const receipt = await l1Provider.getTransactionReceipt(l1TxHash)
      let topic = ''
      for (const log of receipt.logs) {
        if (log.topics[0] === '0x482515ce3d9494a37ce83f18b72b363449458435fafdd7a53ddea7460fe01b58') {
          topic = log.topics[1]
        }
      }

      if (!topic) {
        return null
      }

      const url = `https://blockscout.com/xdai/mainnet/api?module=logs&action=getLogs&fromBlock=1&toBlock=latest&address=0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59&topic0=0xe194ef610f9150a2db4110b3db5116fd623175dca3528d7ae7046a1042f84fe7&topic3=${topic}&topic0_3_opr=and`

      const res = await fetch(url)
      const json = await res.json()

      if (!json) {
        return null
      }

      if (json.status === '1') {
        const data = json.result?.[0]
        if (!data) {
          return null
        }
        const destTxHash = data.transactionHash
        return destTxHash
      } else {
        throw new Error(json.message)
      }
    } catch (err) {
      return null
    }
  }
}
