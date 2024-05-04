import { type ChainSlug, type NetworkSlug } from '@hop-protocol/sdk'

export type Tokens = Record<string, boolean>

export type SignerType = 'keystore' | 'kms' | 'lambda'

export type SignerConfig = {
  type: SignerType
  keyId?: string
  awsRegion?: string
  lambdaFunctionName?: string
}

// TODO: Move default values here
export type CoreEnvironmentVariables = {
  // Gasboost
  setLatestNonceOnStart: boolean
  // TODO: These shouldn't be optional
  gasPriceMultiplier?: number
  initialTxGasPriceMultiplier?: number
  priorityFeePerGasCap?: number
  maxGasPriceGwei?: number
  timeTilBoostMs?: number
  maxPriorityFeeConfidenceLevel: number
  blocknativeApiKey: string

  // AWS
  awsAccessKeyId: string
  awsSecretAccessKey: string
  awsRegion: string

  // Other
  gitRev: string
  envNetwork: NetworkSlug
  rateLimitMaxRetries: number
  rpcTimeoutSeconds: number
  CoingeckoApiKey: string
  hostname: string
  appTld: string

  // From Parent, remove eventually
  bonderPrivateKey?: string
  signer?: SignerConfig
  network?: NetworkSlug
  rpcUrls?: any
}

export class CoreEnvironment {
  static #instance: CoreEnvironment
  #environment!: CoreEnvironmentVariables

  // Private for singleton instance
  private constructor() {}

  static getInstance():  CoreEnvironment {
    if (!CoreEnvironment.#instance) {
      CoreEnvironment.#instance = new CoreEnvironment()
    }
    return CoreEnvironment.#instance
  }

  /**
   * Getters
   */

  getEnvironment(): CoreEnvironmentVariables {
    return this.#environment
  }

  /**
   * Setters
   */

  setEnvironment(environment: CoreEnvironmentVariables) {
    this.#environment = { ...environment, ...this.#environment }
  }

  // From parent
  setRpcUrl(chainSlug: ChainSlug, rpcUrl: string) {
    if (!this.#environment?.rpcUrls) {
      this.#environment.rpcUrls = {}
    }
    this.#environment.rpcUrls[chainSlug] = rpcUrl
  }

  // From parent
  setBonderPrivateKey(bonderPrivateKey: string) {
    this.#environment.bonderPrivateKey = bonderPrivateKey
  }

  // From parent
  setSignerConfig(signer: SignerConfig) {
    this.#environment.signer = signer
  }
}
