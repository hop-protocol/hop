import { Signer } from 'ethers'
import { Chain, Token } from './models'
import HopBridge from './HopBridge'
import CanonicalBridge from './CanonicalBridge'
import Watcher from './watchers/Watcher'
import { Event } from './watchers/BaseWatcher'
import CanonicalWatcher from './watchers/CanonicalWatcher'
import { TChain, TToken, TProvider } from './types'
import Base from './Base'
import { Network } from './constants'
import _version from './version'

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

  /**
   * @desc Instantiates Hop SDK.
   * Returns a new Hop SDK instance.
   * @param {String} network - L1 network name (e.g. 'mainnet', 'kovan', 'goerli')
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} New Hop SDK instance.
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
  constructor (network: string = Network.Kovan, signer?: TProvider) {
    super(network, signer)
  }

  /**
   * @desc Returns a bridge set instance.
   * @param {Object} token - Token model or symbol of token of bridge to use.
   * @param {Object} sourceChain - Source chain model.
   * @param {Object} destinationChain - Destination chain model.
   * @returns {Object} A HopBridge instance.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.bridge(Token.USDC)
   *```
   */
  public bridge (token: TToken) {
    return new HopBridge(this.network, this.signer, token)
  }

  /**
   * @desc Returns a canonical bridge sdk instance.
   * @param {Object} token - Token model or symbol of token of canonical bridge to use.
   * @param {Object} chain - Chain model.
   * @returns {Object} A CanonicalBridge instance.
   * @example
   *```js
   *import { Hop, Token } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *const bridge = hop.canonicalBridge(Token.USDC)
   *```
   */
  public canonicalBridge (token: TToken, chain?: TChain) {
    return new CanonicalBridge(this.network, this.signer, token, chain)
  }

  /**
   * @desc Returns hop instance with signer connected. Used for adding or changing signer.
   * @param {Object} signer - Ethers `Signer` for signing transactions.
   * @returns {Object} A new Hop SDK instance with connected Ethers Signer.
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
  connect (signer: TProvider) {
    this.signer = signer
    return new Hop(this.network, signer)
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
  public getSignerAddress () {
    return (this.signer as Signer).getAddress()
  }

  /**
   * @desc Returns the SDK version.
   * @returns {String} version string
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   *console.log(hop.version)
   *```
   */
  public get version () {
    return _version
  }

  /**
   * @desc Watches for Hop transaction events.
   * @param {String} txHash - Source transaction hash.
   * @param {Token} token - Token name or model.
   * @param {Object} sourceChain - Source chain name or model.
   * @param {Object} destinationChain - Destination chain name or model.
   * @example
   *```js
   *import { Hop } from '@hop-protocol/sdk'
   *
   *const hop = new Hop()
   * hop
   *   .watch(tx.hash, Token.USDC, Chain.Ethereum, Chain.xDai)
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
  ) {
    // TODO: detect type of transfer
    return isCanonicalTransfer
      ? this.watchCanonical(txHash, token, sourceChain, destinationChain)
      : this.watchBridge(txHash, token, sourceChain, destinationChain, options)
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
      options
    }).watch()
  }

  public watchCanonical (
    txHash: string,
    token: TToken,
    sourceChain: TChain,
    destinationChain: TChain
  ) {
    return new CanonicalWatcher({
      network: this.network,
      signer: this.signer,
      sourceTxHash: txHash,
      token: token,
      sourceChain: sourceChain,
      destinationChain: destinationChain
    }).watch()
  }
}

export default Hop
