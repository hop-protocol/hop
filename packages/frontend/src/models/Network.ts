import * as ethers from 'ethers'
import { getProvider } from 'src/utils'

export type Networkish = Network | string | undefined

export type NetworkProps = {
  name: string
  slug: string
  imageUrl: string
  rpcUrl: string
  networkId: number
  chainId?: number
  nativeTokenSymbol: string
  isLayer1?: boolean
  isL1?: boolean
  nativeBridgeUrl?: string
  waitConfirmations?: number
  explorerUrl: string
}

class Network {
  readonly name: string
  readonly slug: string
  readonly imageUrl: string
  readonly provider: ethers.providers.Provider
  readonly rpcUrl: string
  readonly networkId: number
  readonly chainId: number
  readonly nativeTokenSymbol: string
  readonly isLayer1: boolean
  readonly isL1: boolean
  readonly nativeBridgeUrl: string | undefined
  readonly waitConfirmations?: number
  readonly explorerUrl: string

  constructor(props: NetworkProps) {
    this.name = props.name
    this.slug = props.slug
    this.imageUrl = props.imageUrl
    this.rpcUrl = props.rpcUrl
    this.provider = getProvider(props.rpcUrl)
    this.networkId = props.networkId
    this.chainId = props.networkId
    this.nativeTokenSymbol = props.nativeTokenSymbol
    this.isLayer1 = props.isLayer1 ? props.isLayer1 : false
    this.isL1 = this.isLayer1
    this.nativeBridgeUrl = props.nativeBridgeUrl
    this.waitConfirmations = props.waitConfirmations
    this.explorerUrl = props.explorerUrl
  }

  toString() {
    return this.name
  }

  eq(otherNetwork: Network) {
    return otherNetwork.networkId === this.networkId
  }
}

export default Network
