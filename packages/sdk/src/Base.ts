import fetch from 'isomorphic-fetch'
import memoize from 'fast-memoize'
import { Addresses } from '@hop-protocol/core/addresses'
import { BigNumber, BigNumberish, Contract, Signer, constants, providers } from 'ethers'
import { Chain, Token as TokenModel } from './models'
import { Chain as ChainEnum, MinPolygonGasPrice } from './constants'
import { TChain, TProvider, TToken } from './types'
import { config, metadata } from './config'
import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import { parseEther, serializeTransaction } from 'ethers/lib/utils'

export type ChainProviders = { [chain: string]: providers.Provider }

// cache provider
const getProvider = memoize((network: string, chain: string) => {
  const rpcUrl = config.chains[network][chain].rpcUrl
  if (!rpcUrl) {
    if (network === 'staging') {
      network = 'mainnet'
    }
    return providers.getDefaultProvider(network)
  }
  return new providers.StaticJsonRpcProvider({
    url: rpcUrl,
    timeout: 60 * 1000
  })
})

const getContractMemo = memoize(
  (
    address: string,
    abi: any[],
    cacheKey: string
  ): ((provider: TProvider) => Contract) => {
    let cached: any
    return (provider: TProvider) => {
      if (!cached) {
        cached = new Contract(address, abi, provider)
      }
      return cached
    }
  }
)

// cache contract
const getContract = async (
  address: string,
  abi: any[],
  provider: TProvider
): Promise<Contract> => {
  const p = provider as any
  // memoize function doesn't handle dynamic provider object well, so
  // here we derived a cache key based on connected account address and rpc url.
  const signerAddress = p?.getAddress ? await p?.getAddress() : ''
  const chainId = p?.provider?._network?.chainId ?? ''
  await p?._networkPromise
  const fallbackProviderChainId = p?._network?.chainId ?? ''
  const rpcUrl = p?.connection?.url ?? ''
  const cacheKey = `${signerAddress}${chainId}${fallbackProviderChainId}${rpcUrl}`
  return getContractMemo(address, abi, cacheKey)(provider)
}

/**
 * Class with base methods.
 * @namespace Base
 */
class Base {
  /** Network name */
  public network: string

  /** Ethers signer or provider */
  public signer: TProvider

  public chainProviders: ChainProviders = {}

  private addresses : Record<string, any>
  private chains: Record<string, any>
  private bonders :Record<string, any>
  fees : { [token: string]: Record<string, number>}
  gasPriceMultiplier: number = 1
  destinationFeeGasPriceMultiplier : number = 1

  /**
   * @desc Instantiates Base class.
   * Returns a new Base class instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @returns {Object} New Base class instance.
   */
  constructor (
    network: string,
    signer: TProvider,
    chainProviders?: ChainProviders
  ) {
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

    this.init()
  }

  async init () {
    try {
      const data = await this.getS3ConfigData()
      if (data.bonders) {
        this.bonders = data.bonders
      }
      if (data.bonderFeeBps) {
        this.fees = data.bonderFeeBps
      }
      if (data.destinationFeeGasPriceMultiplier) {
        this.destinationFeeGasPriceMultiplier = data.destinationFeeGasPriceMultiplier
      }
    } catch (err) {
      console.error(err)
    }
  }

  setConfigAddresses (addresses: Addresses) {
    if (addresses.bridges) {
      this.addresses = addresses.bridges
    }
    if (addresses.bonders) {
      this.bonders = addresses.bonders
    }
  }

  setChainProvider (chain: TChain, provider: providers.Provider) {
    chain = this.toChainModel(chain)
    if (!this.isValidChain(chain.slug)) {
      throw new Error(
        `unsupported chain "${chain.slug}" for network ${this.network}`
      )
    }
    this.chainProviders[chain.slug] = provider
  }

  setChainProviders (chainProviders: ChainProviders) {
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

  setChainProviderUrls (chainProviders: Record<string, string>) {
    for (const chainSlug in chainProviders) {
      const chain = this.toChainModel(chainSlug)
      if (!this.isValidChain(chain.slug)) {
        throw new Error(
          `unsupported chain "${chain.slug}" for network ${this.network}`
        )
      }
      if (chainProviders[chainSlug]) {
        this.chainProviders[chain.slug] = new providers.StaticJsonRpcProvider(chainProviders[chainSlug])
      }
    }
  }

  get supportedNetworks () {
    return Object.keys(this.chains || config.chains)
  }

  isValidNetwork (network: string) {
    return this.supportedNetworks.includes(network)
  }

  get supportedChains () {
    return Object.keys(this.chains)
  }

  isValidChain (chain: string) {
    return this.supportedChains.includes(chain)
  }

  /**
   * @desc Returns a Chain model instance with connected provider.
   * @param {Object} - Chain name or model.
   * @returns {Object} - Chain model with connected provider.
   */
  public toChainModel (chain: TChain) {
    if (typeof chain === 'string') {
      chain = Chain.fromSlug(chain)
    }
    if (!this.isValidChain(chain.slug)) {
      throw new Error(
        `chain "${
          chain.slug
        }" is unsupported. Supported chains are: ${this.supportedChains.join(
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
   * @param {Object} - Token name or model.
   * @returns {Object} - Token model.
   */
  public toTokenModel (token: TToken) {
    if (typeof token === 'string') {
      const canonicalSymbol = TokenModel.getCanonicalSymbol(token)
      const { name, decimals } = metadata.tokens[this.network][canonicalSymbol]
      return new TokenModel(0, '', decimals, token, name)
    }

    return token
  }

  /**
   * @desc Calculates current gas price plus increased percentage amount.
   * @param {Object} - Ether's Signer
   * @param {number} - Percentage to bump by.
   * @returns {BigNumber} Bumped as price as BigNumber
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
   *console.log(bumpedGasPrice.toNumber())
   *```
   */
  public async getBumpedGasPrice (signer: TProvider, percent: number) {
    const gasPrice = await signer.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  /**
   * @desc Returns Chain ID for specified Chain model.
   * @param {Object} - Chain model.
   * @returns {Number} - Chain ID.
   */
  public getChainId (chain: Chain) {
    const { chainId } = this.chains[chain.slug]
    return Number(chainId)
  }

  /**
   * @desc Returns Ethers provider for specified Chain model.
   * @param {Object} - Chain model.
   * @returns {Object} - Ethers provider.
   */
  public getChainProvider = (chain: Chain | string) => {
    let chainSlug: string
    if (chain instanceof Chain && chain?.slug) {
      chainSlug = chain?.slug
    } else if (typeof chain === 'string') {
      chainSlug = chain
    } else {
      throw new Error(`unknown chain "${chain}"`)
    }
    if (this.chainProviders[chainSlug]) {
      return this.chainProviders[chainSlug]
    }
    return getProvider(this.network, chainSlug)
  }

  public getChainProviders = () => {
    const obj : Record<string, providers.Provider> = {}
    for (const chainSlug of this.supportedChains) {
      const provider = this.getChainProvider(chainSlug)
      obj[chainSlug] = provider
    }

    return obj
  }

  public getChainProviderUrls = () => {
    const obj : Record<string, string> = {}
    for (const chainSlug of this.supportedChains) {
      const provider = this.getChainProvider(chainSlug)
      obj[chainSlug] = (provider as any)?.connection?.url
    }

    return obj
  }

  /**
   * @desc Returns the connected signer address.
   * @returns {String} Ethers signer address.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const address = await hop.getSignerAddress()
   *console.log(address)
   *```
   */
  public async getSignerAddress () {
    if (!this.signer) {
      throw new Error('signer not connected')
    }
    if (Signer.isSigner(this.signer)) {
      return (this.signer as Signer)?.getAddress()
    } else {
      throw new Error('signer is a provider and has no address')
    }
  }

  /**
   * @desc Returns the connected signer if it's connected to the specified
   * chain id, otherwise it returns a regular provider for the specified chain.
   * @param {Object} chain - Chain name or model
   * @param {Object} signer - Ethers signer or provider
   * @returns {Object} Ethers signer or provider
   */
  public async getSignerOrProvider (
    chain: TChain,
    signer: TProvider = this.signer as Signer
  ) {
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

  public getConfigAddresses (token: TToken, chain: TChain) {
    token = this.toTokenModel(token)
    chain = this.toChainModel(chain)
    return this.addresses?.[token.canonicalSymbol]?.[chain.slug]
  }

  public getL1BridgeAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l1Bridge
  }

  public getL2BridgeAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2Bridge
  }

  public getL1CanonicalBridgeAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l1CanonicalBridge
  }

  public getL2CanonicalBridgeAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2CanonicalBridge
  }

  public getL1CanonicalTokenAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l1CanonicalToken
  }

  public getL2CanonicalTokenAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2CanonicalToken
  }

  public getL2HopBridgeTokenAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2HopBridgeToken
  }

  public getL2AmmWrapperAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2AmmWrapper
  }

  public getL2SaddleSwapAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2SaddleSwap
  }

  public getL2SaddleLpTokenAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2SaddleLpToken
  }

  // Arbitrum ARB Chain address
  public getArbChainAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.arbChain
  }

  // xDai L1 Home AMB bridge address
  public getL1AmbBridgeAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l1Amb
  }

  // xDai L2 AMB bridge address
  public getL2AmbBridgeAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l2Amb
  }

  // Polygon Root Chain Manager address
  public getL1PosRootChainManagerAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l1PosRootChainManager
  }

  // Polygon ERC20 Predicate address
  public getL1PosErc20PredicateAddress (token: TToken, chain: TChain) {
    return this.getConfigAddresses(token, chain)?.l1PosPredicate
  }

  // Transaction overrides options
  public async txOverrides (chain: Chain) {
    const txOptions: any = {}
    if (this.gasPriceMultiplier) {
      txOptions.gasPrice = await this.getBumpedGasPrice(
        this.signer,
        this.gasPriceMultiplier
      )

      // Not all Polygon nodes follow recommended 30 Gwei gasPrice
      // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
      if (chain === Chain.Polygon) {
        if (txOptions.gasPrice.lt(MinPolygonGasPrice)) {
          txOptions.gasPrice = BigNumber.from(MinPolygonGasPrice)
        }
      }
    }

    return txOptions
  }

  protected _getBonderAddress (token: TToken, sourceChain: TChain, destinationChain: TChain): string {
    token = this.toTokenModel(token)
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)

    const bonder = this.bonders?.[token.canonicalSymbol]?.[sourceChain.slug]?.[destinationChain.slug]
    if (!bonder) {
      console.warn(`bonder address not found for route ${token.symbol}.${sourceChain.slug}->${destinationChain.slug}`)
    }

    return bonder
  }

  public getFeeBps (token: TToken, destinationChain: TChain) {
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

    const feeBps = fees[destinationChain.slug as ChainEnum] || 0
    return feeBps
  }

  setGasPriceMultiplier (gasPriceMultiplier: number) {
    return (this.gasPriceMultiplier = gasPriceMultiplier)
  }

  async getS3ConfigData () {
    const url = `https://assets.hop.exchange/${this.network}/v1-core-config.json`
    const res = await fetch(url)
    const json = await res.json()
    if (!json) {
      throw new Error('expected json object')
    }
    return json
  }

  public getContract = getContract

  getSupportedAssets () {
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

  getSupportedAssetsForChain (chain: TChain) {
    chain = this.toChainModel(chain)
    const supported = this.getSupportedAssets()
    return supported[chain.slug]
  }

  async getOptimismL1Fee (
    gasLimit : BigNumberish,
    data: string = '0x',
    to: string = constants.AddressZero
  ) {
    gasLimit = BigNumber.from(gasLimit.toString())
    const chain = this.toChainModel(Chain.Optimism)
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
}

export default Base
