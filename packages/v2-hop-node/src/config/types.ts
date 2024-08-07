import type{ ISharedConfig } from './configs/SharedConfig.js'
import type { ISignerConfig } from './configs/SignerConfig.js'

export interface IConfig {
  shared: ISharedConfig
  signer: ISignerConfig
}
