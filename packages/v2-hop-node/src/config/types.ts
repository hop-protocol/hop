import type { IGlobalConfig } from './configs/global/index.js'
import type { ISignerConfig } from './configs/signer/index.js'
import type { IClientConfig } from './configs/client/index.js'

export interface IConfig {
  global: IGlobalConfig
  signer: ISignerConfig
  client: IClientConfig
}
