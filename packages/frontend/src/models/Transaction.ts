import { ethers } from 'ethers'
import { EventEmitter } from 'events'
import { L1_NETWORK } from 'src/constants'
import { getRpcUrl } from 'src/utils'
import { getBaseExplorerUrl } from 'src/utils'
import Token from 'src/models/Token'
import { network as defaultNetwork } from 'src/config'

interface Config {
  networkName: string
  destNetworkName?: string | null
  hash: string
  pending?: boolean
  timestamp?: number
  token?: Token
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
  token: Token | null = null
  pending: boolean
  timestamp: number
  status: null | boolean = null

  constructor ({
    hash,
    networkName,
    destNetworkName,
    pending = true,
    timestamp,
    token
  }: Config) {
    super()
    this.hash = (hash || '').trim().toLowerCase()
    this.networkName = (networkName || defaultNetwork).trim().toLowerCase()
    let rpcUrl = ''
    if (networkName.startsWith('arbitrum')) {
      rpcUrl = getRpcUrl('arbitrum')
    } else if (networkName.startsWith('optimism')) {
      rpcUrl = getRpcUrl('optimism')
    } else if (networkName.startsWith('xdai')) {
      rpcUrl = getRpcUrl('xdai')
    } else if (networkName.startsWith('matc')) {
      rpcUrl = getRpcUrl('polygon')
    } else {
      rpcUrl = getRpcUrl(L1_NETWORK)
    }
    if (destNetworkName) {
      this.destNetworkName = destNetworkName
    }

    this.provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
    this.timestamp = timestamp || Date.now()
    if (token) {
      this.token = token
    }
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
    } else if (this.networkName.startsWith('xdai')) {
      return this._xdaiLink()
    } else if (this.networkName.startsWith('polygon')) {
      return this._polygonLink()
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
    return `${getBaseExplorerUrl(this.networkName)}tx/${this.hash}`
  }

  private _arbitrumLink () {
    return `${getBaseExplorerUrl('arbitrum')}tx/${this.hash}`
  }

  private _optimismLink () {
    try {
      const url = new URL(getBaseExplorerUrl('optimism'))
      return `${url.origin}${url.pathname}tx/${this.hash}${url.search}`
    } catch (err) {
      return ''
    }
  }

  private _xdaiLink () {
    return `${getBaseExplorerUrl('xdai')}tx/${this.hash}`
  }

  private _polygonLink () {
    return ''
  }

  toObject () {
    const {
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName
    } = this
    return { hash, networkName, pending, timestamp, token, destNetworkName }
  }

  static fromObject (obj: any) {
    const {
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName
    } = obj
    return new Transaction({
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName
    })
  }
}

export default Transaction
