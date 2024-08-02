import { SharedConfig, type ISharedConfig } from './configs/SharedConfig.js'
import { GasBoostConfig, type IGasBoostConfig } from './configs/GasBoostConfig.js'
import { parseUserDefinedConfigFile } from './utils.js'

interface IConfig {
  shared: ISharedConfig
  gasBoost: IGasBoostConfig
}

export type {
  ISharedConfig,
  IGasBoostConfig,
  IConfig
}

export async function initConfigs (): Promise<void> {
  const customConfig: any = await parseUserDefinedConfigFile()
  await SharedConfig.initializeConfig(customConfig.shared)
  await GasBoostConfig.initializeConfig(customConfig.gasBoost)
}

export {
  SharedConfig,
  GasBoostConfig
}