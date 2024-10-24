import { type ISharedSignerConfig, validate as validateSharedSignerConfig } from './SharedSignerConfig.js'
import { type IMPCSignerConfig, validate as validateMPCSignerConfig } from './MPCSignerConfig.js'
import { type IValidationSignerConfig, validate as validateValidationSignerConfig } from './ValidationSignerConfig.js'
import { validateRequiredKeys } from '../../utils.js'

enum SignerConfigName {
  Shared = 'shared',
  MPC = 'mpc',
  Validation = 'validation'
}

export interface ISignerConfig {
  [SignerConfigName.Shared]: ISharedSignerConfig,
  [SignerConfigName.MPC]: IMPCSignerConfig,
  [SignerConfigName.Validation]: IValidationSignerConfig
}

export async function validate (config: Partial<ISignerConfig>): Promise<void> {
  validateRequiredKeys<ISignerConfig>(config, Object.values(SignerConfigName))

  await validateSharedSignerConfig(config[SignerConfigName.Shared])
  await validateMPCSignerConfig(config[SignerConfigName.MPC])
  await validateValidationSignerConfig(config[SignerConfigName.Validation])
}
