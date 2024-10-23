import { type ICLIConfig, CLIConfig, initConfigs as initConfigsCLI } from './configs/cli/index.js'
import { ClientConfig, initConfigs as initConfigsClient } from './configs/client/index.js'
import { SharedConfig, initConfigs as initConfigsShared } from './configs/shared/index.js'
import { SignerConfig, initConfigs as initConfigsSigner } from './configs/signer/index.js'
import { parseUserDefinedConfigFile } from './utils.js'
import type { IConfig } from './types.js'

export async function initConfigs (cliConfig: ICLIConfig): Promise<void> {
  const customConfig: IConfig = await parseUserDefinedConfigFile(cliConfig.customConfigPath)

  // Config file
  await initConfigsCLI(cliConfig)
  await initConfigsShared(customConfig.shared)
  await initConfigsSigner(customConfig.signer)
  await initConfigsClient(customConfig.client)
}

export {
  CLIConfig,
  ClientConfig,
  SharedConfig,
  SignerConfig,
  type ICLIConfig
}
