import { SharedConfig } from './configs/SharedConfig.js'
import { SignerConfig } from './configs/SignerConfig.js'
import type { IConfig } from './types.js'
import { parseUserDefinedConfigFile } from './utils.js'

export async function initConfigs (): Promise<void> {
  const customConfig: IConfig = await parseUserDefinedConfigFile()
  await SharedConfig.initializeConfig(customConfig.shared)
  await SignerConfig.initializeConfig(customConfig.signer)
}

export {
  SharedConfig,
  SignerConfig
}
