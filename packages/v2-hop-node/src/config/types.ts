import type{ ISharedConfig } from './configs/SharedConfig.js'
import type { ISignerConfig } from './configs/SignerConfig.js'
import type { IRailsConfig } from './configs/RailsConfig.js'

export interface IConfig {
  shared: ISharedConfig
  signer: ISignerConfig
  rails: IRailsConfig
}
