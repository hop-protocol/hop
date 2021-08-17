import memoize from 'fast-memoize'
import { Addresses } from '@hop-protocol/core/addresses'
import { Contract, Signer, providers, BigNumber } from 'ethers'
import { Chain, Token as TokenModel } from './models'
import { TChain, TProvider, TToken } from './types'
import { metadata, config } from './config'

// cache provider
const getProvider = memoize((network: string, chain: Chain) => {
  const rpcUrls = config.chains[network][chain.slug].rpcUrls.slice(0, 3) // max of 3 endpoints
  const ethersProviders: providers.Provider[] = []
  for (let rpcUrl of rpcUrls) {
    const provider = new providers.StaticJsonRpcProvider(rpcUrl)
    ethersProviders.push(provider)
  }

  if (ethersProviders.length === 1) {
    return ethersProviders[0]
  }

  return new providers.FallbackProvider(ethersProviders, 1)
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
  let p = provider as any
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

  private addresses = config.addresses
  private chains = config.chains
  private bonders = config.bonders
  gasPriceMultiplier: number = 0

  /**
   * @desc Instantiates Base class.
   * Returns a new Base class instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @returns {Object} New Base class instance.
   */
  constructor (network: string, signer: TProvider) {
    if (!this.isValidNetwork(network)) {
      throw new Error(
        `network is unsupported. Supported networks are: ${this.supportedNetworks.join(
          ','
        )}`
      )
    }
    this.network = network
    if (signer) {
      this.signer = signer
    }
  }

  setConfigAddresses (addresses: Addresses) {
    if (addresses.bridges) {
      this.addresses[this.network] = addresses.bridges
    }
    if (addresses.bonders) {
      this.bonders[this.network] = addresses.bonders
    }
  }

  get supportedNetworks () {
    return Object.keys(this.chains)
  }

  isValidNetwork (network: string) {
    return this.supportedNetworks.includes(network)
  }

  get supportedChains () {
    return Object.keys(this.chains[this.network])
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
      let { name, decimals } = metadata.tokens[this.network][canonicalSymbol]
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
    const { chainId } = this.chains[this.network][chain.slug]
    return Number(chainId)
  }

  /**
   * @desc Returns Ethers provider for specified Chain model.
   * @param {Object} - Chain model.
   * @returns {Object} - Ethers provider.
   */
  public getChainProvider = (chain: Chain) => {
    return getProvider(this.network, chain)
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
    //console.log('getSignerOrProvider')
    chain = this.toChainModel(chain)
    if (!signer) {
      return chain.provider
    }
    if (Signer.isSigner(signer)) {
      if (!signer.provider) {
        throw new Error('connect a provider to signer')
      }
      const connectedChainId = await signer.getChainId()
      //console.log('connectedChainId: ', connectedChainId)
      //console.log('chain.chainId: ', chain.chainId)
      if (connectedChainId !== chain.chainId) {
        if (!signer.provider) {
          //console.log('connect provider')
          return (signer as Signer).connect(chain.provider)
        }
        //console.log('return chain.provider')
        return chain.provider
      }
      return signer
    } else {
      //console.log('isSigner')
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
    return this.addresses[this.network]?.[token.canonicalSymbol]?.[chain.slug]
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
    if (chain.equals(Chain.xDai)) {
      txOptions.gasLimit = 5000000
    }
    if (this.gasPriceMultiplier) {
      txOptions.gasPrice = await this.getBumpedGasPrice(
        this.signer,
        this.gasPriceMultiplier
      )
    }
    return txOptions
  }

  public getBonderAddress (token: TToken): string {
    token = this.toTokenModel(token)
    return this.bonders?.[this.network]?.[token.canonicalSymbol]?.[0]
  }

  public getBonderAddresses (token: TToken): string[] {
    token = this.toTokenModel(token)
    return this.bonders?.[this.network]?.[token.canonicalSymbol]
  }

  setGasPriceMultiplier (gasPriceMultiplier: number) {
    return (this.gasPriceMultiplier = gasPriceMultiplier)
  }

  public getContract = getContract
}

export default Base
