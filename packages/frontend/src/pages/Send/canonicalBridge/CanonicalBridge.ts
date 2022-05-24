import { Signer, BigNumber, BigNumberish } from 'ethers'
import {
  L1OptimismDaiTokenBridge,
  L1OptimismGateway,
  L1OptimismTokenBridge,
  L1PolygonPlasmaBridgeDepositManager,
  L1PolygonPosRootChainManager,
  L1XDaiForeignOmniBridge,
  L1XDaiPoaBridge,
  L1XDaiWETHOmnibridgeRouter,
} from '@hop-protocol/core/contracts'
import { mainnet as metadata } from '@hop-protocol/core/metadata'
import {
  ChainSlug,
  CanonicalToken,
  Chain,
  TChain,
  TToken,
  Token as TokenClass,
  TProvider
} from '@hop-protocol/sdk'
import { Erc20Bridger, EthBridger } from '@arbitrum/sdk'
import { ConfigBase } from './ConfigBase'

export type L1CanonicalBridge =
  | EthBridger
  | Erc20Bridger
  | L1OptimismGateway
  | L1OptimismTokenBridge
  | L1OptimismDaiTokenBridge
  | L1PolygonPlasmaBridgeDepositManager
  | L1PolygonPosRootChainManager
  | L1XDaiForeignOmniBridge
  | L1XDaiPoaBridge
  | L1XDaiWETHOmnibridgeRouter

export class CanonicalBridge extends ConfigBase {
  public chain: Chain
  public tokenSymbol: CanonicalToken
  address: string
  l2TokenAddress: string
  l1TokenAddress: string

  constructor(network: string, token: TToken, chain: TChain, signer: TProvider) {
    if (!(network && token && chain)) {
      throw new Error('CanonicalBridge missing constructor args')
    }
    super(network, signer)
    this.getSignerOrProvider(Chain.Ethereum, signer).then(s => {
      this.signer = s
    })
    this.chain = this.toChainModel(chain)
    this.tokenSymbol = this.toTokenModel(token).symbol as CanonicalToken
    this.address = this.getL1CanonicalBridgeAddress()
    this.l1TokenAddress = this.getL1CanonicalTokenAddress(this.tokenSymbol)
    this.l2TokenAddress = this.getL2CanonicalTokenAddress(this.tokenSymbol, this.chain)
  }

  static async from(network: string, token: TToken, chain: string, signer: TProvider) {
    if (chain === ChainSlug.Arbitrum) {
      const { ArbitrumCanonicalBridge } = await import('./ArbitrumCanonicalBridge')
      return new ArbitrumCanonicalBridge(network, token, chain, signer)
    }
    if (chain === ChainSlug.Gnosis) {
      const { GnosisCanonicalBridge } = await import('./GnosisCanonicalBridge')
      return new GnosisCanonicalBridge(network, token, chain, signer)
    }
    if (chain === ChainSlug.Optimism) {
      const { OptimismCanonicalBridge } = await import('./OptimismCanonicalBridge')
      return new OptimismCanonicalBridge(network, token, chain, signer)
    }
    if (chain === ChainSlug.Polygon) {
      const { PolygonCanonicalBridge } = await import('./PolygonCanonicalBridge')
      return new PolygonCanonicalBridge(network, token, chain, signer)
    }
    throw new Error('unsupported chain')
  }

  public connect(signer: Signer) {
    return new CanonicalBridge(this.network, this.tokenSymbol, this.chain, signer)
  }

  public async getL1CanonicalAllowance(): Promise<BigNumber> {
    const l1CanonicalToken = this.getL1Token()
    const spender = this.getL1CanonicalBridgeApproveAddress()
    if (!spender) {
      throw new Error(`token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`)
    }
    return l1CanonicalToken.allowance(spender)
  }

  // =================================================================
  // Getters
  // =================================================================

  public getL1CanonicalBridgeAddress(): string {
    return this.getNativeBridgeAddress(this.chain.slug, this.tokenSymbol)
  }

  public getL1CanonicalBridgeApproveAddress(): string {
    return this.getNativeBridgeApproveAddress(this.chain.slug, this.tokenSymbol)
  }

  public getL1CanonicalTokenAddress(tokenSymbol: CanonicalToken | string) {
    return this.getL1CanonicalTokenAddressBySymbol(tokenSymbol)
  }

  public getL2CanonicalTokenAddress(tokenSymbol: CanonicalToken | string, chain: TChain) {
    chain = this.toChainModel(chain)
    return this.getL2CanonicalTokenAddressBySlug(chain.slug, tokenSymbol)
  }

  // =================================================================
  // approve and deposit txs w/ estimations
  // =================================================================

  public async estimateApproveTx(amount: BigNumberish) {
    const l1CanonicalToken = this.getL1Token()
    const spender = this.getL1CanonicalBridgeApproveAddress()
    const populatedTx = await l1CanonicalToken.populateApproveTx(spender, amount)
    return this.signer.estimateGas(populatedTx)
  }

  public async approve(amount: BigNumberish) {
    amount = amount.toString()
    const l1CanonicalToken = this.getL1Token()

    const spender = this.getL1CanonicalBridgeApproveAddress()
    if (!spender) {
      throw new Error(`token "${this.tokenSymbol}" on chain "${this.chain.slug}" is unsupported`)
    }
    return await l1CanonicalToken.approve(spender, amount)
  }

  public async estimateDepositTx(amount: BigNumberish, options?: any) {
    const populatedTx = await this.populateDepositTx(amount, options)
    return await this.signer.estimateGas(populatedTx)
  }

  public async deposit(amount: BigNumberish, options?: any) {
    const populatedTx = await this.populateDepositTx(amount)

    // arbitrum sdk doesn't support returning only populated tx
    if (this.chain.slug === ChainSlug.Arbitrum) {
      return populatedTx
    }

    return this.signer.sendTransaction(populatedTx)
  }

  public async populateDepositTx(amount: BigNumberish, options?: any): Promise<any> {
    throw new Error('not implemented')
  }

  public async getDestTxHash(l1TxHash: string): Promise<string | null> {
    throw new Error('not implemented')
  }

  public async getNativeBridgeContract(
    address: string
  ): Promise<L1CanonicalBridge> {
    throw new Error('not implemented')
  }

  async getL1CanonicalBridge(): Promise<L1CanonicalBridge> {
    return this.getNativeBridgeContract(this.address)
  }

  public getL1Token() {
    const token = this.toCanonicalToken(this.tokenSymbol, this.network, Chain.Ethereum)
    return token.connect(this.signer)
  }

  public toCanonicalToken(token: TToken, network: string, chain: TChain) {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    const { name, symbol, decimals, image } = metadata?.tokens?.[token.canonicalSymbol]!
    let address : string
    if (chain.isL1) {
      address = this.getL1CanonicalTokenAddress(token.canonicalSymbol as CanonicalToken)
    } else {
      address = this.getL2CanonicalTokenAddress(token.canonicalSymbol, chain.slug)
    }

    return new TokenClass(network, chain, address, decimals, symbol, name, image)
  }
}
