import { type IRailsConfig, RailsConfig } from './RailsConfig.js'
import { type ICCTPConfig, CCTPConfig } from './CCTPConfig.js'
import { ClientName } from '#clients/index.js'

interface IClientConfig {
  [ClientName.Rails]: IRailsConfig
  [ClientName.CCTP]: ICCTPConfig
}

const ClientConfig: IClientConfig = {
  [ClientName.Rails]: RailsConfig,
  [ClientName.CCTP]: CCTPConfig
}

export async function initConfigs (config: IClientConfig): Promise<void> {
  await RailsConfig.initializeConfig(config.rails)
  await CCTPConfig.initializeConfig(config.cctp)
}

export { ClientConfig }
