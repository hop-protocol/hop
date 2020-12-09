import { ethers } from 'ethers'
import { EventEmitter } from 'events'
import { l1RpcUrl, arbitrumRpcUrl, optimismRpcUrl } from 'src/config'

interface Config {
  networkName: string
  hash: string
  pending?: boolean
}

const standardNetworks = new Set([
  'mainnet',
  'ropsten',
  'kovan',
  'rinkeby',
  'goerli'
])

class Transaction extends EventEmitter {
  readonly hash: string
  readonly networkName: string
  readonly provider: ethers.providers.Provider
  private _pending: boolean

  constructor ({ hash, networkName, pending = true }: Config) {
    super()
    this.hash = (hash || '').trim().toLowerCase()
    this.networkName = (networkName || 'mainnet').trim().toLowerCase()
    let rpcUrl = ''
    if (networkName.startsWith('arbitrum')) {
      rpcUrl = arbitrumRpcUrl
    } else if (networkName.startsWith('optimism')) {
      rpcUrl = optimismRpcUrl
    } else {
      rpcUrl = l1RpcUrl
    }

    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    this._pending = pending
    this.receipt().then(() => {
      this._pending = false
      this.emit('pending', false, this)
    })
  }

  get explorerLink (): string {
    if (standardNetworks.has(this.networkName)) {
      return this._etherscanLink()
    } else if (this.networkName.startsWith('arbitrum')) {
      return this._arbitrumLink()
    } else if (this.networkName.startsWith('optimism')) {
      return this._optimismLink()
    } else {
      return ''
    }
  }

  get truncatedHash (): string {
    return `${this.hash.substring(0, 6)}…${this.hash.substring(62, 66)}`
  }

  async receipt () {
    return this.provider.waitForTransaction(this.hash)
  }

  get pending () {
    return this._pending
  }

  private _etherscanLink () {
    let subdomain = ''

    if (this.networkName !== 'mainnet') {
      subdomain = `${this.networkName}.`
    }

    return `https://${subdomain}etherscan.io/tx/${this.hash}`
  }

  private _arbitrumLink () {
    return `https://explorer.offchainlabs.com/#/tx/${this.hash}`
  }

  private _optimismLink () {
    // TODO: get optimism explorer url
    return this._etherscanLink()
  }
}

export default Transaction
