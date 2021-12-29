import { Chain } from 'src/constants'
import { FileConfig, Watchers, getEnabledNetworks, getEnabledTokens } from 'src/config'
import { URL } from 'url'

export function isValidToken (token: string) {
  const validTokens = getEnabledTokens()
  return validTokens.includes(token)
}

export function isValidNetwork (network: string) {
  const networks = getEnabledNetworks()
  return networks.includes(network)
}

export function validateKeys (validKeys: string[] = [], keys: string[]) {
  for (const key of keys) {
    if (!validKeys.includes(key)) {
      throw new Error(`unrecognized key "${key}". Valid keys are: ${validKeys.join(',')}`)
    }
  }
}

export async function validateConfig (config?: FileConfig) {
  if (!config) {
    throw new Error('config is required')
  }

  if (!(config instanceof Object)) {
    throw new Error('config must be a JSON object')
  }

  const validSectionKeys = [
    'network',
    'chains',
    'sync',
    'tokens',
    'commitTransfers',
    'bondWithdrawals',
    'settleBondedWithdrawals',
    'watchers',
    'db',
    'logging',
    'keystore',
    'addresses',
    'stateUpdateAddress',
    'metrics',
    'fees',
    'routes'
  ]

  const validWatcherKeys = [
    Watchers.BondTransferRoot,
    Watchers.BondWithdrawal,
    Watchers.Challenge,
    Watchers.CommitTransfers,
    Watchers.SettleBondedWithdrawals,
    Watchers.xDomainMessageRelay
  ]

  const sectionKeys = Object.keys(config)
  validateKeys(validSectionKeys, sectionKeys)
  const validNetworkKeys = [
    Chain.Ethereum,
    Chain.Optimism,
    Chain.Arbitrum,
    Chain.xDai,
    Chain.Polygon
  ]

  const validTokenKeys = [
    'USDC',
    'USDT',
    'DAI',
    'ETH',
    'MATIC',
    'WBTC'
  ]

  let enabledChains: string[] = []
  if (config.chains) {
    enabledChains = Object.keys(config.chains)
    validateKeys(validNetworkKeys, enabledChains)
    const validChainKeys = ['rpcUrl', 'waitConfirmations']
    if (!enabledChains.includes(Chain.Ethereum)) {
      throw new Error(`config for chain "${Chain.Ethereum}" is required`)
    }
    for (const chain in config.chains) {
      validateKeys(validChainKeys, Object.keys(config.chains[chain]))
      if (!config.chains[chain]) {
        throw new Error(`RPC config for chain "${chain}" is required`)
      }
      const { rpcUrl, waitConfirmations } = config.chains[chain]
      if (!rpcUrl) {
        throw new Error(`RPC url for chain "${chain}" is required`)
      }
      try {
        const parsed = new URL(rpcUrl)
        if (!parsed.protocol || !parsed.host || !['http:', 'https:'].includes(parsed.protocol)) {
          throw new URIError()
        }
      } catch (err) {
        throw new Error(`rpc url "${rpcUrl}" is invalid`)
      }
      if (waitConfirmations != null) {
        if (typeof waitConfirmations !== 'number') {
          throw new Error(`waitConfirmations for chain "${chain}" must be a number`)
        }
        if (waitConfirmations <= 0) {
          throw new Error(`waitConfirmations for chain "${chain}" must be greater than 0`)
        }
      }
    }
  }

  let enabledTokens: string[] = []
  if (config.tokens) {
    enabledTokens = Object.keys(config.tokens).filter(token => config.tokens[token])
    validateKeys(validTokenKeys, enabledTokens)
  }

  if (config.watchers) {
    const watcherKeys = Object.keys(config.watchers)
    validateKeys(validWatcherKeys, watcherKeys)
  }

  if (config.db) {
    const validDbKeys = ['location']
    const dbKeys = Object.keys(config.db)
    validateKeys(validDbKeys, dbKeys)
  }

  if (config.logging) {
    const validLoggingKeys = ['level']
    const loggingKeys = Object.keys(config.logging)
    validateKeys(validLoggingKeys, loggingKeys)

    if (config?.logging?.level) {
      const validLoggingLevels = ['debug', 'info', 'warn', 'error']
      await validateKeys(validLoggingLevels, [config?.logging?.level])
    }
  }

  if (config.keystore) {
    const validKeystoreProps = [
      'location',
      'pass',
      'passwordFile',
      'parameterStore'
    ]
    const keystoreProps = Object.keys(config.keystore)
    validateKeys(validKeystoreProps, keystoreProps)
  }

  if (config.metrics) {
    const validMetricsKeys = ['enabled', 'port']
    const metricsKeys = Object.keys(config.metrics)
    validateKeys(validMetricsKeys, metricsKeys)
  }

  if (config.addresses) {
    const validAddressesProps = [
      'location'
    ]
    const addressesProps = Object.keys(config.addresses)
    validateKeys(validAddressesProps, addressesProps)
  }

  if (config.routes) {
    const sourceChains = Object.keys(config.routes)
    validateKeys(enabledChains, sourceChains)
    for (const sourceChain in config.routes) {
      const destinationChains = Object.keys(config.routes[sourceChain])
      validateKeys(enabledChains, destinationChains)
    }
  }

  if (config.fees) {
    const tokens = Object.keys(config.fees)
    validateKeys(enabledTokens, tokens)
    const destinationChains = new Set()
    for (const sourceChain in config.routes) {
      for (const destinationChain of Object.keys(config.routes[sourceChain])) {
        destinationChains.add(destinationChain)
      }
    }
    for (const token in config.fees) {
      const chains = Object.keys(config.fees[token])
      validateKeys(enabledChains, chains)
      for (const chain of destinationChains) {
        const found = (config.fees[token] as any)?.[chain as string]
        if (!found) {
          throw new Error(`missing fee for chain "${chain}" for token "${token}"`)
        }
      }
    }
    for (const enabledToken of enabledTokens) {
      const found = config?.fees?.[enabledToken]
      if (!found) {
        throw new Error(`missing fee for token "${enabledToken}"`)
      }
    }
  }

  if (config.commitTransfers) {
    const validCommitTransfersKeys = ['minThresholdAmount']
    const commitTransfersKeys = Object.keys(config.commitTransfers)
    validateKeys(validCommitTransfersKeys, commitTransfersKeys)
    const minThresholdAmount = config.commitTransfers.minThresholdAmount
    const tokens = Object.keys(minThresholdAmount)
    validateKeys(enabledTokens, tokens)
    for (const token of enabledTokens) {
      if (!minThresholdAmount[token]) {
        throw new Error(`missing minThresholdAmount config for token "${token}"`)
      }
      const chains = Object.keys(minThresholdAmount[token])
      validateKeys(enabledChains, chains)
      for (const sourceChain in config.routes) {
        if (sourceChain === Chain.Ethereum) {
          continue
        }
        if (!minThresholdAmount[token][sourceChain]) {
          throw new Error(`missing minThresholdAmount config for token "${token}" source chain "${sourceChain}"`)
        }
        for (const destinationChain in config.routes[sourceChain]) {
          if (!minThresholdAmount[token][sourceChain][destinationChain]) {
            throw new Error(`missing minThresholdAmount config for token "${token}" source chain "${sourceChain}" destination chain "${destinationChain}"`)
          }
          if (typeof minThresholdAmount[token][sourceChain][destinationChain] !== 'number') {
            throw new Error(`minThresholdAmount config for token "${token}" source chain "${sourceChain}" destination chain "${destinationChain}" must be a number`)
          }
        }
      }
    }
  }
}
