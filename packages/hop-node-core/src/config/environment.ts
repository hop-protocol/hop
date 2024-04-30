import type { NetworkSlug } from '@hop-protocol/sdk'

export type CoreEnvironment = {
  // Gasboost
  setLatestNonceOnStart: string
  gasPriceMultiplier: number
  initialTxGasPriceMultiplier: number
  priorityFeePerGasCap: number
  maxGasPriceGwei: number
  timeTilBoostMs: number
  TxRetryDelayMs: number
  maxPriorityFeeConfidenceLevel: number
  blocknativeApiKey: string

  // AWS
  awsAccessKeyId: string
  awsSecretAccessKey: string
  awsRegion: string

  // Etherscan
  etherscanApiKeys: Record<string, string>

  // Other
  gitRev: string
  envNetwork: NetworkSlug | string
  rateLimitMaxRetries: number
  rpcTimeoutSeconds: number
  CoingeckoApiKey: string
  hostname: string
  appTld: string
}

export const setCoreEnvironment = (config: CoreEnvironment) => {
  return {
    // Other
    gitRev: config.gitRev,
    envNetwork: config.envNetwork,
    rateLimitMaxRetries: config.rateLimitMaxRetries,
    rpcTimeoutSeconds: config.rpcTimeoutSeconds,
    CoingeckoApiKey: config.CoingeckoApiKey,
    hostname: config.hostname,
    appTld: config.appTld,

    // Gasboost
    setLatestNonceOnStart: config.setLatestNonceOnStart,
    gasPriceMultiplier: config.gasPriceMultiplier,
    initialTxGasPriceMultiplier: config.initialTxGasPriceMultiplier,
    priorityFeePerGasCap: config.priorityFeePerGasCap,
    maxGasPriceGwei: config.maxGasPriceGwei,
    timeTilBoostMs: config.timeTilBoostMs,
    TxRetryDelayMs: config.TxRetryDelayMs,
    maxPriorityFeeConfidenceLevel: config.maxPriorityFeeConfidenceLevel,
    blocknativeApiKey: config.blocknativeApiKey,

    // AWS
    awsAccessKeyId: config.awsAccessKeyId,
    awsSecretAccessKey: config.awsSecretAccessKey,
    awsRegion: config.awsRegion,

    etherscanApiKeys: config.etherscanApiKeys,
  }
}
