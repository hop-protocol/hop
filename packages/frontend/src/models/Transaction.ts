interface Config {
  networkName: string
  hash: string
}

const standardNetworks = new Set([
  'mainnet',
  'ropsten',
  'kovan',
  'rinkeby',
  'goerli'
])

class Transaction {
  readonly hash: string
  readonly networkName: string

  constructor ({ hash, networkName }: Config) {
    this.hash = (hash || '').trim().toLowerCase()
    this.networkName = (networkName || 'mainnet').trim().toLowerCase()
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
