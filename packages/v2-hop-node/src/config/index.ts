import { SharedConfig, type ISharedConfig } from './configs/SharedConfig.js'
import { SignerConfig, type ISignerConfig } from './configs/SignerConfig.js'
import { parseUserDefinedConfigFile } from './utils.js'

interface IConfig {
  shared: ISharedConfig
  signer: ISignerConfig
}

export type {
  ISharedConfig,
  ISignerConfig,
  IConfig
}

export async function initConfigs (): Promise<void> {
  const customConfig: IConfig = await parseUserDefinedConfigFile()
  await SharedConfig.initializeConfig(customConfig.shared)
  await SignerConfig.initializeConfig(customConfig.signer)
}

export {
  SharedConfig,
  SignerConfig
}