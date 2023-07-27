import memoize from 'fast-memoize'
import { Addresses } from '@hop-protocol/core/addresses'
import { ArbERC20 } from '@hop-protocol/core/contracts/static/ArbERC20'
import { ArbERC20__factory } from '@hop-protocol/core/contracts/factories/static/ArbERC20__factory'
import { ArbitrumGlobalInbox } from '@hop-protocol/core/contracts/static/ArbitrumGlobalInbox'
import { ArbitrumGlobalInbox__factory } from '@hop-protocol/core/contracts/factories/static/ArbitrumGlobalInbox__factory'
import { BigNumber, BigNumberish, Signer, constants, providers } from 'ethers'
import { Chain, Token as TokenModel } from './models'
import { ChainSlug, Errors, MinGoerliGasLimit, MinPolygonGasLimit, MinPolygonGasPrice, NetworkSlug } from './constants'
import { L1_OptimismTokenBridge } from '@hop-protocol/core/contracts/static/L1_OptimismTokenBridge'
import { L1_OptimismTokenBridge__factory } from '@hop-protocol/core/contracts/factories/static/L1_OptimismTokenBridge__factory'
import { L1_PolygonPosRootChainManager } from '@hop-protocol/core/contracts/static/L1_PolygonPosRootChainManager'
import { L1_PolygonPosRootChainManager__factory } from '@hop-protocol/core/contracts/factories/static/L1_PolygonPosRootChainManager__factory'
import { L1_xDaiForeignOmniBridge } from '@hop-protocol/core/contracts/static/L1_xDaiForeignOmniBridge'
import { L1_xDaiForeignOmniBridge__factory } from '@hop-protocol/core/contracts/factories/static/L1_xDaiForeignOmniBridge__factory'
import { L2_OptimismTokenBridge } from '@hop-protocol/core/contracts/static/L2_OptimismTokenBridge'
import { L2_OptimismTokenBridge__factory } from '@hop-protocol/core/contracts/factories/static/L2_OptimismTokenBridge__factory'
import { L2_PolygonChildERC20 } from '@hop-protocol/core/contracts/static/L2_PolygonChildERC20'
import { L2_PolygonChildERC20__factory } from '@hop-protocol/core/contracts/factories/static/L2_PolygonChildERC20__factory'
import { L2_xDaiToken } from '@hop-protocol/core/contracts/static/L2_xDaiToken'
import { L2_xDaiToken__factory } from '@hop-protocol/core/contracts/factories/static/L2_xDaiToken__factory'
import { RelayerFee } from './relayerFee'
import { TChain, TProvider, TToken } from './types'
import { config, metadata } from './config'
import { fetchJsonOrThrow } from './utils/fetchJsonOrThrow'
import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import { getProviderFromUrl } from './utils/getProviderFromUrl'
import { getUrlFromProvider } from './utils/getUrlFromProvider'
import { parseEther, serializeTransaction } from 'ethers/lib/utils'
import { promiseTimeout } from './utils/promiseTimeout'

export type L1Factory = L1_PolygonPosRootChainManager__factory | L1_xDaiForeignOmniBridge__factory | ArbitrumGlobalInbox__factory | L1_OptimismTokenBridge__factory
export type L1Contract = L1_PolygonPosRootChainManager | L1_xDaiForeignOmniBridge | ArbitrumGlobalInbox | L1_OptimismTokenBridge

export type L2Factory = L2_PolygonChildERC20__factory | L2_xDaiToken__factory | ArbERC20__factory | L2_OptimismTokenBridge__factory
export type L2Contract = L2_PolygonChildERC20 | L2_xDaiToken | ArbERC20 | L2_OptimismTokenBridge

type Factory = L1Factory | L2Factory

export type ChainProviders = { [slug in ChainSlug | string]: providers.Provider }

const s3FileCache : Record<string, any> = {}
let s3FileCacheTimestamp: number = 0
const cacheExpireMs = 1 * 60 * 1000

// cache provider
const getProvider = memoize((network: string, chain: string) => {
  if (!config.chains[network]?.[chain]) {
    throw new Error(`config for chain not found: ${network} ${chain}`)
  }
  const rpcUrl = config.chains[network][chain].rpcUrl
  if (!rpcUrl) {
    if (network === NetworkSlug.Staging) {
      network = NetworkSlug.Mainnet
    }
    return providers.getDefaultProvider(network)
  }

  const fallbackRpcUrls = config.chains[network][chain].fallbackRpcUrls ?? []
  const rpcUrls = [rpcUrl, ...fallbackRpcUrls]

  const provider = getProviderFromUrl(rpcUrls)
  return provider
})

const getContractMemo = memoize(
  (
    factory,
    address: string,
    cacheKey: string
  ): ((provider: TProvider) => L1Contract | L2Contract) => {
    let cached: L1Contract | L2Contract
    return (provider: TProvider) => {
      if (!cached) {
        cached = factory.connect(address, provider)
      }
      return cached
    }
  }
)

// cache contract
const getContract = async (
  factory: Factory,
  address: string,
  provider: TProvider
): Promise<any> => {
  const p = provider as any
  // memoize function doesn't handle dynamic provider object well, so
  // here we derived a cache key based on connected account address and rpc url.
  const signerAddress = p?.getAddress ? await p?.getAddress() : ''
  const chainId = p?.provider?._network?.chainId ?? ''
  await p?._networkPromise
  const fallbackProviderChainId = p?._network?.chainId ?? p?.providers?.[0]?._network?.chainId ?? ''
  const rpcUrl = getUrlFromProvider(p)
  const cacheKey = `${signerAddress}${chainId}${fallbackProviderChainId}${rpcUrl}`
  return getContractMemo(factory, address, cacheKey)(provider)
}

export type ConfigFileOptions = {
  baseConfigUrl?: string
  configFileFetchEnabled?: boolean
  customCoreConfigJsonUrl?: string
  customAvailableLiquidityJsonUrl?: string
}

export type BaseConstructorOptions = {
  network?: NetworkSlug | string
  signer?: TProvider,
  chainProviders?: ChainProviders
  blocklist?: Record<string, boolean> | string[] | null
} & ConfigFileOptions

const defaultBaseConfigUrl = 'https://assets.hop.exchange'

/**
 * Class with base methods.
 * @namespace Base
 */
export class Base {
  /** Network name */
  public network: NetworkSlug | string

  /** Ethers signer or provider */
  public signer: TProvider

  public chainProviders: ChainProviders = {}

  addresses : Record<string, any>
  chains: Record<string, any>
  bonders :Record<string, any>
  fees : { [token: string]: Record<string, number>}
  gasPriceMultiplier: number = 0
  destinationFeeGasPriceMultiplier : number = 1
  relayerFeeEnabled: Record<string, boolean>

  baseExplorerUrl: string = 'https://explorer.hop.exchange'
  baseConfigUrl: string = defaultBaseConfigUrl
  configFileFetchEnabled : boolean = true

  customCoreConfigJsonUrl: string = ''
  customAvailableLiquidityJsonUrl: string = ''
  blocklist: Record<string, boolean> | null = null

  /**
   * @desc Instantiates Base class.
   * Returns a new Base class instance.
   * @param networkOrOptionsObject - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @returns New Base class instance.
   */
  constructor (
    networkOrOptionsObject: NetworkSlug | string | BaseConstructorOptions,
    signer: TProvider,
    chainProviders?: ChainProviders
  ) {
    let network: any
    if (networkOrOptionsObject instanceof Object) {
      const options = networkOrOptionsObject as BaseConstructorOptions
      if (signer || chainProviders) {
        throw new Error('expected only single options parameter')
      }
      network = options.network
      signer = options.signer
      chainProviders = options.chainProviders
      if (options.baseConfigUrl) {
        this.baseConfigUrl = options.baseConfigUrl
      }
      if (typeof options.configFileFetchEnabled === 'boolean') {
        this.configFileFetchEnabled = options.configFileFetchEnabled
      }
      if (options.customCoreConfigJsonUrl) {
        this.customCoreConfigJsonUrl = options.customCoreConfigJsonUrl
      }
      if (options.customAvailableLiquidityJsonUrl) {
        this.customAvailableLiquidityJsonUrl = options.customAvailableLiquidityJsonUrl
      }
      if (options.blocklist) {
        this.blocklist = {}
        if (options.blocklist instanceof Object) {
          this.blocklist = options.blocklist as Record<string, boolean>
        }
        if (Array.isArray(options.blocklist)) {
          for (const address of options.blocklist) {
            this.blocklist[address.toLowerCase()] = true
          }
        }
      }
    } else {
      network = networkOrOptionsObject as string
    }

    if (!network) {
      throw new Error(`network is required. Options are: ${this.supportedNetworks.join(',')}`)
    }
    if (!this.isValidNetwork(network)) {
      throw new Error(
        `network "${network}" is unsupported. Supported networks are: ${this.supportedNetworks.join(
          ','
        )}`
      )
    }
    this.network = network
    if (signer) {
      this.signer = signer
    }
    if (chainProviders) {
      this.chainProviders = chainProviders
    }

    this.chains = config.chains[network]
    this.addresses = config.addresses[network]
    this.bonders = config.bonders[network]
    this.fees = config.bonderFeeBps[network]
    this.destinationFeeGasPriceMultiplier = config.destinationFeeGasPriceMultiplier[network]
    this.relayerFeeEnabled = config.relayerFeeEnabled[network]
    if (this.network === NetworkSlug.Goerli) {
      this.baseExplorerUrl = 'https://goerli.explorer.hop.exchange'
    }
  }

  async fetchConfigFromS3 (): Promise<any> {
    if (!this.configFileFetchEnabled) {
      return
    }
    if (this.network === 'goerli') {
      return
    }
    try {
      let cached = s3FileCache[this.network]
      const isExpired = s3FileCacheTimestamp + cacheExpireMs < Date.now()
      if (cached && isExpired) {
        cached = null
      }

      const data = cached || await this.fetchCoreConfigDataWithIpfsFallback()
      if (data) {
        if (data.bonders) {
          this.bonders = data.bonders
        }
        if (data.bonderFeeBps) {
          this.fees = data.bonderFeeBps
        }
        if (data.destinationFeeGasPriceMultiplier) {
          this.destinationFeeGasPriceMultiplier = data.destinationFeeGasPriceMultiplier
        }
        if (data.relayerFeeEnabled) {
          this.relayerFeeEnabled = data.relayerFeeEnabled
        }

        if (!cached) {
          s3FileCache[this.network] = data
          s3FileCacheTimestamp = Date.now()
        }
      }
      return data
    } catch (err: any) {
      console.error('hop sdk fetchConfigFromS3 error:', err)
      throw new Error(`hop sdk fetchConfigFromS3 error: ${err.message}`)
    }
  }

  async sendTransaction (transactionRequest: providers.TransactionRequest, chain: TChain): Promise<any> {
    const chainId = this.toChainModel(chain).chainId
    await this.checkBlocklist()
    return this.signer.sendTransaction({ ...transactionRequest, chainId } as any)
  }

  async checkBlocklist () {
    if (this.signer && this.blocklist) {
      const address = (await (this.signer as Signer).getAddress()).toLowerCase()
      for (const blockAddress in this.blocklist) {
        if (address === blockAddress) {
          throw new Error('address is blocked')
        }
      }
    }
  }

  setConfigAddresses (addresses: Addresses): void {
    if (addresses.bridges) {
      this.addresses = addresses.bridges
    }
    if (addresses.bonders) {
      this.bonders = addresses.bonders
    }
  }

  setChainProvider (chain: TChain, provider: providers.Provider): void {
    chain = this.toChainModel(chain)
    if (!this.isValidChain(chain.slug)) {
      throw new Error(
        `unsupported chain "${chain.slug}" for network ${this.network}`
      )
    }
    this.chainProviders[chain.slug] = provider
  }

  setChainProviders (chainProviders: ChainProviders): void {
    for (const chainSlug in chainProviders) {
      const chain = this.toChainModel(chainSlug)
      if (!this.isValidChain(chain.slug)) {
        throw new Error(
          `unsupported chain "${chain.slug}" for network ${this.network}`
        )
      }
      if (chainProviders[chainSlug]) {
        this.chainProviders[chain.slug] = chainProviders[chainSlug]
      }
    }
  }

  setChainProviderUrls (chainProviders: Record<string, string>): void {
    for (const chainSlug in chainProviders) {
      const chain = this.toChainModel(chainSlug)
      if (!this.isValidChain(chain.slug)) {
        throw new Error(
          `unsupported chain "${chain.slug}" for network ${this.network}`
        )
      }
      if (chainProviders[chainSlug]) {
        this.chainProviders[chain.slug] = getProviderFromUrl(chainProviders[chainSlug])
      }
    }
  }

  get supportedNetworks (): string[] {
    return Object.keys(this.chains || config.chains)
  }

  isValidNetwork (network: string): boolean {
    return this.supportedNetworks.includes(network)
  }

  // all chains supported.
  // this may be overriden by child class to make it asset specific.
  get supportedChains (): string[] {
    return this.configChains
  }

  // all chains available in config
  get configChains (): string[] {
    return Object.keys(this.chains)
  }

  // returns supported chain slugs
  getSupportedChains (): string[] {
    return this.supportedChains
  }

  geConfigChains (): string[] {
    return this.configChains
  }

  isValidChain (chain: string): boolean {
    return this.configChains.includes(chain)
  }

  /**
   * @desc Returns a Chain model instance with connected provider.
   * @param chain - Chain name or model.
   * @returns Chain model with connected provider.
   */
  public toChainModel (chain: TChain): Chain {
    if (typeof chain === 'string') {
      chain = Chain.fromSlug(chain)
    }
    if (!chain) {
      throw new Error(`invalid chain "${chain}"`)
    }
    if (chain.slug === 'xdai') {
      console.warn(Errors.xDaiRebrand)
      chain = Chain.fromSlug('gnosis')
    }
    if (!this.isValidChain(chain.slug)) {
      throw new Error(
        `chain "${
          chain.slug
        }" is unsupported. Supported chains are: ${this.configChains.join(
          ','
        )}`
      )
    }
    chain.provider = this.getChainProvider(chain)
    chain.chainId = this.getChainId(chain)
    return chain
  }

  /**
   * @desc Returns a Token instance.
   * @param token - Token name or model.
   * @returns Token model.
   */
  public toTokenModel (token: TToken): TokenModel {
    if (typeof token === 'string') {
      const canonicalSymbol = TokenModel.getCanonicalSymbol(token)
      const { name, decimals } = metadata.tokens[this.network][canonicalSymbol]
      return new TokenModel(0, '', decimals, token, name)
    }

    return token
  }

  /**
   * @desc Calculates current gas price plus increased percentage amount.
   * @param signer - Ether's Signer
   * @param percent - Percentage to bump by.
   * @returns Bumped as price as BigNumber
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
   *console.log(bumpedGasPrice.toNumber())
   *```
   */
  public async getBumpedGasPrice (signer: TProvider, percent: number): Promise<BigNumber> {
    const gasPrice = await signer.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  /**
   * @desc Returns Chain ID for specified Chain model.
   * @param chain - Chain model.
   * @returns - Chain ID.
   */
  public getChainId (chain: Chain): number {
    const { chainId } = this.chains[chain.slug]
    return Number(chainId)
  }

  /**
   * @desc Returns Ethers provider for specified Chain model.
   * @param chain - Chain model.
   * @returns Ethers provider.
   */
  public getChainProvider (chain: Chain | string): any {
    let chainSlug: string
    if (chain instanceof Chain && chain?.slug) {
      chainSlug = chain?.slug
    } else if (typeof chain === 'string') {
      chainSlug = chain
    } else {
      throw new Error(`unknown chain "${chain}"`)
    }

    if (chainSlug === 'xdai') {
      console.warn(Errors.xDaiRebrand)
      chainSlug = ChainSlug.Gnosis
    }

    if (this.chainProviders[chainSlug]) {
      return this.chainProviders[chainSlug]
    }
    return getProvider(this.network, chainSlug)
  }

  public getChainProviders (): any {
    const obj : Record<string, providers.Provider> = {}
    for (const chainSlug of this.configChains) {
      const provider = this.getChainProvider(chainSlug)
      obj[chainSlug] = provider
    }

    return obj
  }

  public getChainProviderUrls (): any {
    const obj : Record<string, string> = {}
    for (const chainSlug of this.configChains) {
      const provider = this.getChainProvider(chainSlug)
      obj[chainSlug] = (provider as any)?.connection?.url
    }

    return obj
  }

  /**
   * @desc Returns the connected signer address.
   * @returns Ethers signer address.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const address = await hop.getSignerAddress()
   *console.log(address)
   *```
   */
  public async getSignerAddress (): Promise<string> {
    if (Signer.isSigner(this.signer)) {
      return this.signer.getAddress()
    }
  }

  /**
   * @desc Returns the connected signer if it's connected to the specified
   * chain id, otherwise it returns a regular provider for the specified chain.
   * @param chain - Chain name or model
   * @param signer - Ethers signer or provider
   * @returns Ethers signer or provider
   */
  public async getSignerOrProvider (
    chain: TChain,
    signer: TProvider = this.signer as Signer
  ): Promise<Signer | providers.Provider> {
    // console.log('getSignerOrProvider')
    chain = this.toChainModel(chain)
    if (!signer) {
      return chain.provider
    }
    if (Signer.isSigner(signer)) {
      if (signer.provider) {
        const connectedChainId = await signer.getChainId()
        // console.log('connectedChainId: ', connectedChainId)
        // console.log('chain.chainId: ', chain.chainId)
        if (connectedChainId !== chain.chainId) {
          if (!signer.provider) {
            // console.log('connect provider')
            return (signer as Signer).connect(chain.provider)
          }
          // console.log('return chain.provider')
          return chain.provider
        }
        return signer
      } else {
        return chain.provider
      }
    } else {
      // console.log('isSigner')
      const { chainId } = await signer.getNetwork()
      if (chainId !== chain.chainId) {
        return chain.provider
      }
      return signer
    }
  }

  public getConfigAddresses (token: TToken, chain: TChain): any {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    return this.addresses?.[token.canonicalSymbol]?.[chain.slug]
  }

  public getL1BridgeAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l1Bridge
  }

  public getL2BridgeAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2Bridge
  }

  public getL1CanonicalBridgeAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l1CanonicalBridge
  }

  public getL2CanonicalBridgeAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2CanonicalBridge
  }

  public getL1CanonicalTokenAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l1CanonicalToken
  }

  public getL2CanonicalTokenAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2CanonicalToken
  }

  public getL2HopBridgeTokenAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2HopBridgeToken
  }

  public getL2AmmWrapperAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2AmmWrapper
  }

  public getL2SaddleSwapAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2SaddleSwap
  }

  public getL2SaddleLpTokenAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2SaddleLpToken
  }

  // Arbitrum ARB Chain address
  public getArbChainAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.arbChain
  }

  // Gnosis L1 Home AMB bridge address
  public getL1AmbBridgeAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l1Amb
  }

  // Gnosis L2 AMB bridge address
  public getL2AmbBridgeAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l2Amb
  }

  // Polygon Root Chain Manager address
  public getL1PosRootChainManagerAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l1PosRootChainManager
  }

  // Polygon ERC20 Predicate address
  public getL1PosErc20PredicateAddress (token: TToken, chain: TChain): string {
    return this.getConfigAddresses(token, chain)?.l1PosPredicate
  }

  // Transaction overrides options
  public async txOverrides (sourceChain: Chain, destinationChain?: Chain): Promise<any> {
    const txOptions: any = {}
    if (this.gasPriceMultiplier > 0) {
      txOptions.gasPrice = await this.getBumpedGasPrice(
        this.signer,
        this.gasPriceMultiplier
      )
    }

    // Not all Polygon nodes follow recommended 30 Gwei gasPrice
    // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
    if (sourceChain.equals(Chain.Polygon)) {
      if (txOptions.gasPrice?.lt(MinPolygonGasPrice)) {
        txOptions.gasPrice = BigNumber.from(MinPolygonGasPrice)
      }
      txOptions.gasLimit = MinPolygonGasLimit
    }

    if (sourceChain.equals(Chain.Linea)) {
      const gasPriceMultiplier = 2
      txOptions.gasPrice = await this.getBumpedGasPrice(
        this.signer,
        gasPriceMultiplier
      )
    }

    // Post-bedrock L1 to L2 message transactions don't estimate correctly
    // TODO: Remove this when estimation is fixed
    if (sourceChain.equals(Chain.Ethereum) && (destinationChain?.equals(Chain.Optimism) || destinationChain?.equals(Chain.Base))) {
      txOptions.gasLimit = 250000
    }

    if (this.network === NetworkSlug.Goerli) {
      txOptions.gasLimit = MinGoerliGasLimit
    }

    return txOptions
  }

  protected async _getBonderAddress (token: TToken, sourceChain: TChain, destinationChain: TChain): Promise<string> {
    await this.fetchConfigFromS3()
    token = this.toTokenModel(token)
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const bonder = this.bonders?.[token.canonicalSymbol]?.[sourceChain.slug]?.[destinationChain.slug]
    if (!bonder) {
      console.warn(`bonder address not found for route ${token.symbol}.${sourceChain.slug}->${destinationChain.slug}`)
    }

    return bonder
  }

  protected async _getMessengerWrapperAddress (token: TToken, destinationChain: TChain): Promise<string> {
    await this.fetchConfigFromS3()
    token = this.toTokenModel(token)
    destinationChain = this.toChainModel(destinationChain)

    const messengerWrapper = this.addresses?.[token.canonicalSymbol]?.[destinationChain.slug]?.l1MessengerWrapper
    if (!messengerWrapper) {
      console.warn(`messengerWrapper address not found for route ${token.symbol}. destinationChain ${destinationChain.slug}`)
    }

    return messengerWrapper
  }

  public async getFeeBps (token: TToken, destinationChain: TChain): Promise<number> {
    await this.fetchConfigFromS3()
    token = this.toTokenModel(token)
    destinationChain = this.toChainModel(destinationChain)
    if (!token) {
      throw new Error('token is required')
    }
    if (!destinationChain) {
      throw new Error('destinationChain is required')
    }
    const fees = this.fees?.[token?.canonicalSymbol]
    if (!fees) {
      throw new Error('fee data not found')
    }

    const feeBps = fees[destinationChain.slug] || 0
    return feeBps
  }

  setGasPriceMultiplier (gasPriceMultiplier: number): number {
    return (this.gasPriceMultiplier = gasPriceMultiplier)
  }

  getDestinationFeeGasPriceMultiplier (): number {
    return this.destinationFeeGasPriceMultiplier
  }

  public async getRelayerFee (destinationChain: TChain, tokenSymbol: string): Promise<BigNumber> {
    await this.fetchConfigFromS3()
    destinationChain = this.toChainModel(destinationChain)
    const isFeeEnabled = this.relayerFeeEnabled[destinationChain.slug]
    if (!isFeeEnabled) {
      return BigNumber.from(0)
    }

    const relayerFee = new RelayerFee()
    return relayerFee.getRelayCost(this.network, destinationChain.slug, tokenSymbol)
  }

  async setBaseConfigUrl (url: string): Promise<void> {
    if (!url) {
      throw new Error('url is required')
    }
    this.baseConfigUrl = url?.replace(/\/$/, '')

    // attempt to fetch or throw
    await this.fetchCoreConfigData()
    await this.fetchBonderAvailableLiquidityData()
  }

  setConfigFileFetchEnabled (enabled: boolean): void {
    this.configFileFetchEnabled = enabled
  }

  async fetchCoreConfigData (): Promise<any> {
    const cacheBust = Date.now()
    const url = `${this.coreConfigJsonUrl}?cb=${cacheBust}`
    try {
      return await fetchJsonOrThrow(url)
    } catch (err: any) {
      throw new Error(`fetchCoreConfigData error: ${err.message}, url: ${url}`)
    }
  }

  async fetchCoreConfigDataWithIpfsFallback (): Promise<any> {
    try {
      return await this.fetchCoreConfigData()
    } catch (err: any) {
      if (this.baseConfigUrl === defaultBaseConfigUrl) {
        return await this.fetchIpfsCoreConfigData()
      } else {
        throw err
      }
    }
  }

  async getS3ConfigData (): Promise<any> {
    console.warn('The method "getS3ConfigData" method is going to be deprecated. Please use method "fetchCoreConfigData" instead.')
    return this.fetchCoreConfigData()
  }

  async setCoreConfigJsonUrl (url: string): Promise<any> {
    this.customCoreConfigJsonUrl = url

    // attempt to fetch or throw
    await this.fetchCoreConfigData()
  }

  get coreConfigJsonUrl (): string {
    if (this.customCoreConfigJsonUrl) {
      return this.customCoreConfigJsonUrl
    }
    const url = `${this.baseConfigUrl}/${this.network}/v1-core-config.json`
    return url
  }

  async fetchBonderAvailableLiquidityData (): Promise<any> {
    const cacheBust = Date.now()
    const url = `${this.availableLiqudityJsonUrl}?cb=${cacheBust}`
    try {
      const json = await fetchJsonOrThrow(url)
      const { timestamp, data } = json
      const tenMinutes = 10 * 60 * 1000
      const isOutdated = Date.now() - timestamp > tenMinutes
      if (isOutdated) {
        return
      }

      return data
    } catch (err: any) {
      throw new Error(`fetchBonderAvailableLiquidityData error: ${err.message}, url: ${url}`)
    }
  }

  public getL1BridgeWrapperAddress (token: TToken, sourceChain: TChain, destinationChain: TChain): string {
    if (!(token && sourceChain && destinationChain)) {
      return
    }

    token = this.toTokenModel(token)
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    if (this.network === NetworkSlug.Goerli) {
      if (sourceChain.isL1) {
        if (destinationChain.equals(Chain.Linea)) {
          let hopL1BridgeWrapperAddress
          if (token.symbol === TokenModel.ETH) {
            hopL1BridgeWrapperAddress = '0xd9e10C6b1bd26dE4E2749ce8aFe8Dd64294BcBF5'
          } else if (token.symbol === TokenModel.HOP) {
            hopL1BridgeWrapperAddress = '0x9051Dc48d27dAb53DbAB9E844f8E48c469603938'
          } else if (token.symbol === TokenModel.USDC) {
            hopL1BridgeWrapperAddress = '0x889CD829cE211c92b31fDFE1d75299482839ea2b'
          } else if (token.symbol === TokenModel.USDT) {
            hopL1BridgeWrapperAddress = '0x53B94FAf104A484ff4E7c66bFe311fd48ce3D887'
          } else if (token.symbol === TokenModel.DAI) {
            hopL1BridgeWrapperAddress = '0xAa1603822b43e592e33b58d34B4423E1bcD8b4dC'
          } else if (token.symbol === TokenModel.UNI) {
            hopL1BridgeWrapperAddress = '0x9D3A7fB18CA7F1237F977Dc5572883f8b24F5638'
          }
          return hopL1BridgeWrapperAddress
        }
      }
    }
  }

  async fetchBonderAvailableLiquidityDataWithIpfsFallback (): Promise<any> {
    try {
      return await this.fetchBonderAvailableLiquidityData()
    } catch (err: any) {
      if (this.baseConfigUrl === defaultBaseConfigUrl) {
        return await this.fetchIpfsBonderAvailableLiquidityData()
      } else {
        throw err
      }
    }
  }

  async setAvailableLiqudityJsonUrl (url: string): Promise<void> {
    this.customAvailableLiquidityJsonUrl = url

    // attempt to fetch or throw
    await this.fetchBonderAvailableLiquidityData()
  }

  get availableLiqudityJsonUrl (): string {
    if (this.customAvailableLiquidityJsonUrl) {
      return this.customAvailableLiquidityJsonUrl
    }
    const url = `${this.baseConfigUrl}/${this.network}/v1-available-liquidity.json`
    return url
  }

  public getContract = getContract

  // get supported list of token symbols
  getSupportedTokens (): string[] {
    const supported = new Set()

    for (const token in this.addresses) {
      supported.add(token)
    }

    return Array.from(supported) as string[]
  }

  getSupportedAssets (): any {
    const supported : any = {}

    for (const token in this.addresses) {
      for (const chain in this.addresses[token]) {
        if (!supported[chain]) {
          supported[chain] = {}
        }
        supported[chain][token] = true
      }
    }
    return supported
  }

  getSupportedAssetsForChain (chain: TChain) : any {
    chain = this.toChainModel(chain)
    const supported = this.getSupportedAssets()
    return supported[chain.slug]
  }

  async estimateOptimismL1FeeFromData (
    gasLimit : BigNumberish,
    data: string = '0x',
    to: string = constants.AddressZero,
    destChain: Chain | string = Chain.Optimism
  ) : Promise<any> {
    gasLimit = BigNumber.from(gasLimit.toString())
    const chain = this.toChainModel(destChain)
    const gasPrice = await chain.provider.getGasPrice()
    const ovmGasPriceOracle = getContractFactory('OVM_GasPriceOracle')
      .attach(predeploys.OVM_GasPriceOracle).connect(chain.provider)
    const serializedTx = serializeTransaction({
      value: parseEther('0'),
      gasPrice,
      gasLimit,
      to,
      data
    })
    const l1FeeInWei = await ovmGasPriceOracle.getL1Fee(serializedTx)
    return l1FeeInWei
  }

  getWaitConfirmations (chain: TChain):number {
    chain = this.toChainModel(chain)
    if (!chain) {
      throw new Error(`chain "${chain}" not found`)
    }
    const waitConfirmations = config.chains[this.network]?.[chain.slug]?.waitConfirmations
    if (waitConfirmations === undefined) {
      throw new Error(`waitConfirmations for chain "${chain}" not found`)
    }

    return waitConfirmations
  }

  getExplorerUrl (): string {
    return this.baseExplorerUrl
  }

  getExplorerUrlForAccount (accountAddress: string): string {
    return `${this.baseExplorerUrl}/?account=${accountAddress}`
  }

  getExplorerUrlForTransferId (transferId: string): string {
    return `${this.baseExplorerUrl}/?transferId=${transferId}`
  }

  getExplorerUrlForTransactionHash (transactionHash: string): string {
    return `${this.baseExplorerUrl}/?transferId=${transactionHash}`
  }

  async getTransferStatus (transferIdOrTxHash: String):Promise<any> {
    const baseApiUrl = this.network === 'goerli' ? 'https://goerli-explorer-api.hop.exchange' : 'https://explorer-api.hop.exchange'
    const url = `${baseApiUrl}/v1/transfers?transferId=${transferIdOrTxHash}`
    const json = await fetchJsonOrThrow(url)
    return json.data?.[0] ?? null
  }

  getProviderRpcUrl (provider: any): string {
    return getUrlFromProvider(provider)
  }

  async resolveDnslink (dnslinkDomain: string): Promise<string|null> {
    let dns : any

    try {
      dns = require('dns')
    } catch (err: any) {
      return null
    }

    try {
      const timeoutMs = 5 * 10000
      const ipfsHash = await promiseTimeout(new Promise((resolve, reject) => {
        dns.resolveTxt(dnslinkDomain, (err: any, records: any) => {
          if (err) {
            reject(err)
            return
          }
          resolve(records?.[0]?.[0]?.split('ipfs/')?.[1])
        })
      }), timeoutMs)
      if (!ipfsHash) {
        return null
      }
      return ipfsHash as string
    } catch (err: any) {
      throw new Error(`resolveDnslink error: ${err.message}`)
    }
  }

  getIpfsBaseConfigUrl (ipfsHash: string): string {
    const url = `https://hop.mypinata.cloud/ipfs/${ipfsHash}/sdk/${this.network}`
    return url
  }

  async fetchIpfsCoreConfigData (): Promise<any> {
    const dnslinkDomain = '_dnslink.ipfs-assets.hop.exchange'
    const ipfsHash = await this.resolveDnslink(dnslinkDomain)
    if (!ipfsHash) {
      return null
    }
    const url = `${this.getIpfsBaseConfigUrl(ipfsHash)}/v1-core-config.json`
    const json = await fetchJsonOrThrow(url)
    return json
  }

  async fetchIpfsBonderAvailableLiquidityData (): Promise<any> {
    const dnslinkDomain = '_dnslink.ipfs-assets.hop.exchange'
    const ipfsHash = await this.resolveDnslink(dnslinkDomain)
    if (!ipfsHash) {
      return null
    }
    const url = `${this.getIpfsBaseConfigUrl(ipfsHash)}/v1-available-liquidity.json`
    const json = await fetchJsonOrThrow(url)
    const { timestamp, data } = json
    const tenMinutes = 10 * 60 * 1000
    const isOutdated = Date.now() - timestamp > tenMinutes
    if (isOutdated) {
      return
    }
    return data
  }
}

export default Base
