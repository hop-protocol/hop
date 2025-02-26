import { type ICCTPClientConfig, validate as validateCCTPClientConfig } from './CCTPClientConfig.js'
import { type IRailsClientConfig, validate as validateRailsClientConfig } from './RailsClientConfig.js'
import { ClientName } from '#clients/index.js'
import { validateRequiredKeys } from '../../utils.js'

enum ClientConfigName {
  Rails = ClientName.Rails,
  CCTP = ClientName.CCTP
}

export interface IClientConfig {
  [ClientConfigName.Rails]: IRailsClientConfig
  [ClientConfigName.CCTP]: ICCTPClientConfig
}

export async function validate (config: Partial<IClientConfig>): Promise<void> {
  validateRequiredKeys<IClientConfig>(config, Object.values(ClientConfigName))

  await validateCCTPClientConfig(config[ClientConfigName.CCTP])
  await validateRailsClientConfig(config[ClientConfigName.Rails])
}
