import { Signer, Contract } from 'ethers'
import ConvertOption from './ConvertOption'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { Hop, HopBridge, Token as SDKToken } from '@hop-protocol/sdk'

class NativeConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor () {
    super()

    this.name = 'Native Bridge'
    this.slug = 'native-bridge'
    this.path = '/bridge'
  }

  async getTargetAddress (
    sdk: Hop,
    token: SDKToken | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined
  ): Promise<string> {
    if (!token) {
      throw new Error('Token is required to get target address')
    }

    if (!sourceNetwork) {
      throw new Error('destNetwork is required to get target address')
    }

    if (!destNetwork) {
      throw new Error('destNetwork is required to get target address')
    }

    let l2Network: Network
    if (!sourceNetwork.isLayer1) {
      l2Network = sourceNetwork
    } else {
      l2Network = destNetwork
    }

    console.log('111')
    console.log('token.symbol: ', token.symbol)
    console.log('l2Network.slug: ', l2Network.slug)
    const nativeBridge = sdk
      .canonicalBridge(token.symbol, l2Network.slug)

    console.log('222')
    let bridgeContract: Contract
    if (sourceNetwork?.isLayer1) {
      bridgeContract = await nativeBridge.getL1CanonicalBridge()
    } else {
      bridgeContract = await nativeBridge.getL2CanonicalBridge()
    }
    console.log('bridgeContract.address: ', bridgeContract.address)
    return bridgeContract.address
  }

  async convert (
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    token: Token,
    value: string
  ) {
    let l2Network: Network
    if (!sourceNetwork.isLayer1) {
      l2Network = sourceNetwork
    } else {
      l2Network = destNetwork
    }

    const bridge = sdk
      .canonicalBridge(token.symbol, l2Network.slug)
      .connect(signer as Signer)

    if (sourceNetwork.isLayer1 && isForwardDirection) {
      return bridge.connect(signer as Signer).deposit(value)
    } else if (destNetwork.isLayer1 && !isForwardDirection) {
      return bridge.connect(signer as Signer).withdraw(value)
    } else {
      throw new Error('Invalid isForwardDirection and network configuration')
    }
  }

  async sourceToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<SDKToken | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL1Token()
    } else {
      return bridge.getCanonicalToken(network.slug)
    }
  }

  async destToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<SDKToken | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getCanonicalToken(network.slug)
    } else {
      return bridge.getL1Token()
    }
  }
}

export default NativeConvertOption
