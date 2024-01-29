import Base, { BaseConstructorOptions, ChainProviders } from './Base'
import EventEmitter from 'eventemitter3'
import HopBridge from './HopBridge'
import Watcher from './watchers/Watcher'
import _version from './version'
import { ApiKeys } from './priceFeed'
import { Chain, Token } from './models'
import { Event } from './watchers/BaseWatcher'
import { TChain, TProvider, TToken } from './types'

/**
 * @desc Event watcher options
 */
type WatchOptions = {
  destinationHeadBlockNumber?: number
}

/**
 * Class reprensenting Hop
 * @namespace Hop
 */
class Hop extends Base {
  /** Event enum */
  static Event = Event

  /** Chain class */
  static Chain = Chain

  /** Token class */
  static Token = Token

  /** Event enum */
  Event = Event

  /** Chain class */
  Chain = Chain

  /** Token class */
  Token = Token

  priceFeedApiKeys: ApiKeys | null = null

  /**
   * @desc Instantiates Hop SDK.
   * Returns a new Hop SDK instance.
   * @param networkOrOptionsObject - L1 network name (e.g. 'mainnet', 'goerli')
   * @param signer - Ethers `Signer` for signing transactions.
   * @returns New Hop SDK instance.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop('mainnet')
   *```
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *const hop = new Hop('mainnet', signer)
   *```
   */
  // eslint-disable-next-line no-useless-constructor
  constructor (
    networkOrOptionsObject: string | BaseConstructorOptions,
    signer?: TProvider,
    chainProviders?: ChainProviders
  ) {
    super(networkOrOptionsObject, signer, chainProviders)
  }

  /**
   * @desc Returns a bridge set instance.
   * @param token - Token model or symbol of token of bridge to use.
   * @returns A HopBridge instance.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.bridge('USDC')
   *```
   */
  public bridge (token: TToken): HopBridge {
    const hopBridge = new HopBridge({
      network: this.network,
      signer: this.signer,
      token,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      customCoreConfigJsonUrl: this.customCoreConfigJsonUrl,
      customAvailableLiquidityJsonUrl: this.customAvailableLiquidityJsonUrl,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
    // port over exiting properties
    if (this.priceFeedApiKeys) {
      hopBridge.priceFeed.setApiKeys(this.priceFeedApiKeys)
    }
    hopBridge.baseConfigUrl = this.baseConfigUrl
    hopBridge.configFileFetchEnabled = this.configFileFetchEnabled
    return hopBridge
  }

  /**
   * @desc Returns hop instance with signer connected. Used for adding or changing signer.
   * @param signer - Ethers `Signer` for signing transactions.
   * @returns A new Hop SDK instance with connected Ethers Signer.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *import { Wallet } from 'ethers'
   *
   *const signer = new Wallet(privateKey)
   *let hop = new Hop()
   * // ...
   *hop = hop.connect(signer)
   *```
   */
  connect (signer: TProvider): Hop {
    this.signer = signer
    return new Hop({
      network: this.network,
      signer,
      chainProviders: this.chainProviders,
      baseConfigUrl: this.baseConfigUrl,
      configFileFetchEnabled: this.configFileFetchEnabled,
      blocklist: this.blocklist,
      debugTimeLogsEnabled: this.debugTimeLogsEnabled,
      debugTimeLogsCacheEnabled: this.debugTimeLogsCacheEnabled,
      debugTimeLogsCache: this.debugTimeLogsCache
    })
  }

  /**
   * @desc Returns the SDK version.
   * @returns version string
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *console.log(hop.version)
   *```
   */
  public get version () : string {
    return _version
  }

  /**
   * @desc Watches for Hop transaction events.
   * @param txHash - Source transaction hash.
   * @param token - Token name or model.
   * @param sourceChain - Source chain name or model.
   * @param destinationChain - Destination chain name or model.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   * hop
   *   .watch(tx.hash, 'USDC', Chain.Ethereum, Chain.Gnosis)
   *   .on('receipt', ({receipt, chain}) => {
   *     console.log(chain.Name, receipt)
   *   })
   *```
   */
  public watch (
    txHash: string,
    token: TToken,
    sourceChain: TChain,
    destinationChain: TChain,
    isCanonicalTransfer: boolean = false,
    options: WatchOptions = {}
  ): EventEmitter | Error {
    // TODO: detect type of transfer
    return this.watchBridge(txHash, token, sourceChain, destinationChain, options)
  }

  public watchBridge (
    txHash: string,
    token: TToken,
    sourceChain: TChain,
    destinationChain: TChain,
    options: WatchOptions = {}
  ) {
    token = this.toTokenModel(token)
    sourceChain = this.toChainModel(sourceChain)
    destinationChain = this.toChainModel(destinationChain)
    return new Watcher({
      network: this.network,
      signer: this.signer,
      sourceTxHash: txHash,
      token: token,
      sourceChain: sourceChain,
      destinationChain: destinationChain,
      chainProviders: this.chainProviders,
      options
    }).watch()
  }

  setPriceFeedApiKeys (apiKeys: ApiKeys = {}) {
    this.priceFeedApiKeys = apiKeys
  }
}

export default Hop
