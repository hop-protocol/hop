import { ethers } from 'ethers'
import { EventEmitter } from 'events'
import { L1_NETWORK } from 'src/constants'
import { getRpcUrl, getProvider, getBaseExplorerUrl } from 'src/utils'

import { Token } from '@hop-protocol/sdk'
import { network as defaultNetwork } from 'src/config'

interface Config {
  networkName: string
  destNetworkName?: string | null
  hash: string
  pending?: boolean
  timestamp?: number
  token?: Token
  isCanonicalTransfer?: boolean
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
  readonly isCanonicalTransfer: boolean = false
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
    token,
    isCanonicalTransfer
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
    } else if (networkName.startsWith('matic') || networkName.startsWith('polygon')) {
      rpcUrl = getRpcUrl('polygon')
    } else {
      rpcUrl = getRpcUrl(L1_NETWORK)
    }
    if (destNetworkName) {
      this.destNetworkName = destNetworkName
    }

    this.provider = getProvider(rpcUrl)
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
    if (typeof isCanonicalTransfer === 'boolean') {
      this.isCanonicalTransfer = isCanonicalTransfer
    }
    console.debug('transaction:', this.hash)
  }

  get explorerLink (): string {
    if (this.networkName.startsWith('ethereum')) {
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
    return `${getBaseExplorerUrl(this.networkName)}/tx/${this.hash}`
  }

  private _arbitrumLink () {
    return `${getBaseExplorerUrl('arbitrum')}/tx/${this.hash}`
  }

  private _optimismLink () {
    try {
      const url = new URL(getBaseExplorerUrl('optimism'))
      return `${url.origin}${url.pathname}/tx/${this.hash}${url.search}`
    } catch (err) {
      return ''
    }
  }

  private _xdaiLink () {
    return `${getBaseExplorerUrl('xdai')}/tx/${this.hash}`
  }

  private _polygonLink () {
    return `${getBaseExplorerUrl('polygon')}/tx/${this.hash}`
  }

  toObject () {
    const {
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName,
      isCanonicalTransfer
    } = this
    return { hash, networkName, pending, timestamp, token, destNetworkName, isCanonicalTransfer }
  }

  static fromObject (obj: any) {
    const {
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName,
      isCanonicalTransfer
    } = obj
    return new Transaction({
      hash,
      networkName,
      pending,
      timestamp,
      token,
      destNetworkName,
      isCanonicalTransfer
    })
  }
}

export default Transaction
