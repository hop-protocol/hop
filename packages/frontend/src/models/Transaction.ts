import { ethers } from 'ethers'
import { EventEmitter } from 'events'
import { l1RpcUrl, arbitrumRpcUrl, optimismRpcUrl } from 'src/config'

interface Config {
  networkName: string
  destNetworkName?: string | null
  hash: string
  pending?: boolean
  timestamp?: number
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
  readonly destNetworkName: string | null = null
  readonly provider: ethers.providers.Provider
  pending: boolean
  timestamp: number
  status: null | boolean = null

  constructor ({
    hash,
    networkName,
    destNetworkName,
    pending = true,
    timestamp
  }: Config) {
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
    if (destNetworkName) {
      this.destNetworkName = destNetworkName
    }

    this.provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
    this.timestamp = timestamp || Date.now()
    this.pending = pending
    this.receipt().then((receipt: any) => {
      this.status = !!receipt.status
      this.pending = false
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

  async getTransaction () {
    return this.provider.getTransaction(this.hash)
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
    return `https://kovan-l2-explorer.surge.sh/tx/${this.hash}`
  }

  toObject () {
    const { hash, networkName, pending, timestamp } = this
    return { hash, networkName, pending, timestamp }
  }

  static fromObject (obj: any) {
    const { hash, networkName, pending, timestamp } = obj
    return new Transaction({ hash, networkName, pending, timestamp })
  }
}

export default Transaction
