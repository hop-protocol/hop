import { ChainId, ChainSlug } from '@hop-protocol/sdk'
import { providers } from 'ethers'
import { getProvider } from 'src/utils'

export type Chainish = Chain | ChainSlug | ChainId

export type ChainProps = {
  name: string
  slug: string
  imageUrl: string
  rpcUrl: string
  networkId: number
  chainId: number
  nativeTokenSymbol: string
  isLayer1?: boolean
  isL1?: boolean
  nativeBridgeUrl?: string
  waitConfirmations?: number
  explorerUrl: string
}

class Chain {
  readonly name: string
  readonly slug: string
  readonly imageUrl: string
  readonly provider: providers.JsonRpcProvider
  readonly rpcUrl: string
  readonly chainId: number
  readonly nativeTokenSymbol: string
  readonly isL1: boolean
  readonly waitConfirmations?: number
  readonly explorerUrl: string

  readonly networkId: number // extraneous
  readonly isLayer1: boolean // extraneous
  readonly nativeBridgeUrl: string | undefined // extranous

  constructor(props: ChainProps) {
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

  eq(otherChain?: Chain) {
    return otherChain?.chainId === this.chainId
  }
}

export default Chain
