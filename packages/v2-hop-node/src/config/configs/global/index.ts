import { type IGlobalOptionsConfig, validate as validateGlobalOptionsConfig } from './GlobalOptionsConfig.js'
import { validateRequiredKeys } from '../../utils.js'

enum GlobalConfigName {
  Options = 'options'
}

export interface IGlobalConfig {
  [GlobalConfigName.Options]: IGlobalOptionsConfig
}

export async function validate (config: Partial<IGlobalConfig>): Promise<void> {
  validateRequiredKeys<IGlobalConfig>(config, Object.values(GlobalConfigName))

  await validateGlobalOptionsConfig(config[GlobalConfigName.Options])
}
