import { Chain } from 'src/constants'

export function validateKeys (validKeys: string[] = [], keys: string[]) {
  for (const key of keys) {
    if (!validKeys.includes(key)) {
      throw new Error(`unrecognized key "${key}"`)
    }
  }
}

export async function validateConfig (config: any) {
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
    'stake',
    'commitTransfers',
    'bondWithdrawals',
    'settleBondedWithdrawals',
    'roles',
    'watchers',
    'db',
    'logging',
    'keystore',
    'addresses',
    'order',
    'stateUpdateAddress'
  ]

  const validWatcherKeys = [
    'bondTransferRoot',
    'bondWithdrawal',
    'challenge',
    'commitTransfers',
    'settleBondedWithdrawals',
    'stake',
    'xDomainMessageRelay'
  ]

  const sectionKeys = Object.keys(config)
  await validateKeys(validSectionKeys, sectionKeys)

  if (config.chains) {
    const validNetworkKeys = [
      Chain.Ethereum,
      Chain.Optimism,
      Chain.Arbitrum,
      Chain.xDai,
      Chain.Polygon
    ]
    const networkKeys = Object.keys(config.chains)
    await validateKeys(validNetworkKeys, networkKeys)
  }

  if (config.roles) {
    const validRoleKeys = ['bonder', 'challenger', 'arbBot', 'xdaiBridge']
    const roleKeys = Object.keys(config.roles)
    await validateKeys(validRoleKeys, roleKeys)
  }

  if (config.watchers) {
    const watcherKeys = Object.keys(config.watchers)
    await validateKeys(validWatcherKeys, watcherKeys)
  }

  if (config.db) {
    const validDbKeys = ['location']
    const dbKeys = Object.keys(config.db)
    await validateKeys(validDbKeys, dbKeys)
  }

  if (config.logging) {
    const validLoggingKeys = ['level']
    const loggingKeys = Object.keys(config.logging)
    await validateKeys(validLoggingKeys, loggingKeys)

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
    await validateKeys(validKeystoreProps, keystoreProps)
  }

  if (config.commitTransfers) {
    const validCommitTransfersKeys = ['minThresholdAmount']
    const commitTransfersKeys = Object.keys(config.commitTransfers)
    await validateKeys(validCommitTransfersKeys, commitTransfersKeys)
  }

  if (config.addresses) {
    const validAddressesProps = [
      'location'
    ]
    const addressesProps = Object.keys(config.addresses)
    await validateKeys(validAddressesProps, addressesProps)
  }
}
