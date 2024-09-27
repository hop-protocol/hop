import { SharedConfig } from './configs/SharedConfig.js'
import { SignerConfig } from './configs/SignerConfig.js'
import { RailsConfig } from './configs/RailsConfig.js'
import { type ICLIConfig, CLIConfig } from './configs/CLIConfig.js'
import { parseUserDefinedConfigFile } from './utils.js'
import type { IConfig } from './types.js'
import { ClientName } from '#clients/index.js'

export async function initConfigs (cliConfig: ICLIConfig): Promise<void> {
  const customConfig: IConfig = await parseUserDefinedConfigFile(cliConfig.customConfigPath)

  // Config file
  await SharedConfig.initializeConfig(customConfig.shared)
  await SignerConfig.initializeConfig(customConfig.signer)

  // CLI options
  await CLIConfig.initializeConfig(cliConfig)
  if (cliConfig.clientName.toLowerCase() === ClientName.Rails.toLowerCase()) {
    await RailsConfig.initializeConfig(customConfig.rails)
  }
}

export {
  SharedConfig,
  SignerConfig,
  RailsConfig,
  CLIConfig,
  type ICLIConfig
}
